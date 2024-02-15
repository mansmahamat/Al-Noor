// import WidgetKit
// import SwiftUI
// import Foundation

// struct Provider: TimelineProvider {

    
//     func placeholder(in context: Context) -> SimpleEntry {
//         SimpleEntry(date: Date(), text: "", prayerTime: [])
//     }
    
//     func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
//         let entry = SimpleEntry(date: Date(), text: "", prayerTime: [])
//         completion(entry)
//     }
    
//     func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
//         let prayerArray = getArray()
//         let prayerTimes = convertToPrayerTimes(prayerArray: prayerArray)
//         let entry = SimpleEntry(date: Date(), text: "Prayer Timings", prayerTime: prayerTimes)
//         let timeline = Timeline(entries: [entry], policy: .never)
//         completion(timeline)
//     }



//     private func getArray() -> [[String: String]] {
//     let userDefaults = UserDefaults(suiteName: "group.com.mansjs.AlNoorPrayer")
//     guard let jsonString = userDefaults?.string(forKey: "prayerTime"),
//           let data = jsonString.data(using: .utf8),
//           let array = try? JSONDecoder().decode([[String: String]].self, from: data) else {
//         return []
//     }
//     return array
// }

    
//     private func convertToPrayerTimes(prayerArray: [[String: String]]) -> [PrayerTime] {
//         var prayerTimes: [PrayerTime] = []
//         for prayerDict in prayerArray {
//             if let name = prayerDict["name"], let time = prayerDict["time"] {
//                 prayerTimes.append(PrayerTime(name: name.capitalized, time: time))
//             }
//         }
//         return prayerTimes
//     }
    
//     private func formatTime(time: String) -> String {
//         let dateFormatter = DateFormatter()
//         dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
//         guard let date = dateFormatter.date(from: time) else {
//             return ""
//         }
//         dateFormatter.dateFormat = "HH:mm"
//         return dateFormatter.string(from: date)
//     }
// }

// struct SimpleEntry: TimelineEntry {
//     let date: Date
//     let text: String
//     let prayerTime: [PrayerTime]
// }

// struct WidgetEntryView: View {
//     var entry: Provider.Entry
//     var widgetFamily: WidgetFamily
    
//     var body: some View {
//         // Widget UI code
//         switch widgetFamily {
//         case .systemSmall:
//           return AnyView(
//                  VStack {
              
//                    ZStack {
//                                    Color(hex: "4c6c53").edgesIgnoringSafeArea(.all)
//                                    VStack(alignment: .leading, spacing: 5) {
//                                        ForEach(entry.prayerTime, id: \.self) { prayer in
//                                            let icon = iconForPrayer(prayerName: prayer.name)
//                                            let textColor = textColorForPrayer(prayerName: prayer.name, timings: entry.prayerTime)
//                                            HStack(spacing: 10) {
//                                                icon
//                                                    .foregroundColor(.white)
//                                                    .font(.system(size: 10))
//                                                Text(prayer.name)
//                                                    .font(.system(size: 10))
//                                                    .bold()
//                                                    .foregroundColor(textColor)
//                                                Text(prayer.time)
//                                                    .font(.system(size: 10))
//                                                    .bold()
//                                                    .foregroundColor(textColor)
//                                            }
//                                            .padding(.vertical, 5)
//                                        }
//                                    }
//                                    .padding()
//                                }
//             }
           
//             )


          
            
//         case .systemMedium:
//             return 
//             AnyView(
//               VStack {
           
//                 ZStack {
//                                 Color(hex: "4c6c53").edgesIgnoringSafeArea(.all)
//                                 VStack(alignment: .leading, spacing: 5) {
//                                     ForEach(entry.prayerTime, id: \.self) { prayer in
//                                         let icon = iconForPrayer(prayerName: prayer.name)
//                                         let textColor = textColorForPrayer(prayerName: prayer.name, timings: entry.prayerTime)
//                                         HStack(spacing: 10) {
//                                             icon
//                                                 .foregroundColor(textColor)
//                                                 .font(.system(size: 10))
//                                             Text(prayer.name)
//                                                 .font(.system(size: 10))
//                                                 .bold()
//                                                 .foregroundColor(textColor)
//                                             Text(prayer.time)
//                                                 .font(.system(size: 10))
//                                                 .bold()
//                                                 .foregroundColor(textColor)
//                                         }
//                                         .padding(.vertical, 5)
//                                     }
//                                 }
//                                 .padding()
//                             }
//          }
        
//             )
            
//         case .systemLarge:
//           return AnyView(
//             VStack {
         
