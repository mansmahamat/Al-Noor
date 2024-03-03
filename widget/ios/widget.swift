

import WidgetKit
import SwiftUI
import Charts

struct Provider: TimelineProvider {

    
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), text: "", prayerTime: [], streakDays: [])
    }
    
    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), text: "", prayerTime: [], streakDays: [])
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let prayerArray = getArray()
        let streakDaysArray = getItem()
        let prayerTimes = convertToPrayerTimes(prayerArray: prayerArray)
        let entry = SimpleEntry(date: Date(), text: "Prayer Timings", prayerTime: prayerTimes, streakDays:  streakDaysArray)
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }



    private func getArray() -> [[String: String]] {
    let userDefaults = UserDefaults(suiteName: "group.com.mansjs.AlNoorPrayer")
    guard let jsonString = userDefaults?.string(forKey: "prayerTime"),
          let data = jsonString.data(using: .utf8),
          let array = try? JSONDecoder().decode([[String: String]].self, from: data) else {
        return []
    }
    return array
}

private func getItem() -> [Int] {
        let userDefaults = UserDefaults(suiteName: "group.com.mansjs.AlNoorPrayer")
        guard let jsonString = userDefaults?.string(forKey: "streakDays"),
          let data = jsonString.data(using: .utf8),
          let array = try? JSONDecoder().decode([Int].self, from: data) else {
        return []
    }
    return array
    }

private func getStreakDays() -> [Int] {
    let userDefaults = UserDefaults(suiteName: "group.com.mansjs.AlNoorPrayer")
    guard let jsonString = userDefaults?.string(forKey: "streakDays"),
          let data = jsonString.data(using: .utf8),
          let array = try? JSONDecoder().decode([Int].self, from: data) else {
        return [2, 3]
    }
    return array
}



    
    private func convertToPrayerTimes(prayerArray: [[String: String]]) -> [PrayerTime] {
        var prayerTimes: [PrayerTime] = []
        for prayerDict in prayerArray {
            if let name = prayerDict["name"], let time = prayerDict["time"] {
                prayerTimes.append(PrayerTime(name: name.capitalized, time: time))
            }
        }
        return prayerTimes
    }
    
    private func formatTime(time: String) -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        guard let date = dateFormatter.date(from: time) else {
            return ""
        }
        dateFormatter.dateFormat = "HH:mm"
        return dateFormatter.string(from: date)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let text: String
    let prayerTime: [PrayerTime]
    let streakDays: [Int]
}

struct ToyShape: Identifiable {
    var color: String
    var type: String
    var count: Double
    var id = UUID()
}

var stackedBarData: [ToyShape] = [
    .init(color: "Green", type: "Cube", count: 2),
    .init(color: "Green", type: "Sphere", count: 0),
    .init(color: "Green", type: "Pyramid", count: 1),
    .init(color: "Purple", type: "Cube", count: 1),
    .init(color: "Purple", type: "Sphere", count: 1),
    .init(color: "Purple", type: "Pyramid", count: 1),
    .init(color: "Pink", type: "Cube", count: 1),
    .init(color: "Pink", type: "Sphere", count: 2),
    .init(color: "Pink", type: "Pyramid", count: 0),
    .init(color: "Yellow", type: "Cube", count: 1),
    .init(color: "Yellow", type: "Sphere", count: 1),
    .init(color: "Yellow", type: "Pyramid", count: 2)
]

struct MonthlyHoursOfSunshine {
    var city: String
    var date: Date
    var hoursOfSunshine: Double


    init(city: String, month: Int, hoursOfSunshine: Double) {
        let calendar = Calendar.autoupdatingCurrent
        self.city = city
        self.date = calendar.date(from: DateComponents(year: 2020, month: month))!
        self.hoursOfSunshine = hoursOfSunshine
    }
}

struct Food: Identifiable {
    let name: String
    let price: Double
    let date: Date
    let id = UUID()


