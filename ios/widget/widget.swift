import WidgetKit
import SwiftUI
import Foundation

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), text: "Placeholder", prayerTime: "Placeholder")
    }
    
    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), text: "Snapshot", prayerTime: "Snapshot")
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let text = "Random info from API" // Placeholder text
        
        // Fetch Asr prayer time from the API
        getAsrPrayerTimeFromAPI { asrTime in
            guard let asrTime = asrTime else {
                let entry = SimpleEntry(date: Date(), text: text, prayerTime: "Unknown")
                let timeline = Timeline(entries: [entry], policy: .never)
                completion(timeline)
                return
            }
            
            let entry = SimpleEntry(date: Date(), text: asrTime, prayerTime: asrTime)
            let timeline = Timeline(entries: [entry], policy: .never)
            completion(timeline)
        }
    }
    
    private func getAsrPrayerTimeFromAPI(completion: @escaping (String?) -> Void) {
        // Replace the placeholder URL with your actual API endpoint
        guard let url = URL(string: "http://api.aladhan.com/v1/calendar/2017/4?latitude=51.508515&longitude=-0.1254872&method=2 http://api.aladhan.com/v1/calendar/2019?latitude=51.508515&longitude=-0.1254872&method=2") else {
            completion(nil)
            return
        }
        
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                completion(nil)
                return
            }
            
            do {
                // Parse the JSON response
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let dataArray = json["data"] as? [[String: Any]],
                   let firstData = dataArray.first,
                   let timings = firstData["timings"] as? [String: String],
                   let asrTime = timings["Asr"] {
                    completion(asrTime)
                } else {
                    completion(nil)
                }
            } catch {
                completion(nil)
            }
        }
        
        task.resume()
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let text: String
    let prayerTime: String
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
                    
                    Text(entry.text)
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
        widgetEntryView(entry: SimpleEntry(date: Date(), text: "Preview", prayerTime: "Preview"))
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
