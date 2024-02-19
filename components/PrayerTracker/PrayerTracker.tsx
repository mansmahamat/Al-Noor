import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { H5, ListItem, ScrollView, Separator, SizableText, Tabs, TabsContentProps, XStack, YGroup } from 'tamagui'; // Import your UI components
import DateTimePicker from '@react-native-community/datetimepicker';
import { XCircle } from '@tamagui/lucide-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeatMap from '@uiw/react-heat-map';
import {

    ContributionGraph, LineChart, ProgressChart,
} from "react-native-chart-kit";
import { ContributionChartValue } from 'react-native-chart-kit/dist/contribution-graph/ContributionGraph';
import { RectProps } from 'react-native-svg';
import Swiper from 'react-native-web-swiper';
import { MyStack } from '../MyStack';
import { capitalizeFirstLetter } from '../../app/utils/utils';


const PrayerTracker = () => {
    const [date, setDate] = useState(new Date());
    const today = new Date();
    const [prayerStatus, setPrayerStatus] = useState([]);

    useEffect(() => {
        loadPrayerStatus();
    }, []);

    // Load prayer status from AsyncStorage
    const loadPrayerStatus = async () => {
        try {
            const savedPrayerStatus = await AsyncStorage.getItem('globalPrayerStatus');
            if (savedPrayerStatus !== null) {
                setPrayerStatus(JSON.parse(savedPrayerStatus));
            } else {
                setPrayerStatus([]);
            }
        } catch (error) {
            console.error('Error loading prayer status:', error);
        }
    };

    // Save prayer status to AsyncStorage
    const savePrayerStatus = async () => {
        try {
            await AsyncStorage.setItem('globalPrayerStatus', JSON.stringify(prayerStatus));
        } catch (error) {
            console.error('Error saving prayer status:', error);
        }
    };

    // Toggle prayer completion status
    const togglePrayerStatus = (selectedDate, prayerName) => {
        const updatedStatus = [...prayerStatus];
        const index = updatedStatus.findIndex(status => status.date === formatDate(selectedDate));
        if (index !== -1) {
            updatedStatus[index][prayerName.toLowerCase()] = !updatedStatus[index][prayerName.toLowerCase()];
        } else {
            const newStatus = { date: formatDate(selectedDate) };
            prayerList.forEach(prayer => {
                newStatus[prayer.name.toLowerCase()] = prayer.name.toLowerCase() === prayerName.toLowerCase();
            });
            updatedStatus.push(newStatus);
        }
        setPrayerStatus(updatedStatus);
        savePrayerStatus();
    };

    // Reset date to today
    const resetDate = () => {
        setDate(new Date());
    };

    // Format date to yyyy/mm/dd
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const prayerList = [
        { name: 'Fajr', time: '05:30 AM' },
        { name: 'Dhuhr', time: '12:30 PM' },
        { name: 'Asr', time: '03:45 PM' },
        { name: 'Maghrib', time: '06:00 PM' },
        { name: 'Isha', time: '08:00 PM' },
    ];


    // Convert the countMap into the desired format
    const countMap = {};

    // Iterate over each object in the data array
    prayerStatus.forEach(entry => {
        const date = entry.date;
        let count = 0;

        // Count the number of prayers completed on this date
        Object.values(entry).forEach(value => {
            if (typeof value === 'boolean' && value === true) {
                count++;
            }
        });

        // Update the count for this date in the countMap
        countMap[date] = (countMap[date] || 0) + count;
    });

    // Convert the countMap into the desired format
    const formattedData = Object.entries(countMap).map(([date, count]) => ({
        date: formatDates(date),
        count
    }));

    console.log(formattedData);

    // Function to format date
    function formatDates(dateString) {
        return dateString.replace(/\//g, "-");
    }

    console.log(prayerStatus);
    const value = [
        { date: "2017-01-02", count: 1 },
        { date: "2017-01-03", count: 2 },
        { date: "2017-01-04", count: 3 },
        { date: "2017-01-05", count: 4 },
        { date: "2017-01-06", count: 5 },
        { date: "2017-01-30", count: 2 },
        { date: "2017-01-31", count: 3 },
        { date: "2017-03-01", count: 2 },
        { date: "2017-04-02", count: 4 },
        { date: "2017-03-05", count: 2 },
        { date: "2017-02-30", count: 4 }
    ];

    const chartConfig = {
        // backgroundGradientFrom: "#1E2923",
        // backgroundGradientFromOpacity: 0,
        // backgroundGradientTo: "#08130D",
        // backgroundGradientToOpacity: 0.5,
        //  backgroundColor: "#FF5733",
        backgroundColor: "#e26a00",
        color: (opacity = 1) => `rgba(76, 168, 83, ${opacity})`,
        strokeWidth: 3, // optional, default 3
        barPercentage: 0.5,
        gutterSize: 5,

        useShadowColorFromDataset: false // optional
    };

    const screenWidth = Dimensions.get("window").width;
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0);
    const dateOnly = endDate.toISOString().split('T')[0];


    // line chart data
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so add 1

    // Filter data for the current month
    const currentMonthData = prayerStatus.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === currentYear && entryDate.getMonth() + 1 === currentMonth;
    });

    // Initialize count for each prayer
    const count = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };

    // Count occurrences of each prayer in the filtered data
    currentMonthData.forEach(entry => {
        Object.keys(entry).forEach(key => {
            if (key !== 'date' && entry[key]) {
                count[key]++;
            }
        });
    });

    // Divide all counts by 100
    for (let key in count) {
        count[key] /= 100;
    }


    // Format data as required
    const formattedDataChart = {
        labels: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
        data: Object.values(count)
    };

    // BEZIER LINE CHART DATA    

    const monthCounts = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0
    };

    prayerStatus.forEach(entry => {
        const entryDate = new Date(entry.date);
        const month = entryDate.toLocaleString('en-US', { month: 'long' });

        // Initialize count for the month if it doesn't exist
        if (!monthCounts[month]) {
            monthCounts[month] = 0;
        }

        // Count the number of true values for each prayer
        Object.values(entry).forEach(value => {
            if (typeof value === 'boolean' && value === true) {
                monthCounts[month]++;
            }
        });
    });

    // Extract counts for each month
    const labels = Object.keys(monthCounts);
    const dataValues = Object.values(monthCounts);

    // Define the data object in the specified format
    const datas = {
        labels: labels,
        datasets: [
            {
                data: dataValues,
                color: (opacity = 1) => `rgba(255, 207, 51 , ${opacity})`, // Optional: customize the color
                strokeWidth: 2 // Optional: customize the strokeWidth
            }
        ],
        legend: ["All Prayers Count"] // Optional: customize the legend
    };


    // Define the data object in the specified format
    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ["Rainy Days"] // optional
    };


    console.log("monthCounts", prayerStatus);




    return (
        <MyStack>
            <ScrollView>

                <YGroup space="$4" >
                    <XStack alignItems="center" justifyContent="center" borderColor="$color" borderRadius="$4">
                        <DateTimePicker
                            testID="dateTimePicker"
                            style={{ backgroundColor: "#4c6c53" }}
                            textColor="#ffffff"
                            themeVariant="dark"
                            collapsable={true}
                            value={date}
                            mode="date"
                            is24Hour={true}
                            onChange={(event, selectedDate) => setDate(selectedDate || date)}
                        />
                        {date.toDateString() !== today.toDateString() && <TouchableOpacity onPress={resetDate}>
                            <XCircle style={{ marginLeft: 5 }} size={24} color="red" />
                        </TouchableOpacity>}
                    </XStack>

                    <YGroup separator={<Separator />} alignSelf="center" height="80%" width="100%">
                        {prayerList.map((prayer, index) => (
                            <YGroup.Item key={index}>
                                <ListItem
                                    backgroundColor="#4c6c53"
                                    color="white"
                                    borderColor="#ffffff"
                                    height="$6"
                                    title={capitalizeFirstLetter(prayer.name)}
                                    onPress={() => togglePrayerStatus(date, prayer.name)}
                                >
                                    {prayerStatus.find(status => status.date === formatDate(date))?.[prayer.name.toLowerCase()] && <Text>✓</Text>}
                                </ListItem>
                            </YGroup.Item>
                        ))}

                        <Tabs
                            defaultValue="tab1"
                            orientation="horizontal"
                            flexDirection="column"
                            width={400}
                            height={300}
                            marginTop="$8"
                            borderRadius="$4"
                            borderWidth="$0.25"
                            overflow="hidden"
                            borderColor="$borderColor"
                        >
                            <Tabs.List
                                separator={<Separator vertical />}
                                disablePassBorderRadius="bottom"
                                aria-label="Manage your account"
                            >
                                <Tabs.Tab flex={1} value="tab1">
                                    <SizableText fontFamily="$body">Graph</SizableText>
                                </Tabs.Tab>
                                <Tabs.Tab flex={1} value="tab2">
                                    <SizableText fontFamily="$body">Progress</SizableText>
                                </Tabs.Tab>
                                <Tabs.Tab flex={1} value="tab3">
                                    <SizableText fontFamily="$body">All</SizableText>
                                </Tabs.Tab>
                            </Tabs.List>
                            <Separator />
                            <TabsContent value="tab1">
                                {/* @ts-ignore */}

                                <ContributionGraph
                                    values={formattedData}
                                    endDate={new Date(dateOnly)}

                                    numDays={167}
                                    squareSize={13}
                                    width={screenWidth - 36}
                                    height={250}
                                    chartConfig={chartConfig} />
                            </TabsContent>

                            <TabsContent value="tab2">
                                <ProgressChart
                                    data={formattedDataChart}
                                    width={screenWidth - 36}
                                    height={200}
                                    strokeWidth={12}
                                    radius={32}
                                    chartConfig={chartConfig}
                                    hideLegend={false}
                                />
                            </TabsContent>

                            <TabsContent value="tab3">
                                <LineChart
                                    data={datas}
                                    width={screenWidth}
                                    height={200}
                                    verticalLabelRotation={30}
                                    chartConfig={chartConfig}
                                    bezier
                                />
                            </TabsContent>
                        </Tabs>
                        {/* @ts-ignore */}

                        {/* <ContributionGraph
                                values={formattedData}
                                endDate={new Date(dateOnly)}

                                numDays={167}
                                squareSize={13}
                                width={screenWidth - 36}
                                height={220}
                                chartConfig={chartConfig} />
                            <ProgressChart
                                data={formattedDataChart}
                                width={screenWidth - 36}
                                height={200}
                                strokeWidth={12}
                                radius={32}
                                chartConfig={chartConfig}
                                hideLegend={false}
                            /> */}


                    </YGroup>

                </YGroup>
            </ScrollView>

        </MyStack>
    );
};

const TabsContent = (props: TabsContentProps) => {
    return (
        <Tabs.Content
            backgroundColor="#000"
            key="tab3"
            alignItems="center"
            height={500}
            h={500}
            justifyContent="center"
            flex={1}
            borderColor="$background"
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            {...props}
        >
            {props.children}
        </Tabs.Content>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slideContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slide1: {
        backgroundColor: 'pink',
        color: 'white',
    },
    slide2: {
        backgroundColor: 'pink',
    },
    slide3: {
        backgroundColor: 'pink',
    },
});

export default PrayerTracker;