    init(name: String, price: Double, year: Int) {
        self.name = name
        self.price = price
        let calendar = Calendar.autoupdatingCurrent
        self.date = calendar.date(from: DateComponents(year: year))!
    }
}

let cheeseburgerCostByItem: [Food] = [
    .init(name: "Burger", price: 0.07, year: 1),
    .init(name: "Cheese", price: 0.03, year: 1),
    .init(name: "Bun", price: 0.05, year: 1),
    .init(name: "Burger", price: 0.10, year: 2),
    .init(name: "Cheese", price: 0.04, year: 2),
    .init(name: "Bun", price: 0.06, year: 2),
    // ...
    .init(name: "Burger", price: 0.60, year: 8),
    .init(name: "Cheese", price: 0.26, year: 8),
    .init(name: "Bun", price: 0.24, year: 8)
]


struct WidgetView: View {
    @Environment(\.widgetFamily) var family
        
        // Get the placeholder entry or snapshot entry based on your requirements
          var entry: Provider.Entry

    var body: some View {
        switch family {
        case .systemSmall:
          StocksSmall(entry: entry)

        case .systemMedium:
          CalendarWidget(entry: entry)
        case .systemLarge:
            BarChart()
        default:
            Text("Unsupported widget family")
        }
    }
}

struct DayView: View {
    let day: Int
    let isHighlighted: Bool

    var body: some View {
        VStack {
            Text("\(day)")
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(isHighlighted ? .white : .primary)
                .padding(6)
                .background(isHighlighted ? Color(hex: "4c6c53") : Color.clear)
                .clipShape(Circle())
        }
    }
}

struct CalendarWidget: View {
    // Example: Fixed set of days for demonstration
   var entry: Provider.Entry

   let daysInMonth = (1...31)
//   //  let streakDays = entry.streakDays

    var body: some View {
        VStack {
            // Days of the week
            HStack {
                ForEach(DateFormatter().shortWeekdaySymbols, id: \.self) { weekday in
                    Text(weekday)
                        .font(.system(size: 10))
                        .fontWeight(.semibold)
                        .foregroundColor(.secondary)
                        .padding(.horizontal, 2)
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(.vertical, 4)

            // Calendar days
            ForEach(0..<5) { weekIndex in
                HStack(spacing: 0) {
                    ForEach(0..<7) { dayIndex in
                        let day = (weekIndex * 7) + dayIndex + 1
                        if self.daysInMonth.contains(day) {
                            let isHighlighted = entry.streakDays.contains(day)
                            DayView(day: day, isHighlighted: isHighlighted)
                                .frame(width: 44, height: 14)
                        } else {
                            Spacer(minLength: 0)
                        }
                    }
                }
                .padding(.vertical, 2)
            }
        }
        .padding(4)
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .shadow(color: Color.black.opacity(0.1), radius: 3, x: 0, y: 2)
    }

}



struct CalendarWidgetPreview: Widget {
    let kind: String = "CalendarWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            CalendarWidget(entry: entry)
        }
        .configurationDisplayName("Calendar Widget")
        .description("A widget to display the current month's calendar.")
        .supportedFamilies([.systemSmall])
    }
}

struct CalendarWidget_Previews: PreviewProvider {
    static var previews: some View {
        CalendarWidget(entry : SimpleEntry(date: Date(), text: "Preview", prayerTime: [], streakDays: [3, 7, 12, 17, 18, 22, 29]) )
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}

struct LineChart: View {
    var body: some View {
      if #available(iOSApplicationExtension 16.0, *) {
    Chart(cheeseburgerCostByItem) { cost in
    AreaMark(
        x: .value("Date", cost.date),
        y: .value("Price", cost.price)
    )
    .foregroundStyle(by: .value("Food Item", cost.name))
}
      } else {
        // Fallback on earlier versions
      }
    }
}