//               ZStack {
//                               Color(hex: "4c6c53").edgesIgnoringSafeArea(.all)
//                               VStack(alignment: .leading, spacing: 5) {
//                                   ForEach(entry.prayerTime, id: \.self) { prayer in
//                                       let icon = iconForPrayer(prayerName: prayer.name)
//                                       let textColor = textColorForPrayer(prayerName: prayer.name, timings: entry.prayerTime)
//                                       HStack(spacing: 10) {
//                                           icon
//                                               .foregroundColor(.white)
//                                               .font(.system(size: 10))
//                                           Text(prayer.name)
//                                               .font(.system(size: 10))
//                                               .bold()
//                                               .foregroundColor(textColor)
//                                           Text(prayer.time)
//                                               .font(.system(size: 10))
//                                               .bold()
//                                               .foregroundColor(textColor)
//                                       }
//                                       .padding(.vertical, 5)
//                                   }
//                               }
//                               .padding()
//                           }
//        }
      
            
//           )

//         default:
//             return AnyView(EmptyView())
        
//         }




//     }
    
//     private func iconForPrayer(prayerName: String) -> Image {
//         switch prayerName.lowercased() {
//         case "fajr":
//             return Image(systemName: "moon.circle.fill")
//         case "dhuhr", "asr":
//             return Image(systemName: "sun.max.fill")
//         case "maghrib":
//             return Image(systemName: "sunset.fill")
//         case "isha":
//             return Image(systemName: "moon.stars.fill")
//         default:
//             return Image(systemName: "questionmark")
//         }
//     }
  
//   private func getNextPrayer(prayerTimes: [PrayerTime]) -> PrayerTime {
//           let currentDate = Date()
//           let dateFormatter = DateFormatter()
//           dateFormatter.dateFormat = "HH:mm"
          
//           let currentTimeString = dateFormatter.string(from: currentDate)
//           guard let currentTime = dateFormatter.date(from: currentTimeString) else {
//               return PrayerTime(name: "", time: "") // Return empty prayer time if current time parsing fails
//           }
          
//           let upcomingPrayers = prayerTimes.filter { prayer in
//               if let prayerTimeDate = dateFormatter.date(from: prayer.time) {
//                   return prayerTimeDate > currentTime
//               }
//               return false
//           }
          
//           if let nextPrayer = upcomingPrayers.first {
//               return nextPrayer
//           }
          
//           // Return empty prayer time if no upcoming prayers found
//           return PrayerTime(name: "", time: "")
//       }
      
    
//     private func textColorForPrayer(prayerName: String, timings: [PrayerTime]) -> Color {
//         let currentDate = Date()
//         let dateFormatter = DateFormatter()
//         dateFormatter.dateFormat = "HH:mm"
        
//         let currentTimeString = dateFormatter.string(from: currentDate)
//         guard let currentTime = dateFormatter.date(from: currentTimeString) else {
//             return Color(hex: "FFFFFF") // Default white color
//         }
        
//         // Convert timings array to dictionary for easy lookup
//         let prayerTimingsDict = Dictionary(uniqueKeysWithValues: timings.map { ($0.name, $0.time) })
        
//         // Find the index of the closest upcoming prayer
//         var closestPrayerName = ""
//         var closestPrayerTimeDifference = TimeInterval.greatestFiniteMagnitude
        
//         for (prayerName, prayerTime) in prayerTimingsDict {
//             if let prayerTimeDate = dateFormatter.date(from: prayerTime) {
//                 let timeDifference = prayerTimeDate.timeIntervalSince(currentTime)
//                 if timeDifference > 0 && timeDifference < closestPrayerTimeDifference {
//                     closestPrayerTimeDifference = timeDifference
//                     closestPrayerName = prayerName
//                 }
//             }
//         }
        
//         // Check if the current prayer name matches the given prayer name
//         if prayerName == closestPrayerName {
//             return Color(hex: "FDBE91") // Highlight the next prayer in orange
//         }
        
//         return Color(hex: "FFFFFF") // Default white color
//     }
// }

// @main
// struct MyWidget: Widget {
//     let kind: String = "widget"
//     let widgetFamily: WidgetFamily // Add widgetFamily property
    
//     init() {
//         self.widgetFamily = .systemSmall // Default to systemSmall
//     }
    
//     var body: some WidgetConfiguration {
//         StaticConfiguration(kind: kind, provider: Provider()) { entry in
//             WidgetEntryView(entry: entry, widgetFamily: widgetFamily) // Pass widgetFamily here
//         }
//         .configurationDisplayName("Prayer Times Widget")
//         .description("Displays the timings of the five daily prayers.")
//         .supportedFamilies([.systemSmall, .systemLarge, .systemMedium])
//     }
// }

// struct Widget_Previews: PreviewProvider {
//     static var previews: some View {
//         WidgetEntryView(entry: SimpleEntry(date: Date(), text: "Preview", prayerTime: [PrayerTime(name: "Fajr", time: "03:05"), PrayerTime(name: "Dhuhr", time: "13:07"), PrayerTime(name: "Asr", time: "17:25"), PrayerTime(name: "Maghrib", time: "21:10"), PrayerTime(name: "Isha", time: "23:08")] ), widgetFamily: .systemSmall)
//             .previewContext(WidgetPreviewContext(family: .systemSmall))
//     }
// }

// struct PrayerTime: Hashable {
//     let name: String
//     let time: String
// }

// extension Color {
//     init(hex: String) {
//         let scanner = Scanner(string: hex)
//         var rgbValue: UInt64 = 0
        
//         scanner.scanHexInt64(&rgbValue)
        
//         let red = CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0
//         let green = CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0
//         let blue = CGFloat(rgbValue & 0x0000FF) / 255.0
        
//         self.init(red: Double(red), green: Double(green), blue: Double(blue))
//     }
// }


import WidgetKit
import SwiftUI
import Foundation

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), text: "Placeholder", prayerTime: "Placeholder", prayerName: "Placeholder")
    }
    
    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), text: "Snapshot", prayerTime: "Snapshot", prayerName: "Snapshot")
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let text = getItem()
        let prayerTime = getPrayerTime()
        let prayerName = getNextPrayerName()
        
        let entry = SimpleEntry(date: Date(), text: text, prayerTime: prayerTime, prayerName: prayerName)
        
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }
    
    
    private func getItem() -> String {
        let userDefaults = UserDefaults(suiteName: "group.com.mansjs.AlNoorPrayer")
        return userDefaults?.string(forKey: "savedData") ?? ""
    }

     private func getPrayerTime() -> String {
        let userDefaults = UserDefaults(suiteName: "group.com.mansjs.AlNoorPrayer")
        return userDefaults?.string(forKey: "prayerTime") ?? ""
    }

     private func getNextPrayerName() -> String {
        let userDefaults = UserDefaults(suiteName: "group.com.mansjs.AlNoorPrayer")
        return userDefaults?.string(forKey: "prayerName") ?? ""
    }
    
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let text: String
    let prayerTime: String
    let prayerName: String
}

struct KeywordBubbleDefaultPadding: View {
    let keyword: String
    let symbol: String
    var body: some View {
        VStack {
            Text(keyword)
                .font(.headline)
                .foregroundColor(Color(hex: "4c6c53"))
                .padding(.horizontal)
                .padding(.vertical, 4)
                .padding(.top, -20) // Adjust as needed to position above the title
            
           
        }
    }
}

struct widgetEntryView : View {
    var entry: Provider.Entry
    
    var body: some View {
        if entry.text.isEmpty {
            Text("Placeholder Text")
        } else {
            ZStack {
                // Green background
                Color(hex: "4c6c53").edgesIgnoringSafeArea(.all)
                
                VStack {
                     Text("Al Noor Prayer")
                         .font(.system(size: 16, weight: .light, design: .serif))
                         .italic()
                        .foregroundColor(.white) // Add KeywordBubbleDefaultPadding view
                        .padding(.top, 10)
                    
                    Text(entry.prayerName)
                        .font(.title)
                        .foregroundColor(.white) // Set text color to white
                        .padding(.top, 20)

                    Spacer()
                    
                    Text(entry.prayerTime)
                        .font(.title)
                        .foregroundColor(.white) // Set text color to white
                        .padding(.top, 20)
                    // Text(Date(), formatter: DateFormatter.timeOnlyFormatter) // Display formatted time
                    //     .font(.body)
                    //     .foregroundColor(.white)
                }
                .padding()
            }
        }
    }
}

extension DateFormatter {
    static let timeOnlyFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter
    }()
}

@main
struct widget: Widget {
    let kind: String = "widget"
    
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
        }
        .configurationDisplayName("Widget name")
        .description("Widget description")
        .supportedFamilies([.systemSmall])
    }
}

struct widget_Previews: PreviewProvider {
    static var previews: some View {
        widgetEntryView(entry: SimpleEntry(date: Date(), text: "Preview", prayerTime: "Preview", prayerName: "Preview"))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
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