struct BarChart: View {
    var body: some View {
      if #available(iOSApplicationExtension 16.0, *) {
        Chart {
          ForEach(stackedBarData) { shape in
            BarMark(
              x: .value("Shape Type", shape.type),
              y: .value("Total Count", shape.count)
            )
            .foregroundStyle(by: .value("Shape Color", shape.color))
          }
        }
      } else {
        // Fallback on earlier versions
      }
    }
}



struct StocksSmall: View {
      var entry: Provider.Entry
  var body: some View {
      VStack {
              
                   ZStack {
                                   Color(hex: "4c6c53").edgesIgnoringSafeArea(.all)
                                   VStack(alignment: .leading, spacing: 5) {
                                       ForEach(entry.prayerTime, id: \.self) { prayer in
                                           let icon = iconForPrayer(prayerName: prayer.name)
                                           let textColor = textColorForPrayer(prayerName: prayer.name, timings: entry.prayerTime)
                                           HStack(spacing: 10) {
                                               icon
                                                   .foregroundColor(.white)
                                                   .font(.system(size: 10))
                                               Text(prayer.name)
                                                   .font(.system(size: 10))
                                                   .bold()
                                                   .foregroundColor(textColor)
                                               Text(prayer.time)
                                                   .font(.system(size: 10))
                                                   .bold()
                                                   .foregroundColor(textColor)
                                           }
                                           .padding(.vertical, 5)
                                       }
                                   }
                                   .padding()
                               }
            }
     }

         private func iconForPrayer(prayerName: String) -> Image {
        switch prayerName.lowercased() {
        case "fajr":
            return Image(systemName: "moon.circle.fill")
        case "dhuhr", "asr":
            return Image(systemName: "sun.max.fill")
        case "maghrib":
            return Image(systemName: "sunset.fill")
        case "isha":
            return Image(systemName: "moon.stars.fill")
        default:
            return Image(systemName: "questionmark")
        }
    }
  
  private func getNextPrayer(prayerTimes: [PrayerTime]) -> PrayerTime {
          let currentDate = Date()
          let dateFormatter = DateFormatter()
          dateFormatter.dateFormat = "HH:mm"
          
          let currentTimeString = dateFormatter.string(from: currentDate)
          guard let currentTime = dateFormatter.date(from: currentTimeString) else {
              return PrayerTime(name: "", time: "") // Return empty prayer time if current time parsing fails
          }
          
          let upcomingPrayers = prayerTimes.filter { prayer in
              if let prayerTimeDate = dateFormatter.date(from: prayer.time) {
                  return prayerTimeDate > currentTime
              }
              return false
          }
          
          if let nextPrayer = upcomingPrayers.first {
              return nextPrayer
          }
          
          // Return empty prayer time if no upcoming prayers found
          return PrayerTime(name: "", time: "")
      }
      
    
    private func textColorForPrayer(prayerName: String, timings: [PrayerTime]) -> Color {
        let currentDate = Date()
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "HH:mm"
        
        let currentTimeString = dateFormatter.string(from: currentDate)
        guard let currentTime = dateFormatter.date(from: currentTimeString) else {
            return Color(hex: "FFFFFF") // Default white color
        }
        
        // Convert timings array to dictionary for easy lookup
        let prayerTimingsDict = Dictionary(uniqueKeysWithValues: timings.map { ($0.name, $0.time) })
        
        // Find the index of the closest upcoming prayer
        var closestPrayerName = ""
        var closestPrayerTimeDifference = TimeInterval.greatestFiniteMagnitude
        
        for (prayerName, prayerTime) in prayerTimingsDict {
            if let prayerTimeDate = dateFormatter.date(from: prayerTime) {
                let timeDifference = prayerTimeDate.timeIntervalSince(currentTime)
                if timeDifference > 0 && timeDifference < closestPrayerTimeDifference {
                    closestPrayerTimeDifference = timeDifference
                    closestPrayerName = prayerName
                }
            }
        }
        
        // Check if the current prayer name matches the given prayer name
        if prayerName == closestPrayerName {
            return Color(hex: "FDBE91") // Highlight the next prayer in orange
        }
        
        return Color(hex: "FFFFFF") // Default white color
    }
}



  struct StocksMedium: View {
      var entry: Provider.Entry

    var body: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 16) {
                ForEach(entry.prayerTime, id: \.self) { prayer in
                    VStack(spacing: 16) {
                        HStack {
                            iconForPrayer(prayerName: prayer.name)
                                .foregroundColor(.white)
                                .font(.system(size: 24)) // Adjust icon size as needed
                            Text(prayer.name)
                                .font(.headline)
                                .foregroundColor(textColorForPrayer(prayerName: prayer.name, timings: entry.prayerTime))
                            Spacer()
                            Text(prayer.time)
                                .font(.system(size: 18, weight: .bold, design: .rounded))
                                .foregroundColor(textColorForPrayer(prayerName: prayer.name, timings: entry.prayerTime))
                        }
                        Text(getNextPrayer(prayerTimes: entry.prayerTime).name)
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(textColorForPrayer(prayerName: prayer.name, timings: entry.prayerTime))
                    }
                    .padding()
                    .frame(width: 155, height: 155)
                    .background(Color(UIColor.secondarySystemBackground))
                    .cornerRadius(24)
                }
            }
            .padding()
        }
    }

         private func iconForPrayer(prayerName: String) -> Image {
        switch prayerName.lowercased() {
        case "fajr":
            return Image(systemName: "moon.circle.fill")
        case "dhuhr", "asr":
            return Image(systemName: "sun.max.fill")
        case "maghrib":
            return Image(systemName: "sunset.fill")
        case "isha":
            return Image(systemName: "moon.stars.fill")
        default:
            return Image(systemName: "questionmark")
        }
    }
  
 private func getNextPrayer(prayerTimes: [PrayerTime]) -> PrayerTime {
          let currentDate = Date()
          let dateFormatter = DateFormatter()
          dateFormatter.dateFormat = "HH:mm"
          
          let currentTimeString = dateFormatter.string(from: currentDate)
          guard let currentTime = dateFormatter.date(from: currentTimeString) else {
              return PrayerTime(name: "", time: "") // Return empty prayer time if current time parsing fails
          }
          
          let upcomingPrayers = prayerTimes.filter { prayer in
              if let prayerTimeDate = dateFormatter.date(from: prayer.time) {
                  return prayerTimeDate > currentTime
              }
              return false
          }
          
          if let nextPrayer = upcomingPrayers.first {
              return nextPrayer
          }
          
          // Return empty prayer time if no upcoming prayers found
          return PrayerTime(name: "", time: "")
      }
      
    
    private func textColorForPrayer(prayerName: String, timings: [PrayerTime]) -> Color {
        let currentDate = Date()
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "HH:mm"
        
        let currentTimeString = dateFormatter.string(from: currentDate)
        guard let currentTime = dateFormatter.date(from: currentTimeString) else {
            return Color(hex: "FFFFFF") // Default white color
        }
        
        // Convert timings array to dictionary for easy lookup
        let prayerTimingsDict = Dictionary(uniqueKeysWithValues: timings.map { ($0.name, $0.time) })
        
        // Find the index of the closest upcoming prayer
        var closestPrayerName = ""
        var closestPrayerTimeDifference = TimeInterval.greatestFiniteMagnitude
        
        for (prayerName, prayerTime) in prayerTimingsDict {
            if let prayerTimeDate = dateFormatter.date(from: prayerTime) {
                let timeDifference = prayerTimeDate.timeIntervalSince(currentTime)
                if timeDifference > 0 && timeDifference < closestPrayerTimeDifference {
                    closestPrayerTimeDifference = timeDifference
                    closestPrayerName = prayerName
                }
            }
        }
        
        // Check if the current prayer name matches the given prayer name
        if prayerName == closestPrayerName {
            return Color(hex: "FDBE91") // Highlight the next prayer in orange
        }
        
        return Color(hex: "FFFFFF") // Default white color
    }
    
    
  }




struct StocksLarge: View {
  var body: some View {
      VStack(spacing: 16) {
        
        VStack(alignment: .leading, spacing: 4) {
            Text("$104.78").font(.system(.title, design: .rounded)).fontWeight(.bold)
            
            HStack(spacing: 4) {
                Image(systemName: "arrow.up")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(Color(UIColor.systemGreen))
                .frame(width: 12, height: 12)
                .contentShape(Rectangle())
                
                Text("+ 2.12%").font(.subheadline).foregroundColor(Color(UIColor.systemGreen))
        
            }
          
          
         
        }
        
        HStack {
            
            Text("Last Operations :")
            .fontWeight(.bold)
                .foregroundColor(Color(UIColor.black))
                .lineLimit(1)
            
            Spacer()
        }
        
          HStack {
            Image(systemName: "plus.circle.fill")
                   .font(.system(size: 16, weight: .bold))
                   .foregroundColor(Color(UIColor.systemGreen))
               Text("Salary - 8390 $")
                   .fontWeight(.medium)
                   .foregroundColor(Color(UIColor.label))
                   .lineLimit(1)
              
              Spacer()
          }
        HStack {
          Image(systemName: "minus.circle.fill")
                 .font(.system(size: 16, weight: .bold))
                 .foregroundColor(Color(UIColor.systemRed))
             Text("Phone - 120 $")
                 .fontWeight(.medium)
                 .foregroundColor(Color(UIColor.label))
                 .lineLimit(1)
            
            Spacer()
        }
        HStack {
          Image(systemName: "minus.circle.fill")
                 .font(.system(size: 16, weight: .bold))
                 .foregroundColor(Color(UIColor.systemRed))
             Text("Gym - 80 $")
                 .fontWeight(.medium)
                 .foregroundColor(Color(UIColor.label))
                 .lineLimit(1)
            
            Spacer()
        }
        HStack {
          Image(systemName: "plus.circle.fill")
                 .font(.system(size: 16, weight: .bold))
                 .foregroundColor(Color(UIColor.systemGreen))
             Text("Stripe - 20 $")
                 .fontWeight(.medium)
                 .foregroundColor(Color(UIColor.label))
                 .lineLimit(1)
            
            Spacer()
        }
        
          
          HStack {
            Image(systemName: "minus.circle.fill")
                   .font(.system(size: 16, weight: .bold))
                   .foregroundColor(Color(UIColor.systemRed))
               Text("Seadfood - 160 $")
                   .fontWeight(.medium)
                   .foregroundColor(Color(UIColor.label))
                   .lineLimit(1)
              
              Spacer()
          }
          
          
        
      }
      .padding(.horizontal)
      .frame(width: 350, height: 355)
      .background(Color(UIColor.secondarySystemBackground))
      .cornerRadius(24)
      .padding()
  }
}

@main
struct widget: Widget {
    let kind: String = "widget"
    
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            WidgetView(entry: entry) // Use the WidgetView here
        }
        .configurationDisplayName(" Prayer Timings")
        .description("Shows the current prayer timings.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct widget_Previews: PreviewProvider {
    static var previews: some View {
        WidgetView(entry: SimpleEntry(date: Date(), text: "Preview", prayerTime: [PrayerTime(name: "Fajr", time: "03:05"), PrayerTime(name: "Dhuhr", time: "13:07"), PrayerTime(name: "Asr", time: "17:25"), PrayerTime(name: "Maghrib", time: "21:10"), PrayerTime(name: "Isha", time: "23:08")], streakDays: [3, 7, 12, 17, 18, 22, 29]))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}

struct PrayerTime: Hashable {
    let name: String
    let time: String
}

extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        var rgbValue: UInt64 = 0
        
        scanner.scanHexInt64(&rgbValue)
        
        let red = CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0
        let green = CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0
        let blue = CGFloat(rgbValue & 0x0000FF) / 255.0
        
        self.init(red: Double(red), green: Double(green), blue: Double(blue))
    }
}
