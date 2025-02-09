import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, Dimensions, Platform, StyleSheet, View, ScrollView } from 'react-native';
import { Button, H2, ListItem, Paragraph, Separator, SizableText, Tabs, TabsContentProps, XStack, YGroup, YStack } from 'tamagui'; // Import your UI components
import { capitalizeFirstLetter } from '../../../utils/utils';
import { XCircle } from '@tamagui/lucide-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyStack } from '../../../components/MyStack';
import {
    ContributionGraph, LineChart, ProgressChart,
} from "react-native-chart-kit";
import useLanguageStore from '../../../store/languagesStore';
import moment from 'moment';
import { setArray } from '../../../../modules/widget';
import CalendarDateTimePicker from '../../../components/Calendar/Calendar';
import { i18n } from "../../../lib/i18n";
import { Link, useRouter } from 'expo-router';



const GROUP_NAME = "group.com.mansjs.AlNoorPrayer";


const setSharedDataArray = setArray(GROUP_NAME);

const Tracker = () => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const router = useRouter();


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


    // Update the countMap creation
    const countMap = {};

    // Iterate over each object in the prayerStatus array
    prayerStatus.forEach(entry => {
        const date = entry.date;
        let count = 0;

        // Count the number of prayers completed on this date
        Object.entries(entry).forEach(([key, value]) => {
            if (key !== 'date' && value === true) {
                count++;
            }
        });

        // Update the count for this date in the countMap
        countMap[date] = count;
    });

    // Convert the countMap into the format needed for ContributionGraph
    const formattedData = Object.entries(countMap).map(([date, count]) => ({
        date: formatDates(date),
        count: count // Using count directly for the graph
    }));


    // Filter the streak days for the current month with a count of 5
    const currentMonthStreak = moment().month() + 1; // Months are 0-indexed, so add 1
    const currentYearStreak = moment().year();

    // Filter the array for dates with count 5 and in the current month
    const streakDays = formattedData
        .filter(item => {
            const itemDate = moment(item.date);
            return itemDate.month() + 1 === currentMonthStreak && itemDate.year() === currentYearStreak && item.count === 5;
        })
        .map(item => moment(item.date).date())
        .sort((a, b) => a - b); // Extract the day part






    const togglePrayerStatus = (selectedDate: Date, prayerName: string) => {
        const formattedDate = formatDate(selectedDate);
        const updatedStatus = [...prayerStatus];
        const index = updatedStatus.findIndex(status => status.date === formattedDate);
        
        if (index !== -1) {
            // Toggle existing status
            updatedStatus[index] = {
                ...updatedStatus[index],
                [prayerName.toLowerCase()]: !updatedStatus[index][prayerName.toLowerCase()]
            };
        } else {
            // Create new status entry
            const newStatus = {
                date: formattedDate,
                fajr: false,
                dhuhr: false,
                asr: false,
                maghrib: false,
                isha: false,
                [prayerName.toLowerCase()]: true
            };
            updatedStatus.push(newStatus);
        }
        
        setPrayerStatus(updatedStatus);
        savePrayerStatus();
    };


    setSharedDataArray("streakDays", streakDays);

    useEffect(() => {

        setSharedDataArray("streakDays", streakDays);

    }, [prayerStatus]);







    // Function to format date
    function formatDates(dateString) {
        return dateString.replace(/\//g, "-");
    }


    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 1,
        color: (opacity = 1) => {
            // Customize colors based on prayer count
            if (opacity >= 0.8) return 'rgba(76, 108, 83, 1)';      // 5 prayers - darkest
            if (opacity >= 0.6) return 'rgba(76, 108, 83, 0.8)';    // 4 prayers
            if (opacity >= 0.4) return 'rgba(76, 108, 83, 0.6)';    // 3 prayers
            if (opacity >= 0.2) return 'rgba(76, 108, 83, 0.4)';    // 2 prayers
            return 'rgba(76, 108, 83, 0.2)';                        // 1 prayer - lightest
        },
    };

    const screenWidth = Dimensions.get("window").width;
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st
    const endDate = new Date(currentDate.getFullYear(), 11, 31); // December 31st
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
        labels: ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"],
        data: Object.values(count),
        colors: [
            'rgba(76, 108, 83, 1)',  // Main green
            'rgba(76, 108, 83, 0.9)', // Slightly lighter
            'rgba(76, 108, 83, 0.8)', // Even lighter
            'rgba(76, 108, 83, 0.7)', // Even lighter
            'rgba(76, 108, 83, 0.6)'  // Lightest
        ]
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
        labels: labels.map(label => label.substring(0, 3)),
        datasets: [
            {
                data: dataValues,
                color: (opacity = 1) => `rgba(76, 108, 83, ${opacity})`, // Your green
                strokeWidth: 3
            }
        ],
        legend: ["Monthly Prayer Count"]
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


    const { language } = useLanguageStore();
    i18n.locale = language;


    const onChange = (event, selectedDate) => {
        setShow(false);
        setDate(selectedDate || date)
    };

    const showDatepicker = () => {
        setShow(true);
    };



    return (
        <MyStack>
            <ScrollView showsVerticalScrollIndicator={false}>
                <YGroup space="$4" paddingHorizontal="$4">
                    <XStack paddingVertical="$4">
                        <H2 textAlign='center' fontSize={28} fontWeight="600">
                            {i18n.t('prayerTracker.title')}
                        </H2>
                    </XStack>

                    <YStack 
                        backgroundColor="rgba(76, 108, 83, 0.08)"
                        padding="$4"
                        borderRadius="$6"
                        width="100%"
                        borderWidth={1}
                        borderColor="rgba(76, 108, 83, 0.15)"
                        pressStyle={{
                            opacity: 0.8,
                            scale: 0.98,
                        }}
                        animation="quick"
                        elevation={2}
                        shadowColor="rgba(76, 108, 83, 0.15)"
                        shadowRadius={8}
                        shadowOffset={{ width: 0, height: 2 }}
                    >
                        <Link href="/home/fasting" asChild>
                            <YStack space="$2">
                                <Paragraph 
                                    fontWeight="700" 
                                    fontSize={18} 
                                    color="#4c6c53"
                                    textAlign="left"
                                >
                                    {i18n.t("fasting.title")} →
                                </Paragraph>
                                <Paragraph 
                                    fontSize={15} 
                                    opacity={0.9}
                                    color="#4c6c53"
                                    lineHeight={20}
                                >
                                    {i18n.t("fasting.description")}
                                </Paragraph>
                            </YStack>
                        </Link>
                    </YStack>

                    <XStack 
                        alignItems="center" 
                        justifyContent="center" 
                        marginVertical="$2"
                        space="$2"
                    >
                        <Button
                            size="$3"
                            backgroundColor={Platform.OS === "android" ? "#007AFF" : "#F2F2F7"}
                            borderRadius="$4"
                            pressStyle={{ opacity: 0.8 }}
                            onPress={() => setShow(true)}
                        >
                            <Text 
                                color={Platform.OS === "android" ? "white" : "#007AFF"} 
                                fontSize={15} 
                                fontWeight="500"
                            >
                                {moment(date).format("MMM D, YYYY")}
                            </Text>
                        </Button>
                        
                        {show && <CalendarDateTimePicker 
                            date={date} 
                            onChange={onChange}
                            showPicker={show}
                            onPress={() => setShow(true)}
                        />}
                        
                        {date.toDateString() !== today.toDateString() && (
                            <Button
                                size="$3"
                                backgroundColor="#FF3B30"
                                borderRadius="$4"
                                pressStyle={{ opacity: 0.8 }}
                                onPress={resetDate}
                                paddingHorizontal="$3"
                            >
                                <Text color="white" fontSize={15} fontWeight="500">
                                    Today
                                </Text>
                            </Button>
                        )}
                    </XStack>

                    <YGroup 
                        separator={<Separator opacity={0.2} />} 
                        backgroundColor="white"
                        borderRadius="$6"
                        overflow="hidden"
                    >
                        {prayerList.map((prayer, index) => {
                            const isPrayerCompleted = prayerStatus.find(
                                status => status.date === formatDate(date)
                            )?.[prayer.name.toLowerCase()];

                            return (
                                <YGroup.Item key={index}>
                                    <ListItem
                                        backgroundColor="white"
                                        height={60}
                                        onPress={() => togglePrayerStatus(date, prayer.name)}
                                        pressStyle={{ opacity: 0.8 }}
                                        animation="quick"
                                    >
                                        <XStack flex={1} alignItems="center" justifyContent="space-between">
                                            <Text style={{ fontSize: 16, color: '$color' }}>
                                                {capitalizeFirstLetter(prayer.name)}
                                            </Text>
                                            <View 
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 16,
                                                    backgroundColor: isPrayerCompleted ? '#4c6c53' : '#f2f2f7',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderWidth: 2,
                                                    borderColor: isPrayerCompleted ? '#4c6c53' : '#e5e5ea'
                                                }}
                                            >
                                                {isPrayerCompleted && (
                                                    <Text style={{ 
                                                        color: 'white', 
                                                        fontSize: 16,
                                                        fontWeight: '600'
                                                    }}>
                                                        ✓
                                                    </Text>
                                                )}
                                            </View>
                                        </XStack>
                                    </ListItem>
                                </YGroup.Item>
                            );
                        })}
                    </YGroup>

                    <Tabs
                        defaultValue="tab1"
                        orientation="horizontal"
                        flexDirection="column"
                        width="100%"
                        height={350}
                        marginTop="$4"
                        borderRadius="$6"
                        overflow="hidden"
                        backgroundColor="white"
                    >
                        <Tabs.List
                            separator={<Separator vertical />}
                            backgroundColor="rgba(76, 108, 83, 0.05)"
                        >
                            <Tabs.Tab flex={1} value="tab1">
                                <SizableText fontFamily="$body" fontSize={15} color="#4c6c53">Graph</SizableText>
                            </Tabs.Tab>
                            <Tabs.Tab flex={1} value="tab2">
                                <SizableText fontFamily="$body" fontSize={15} color="#4c6c53">Progress</SizableText>
                            </Tabs.Tab>
                            <Tabs.Tab flex={1} value="tab3">
                                <SizableText fontFamily="$body" fontSize={15} color="#4c6c53">All</SizableText>
                            </Tabs.Tab>
                        </Tabs.List>

                        <Separator />
                        <TabsContent value="tab1">
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={true}
                                contentContainerStyle={{ paddingHorizontal: 10 }}
                            >
                                <ContributionGraph
                                    values={formattedData}
                                    endDate={endDate}
                                    numDays={365}
                                    squareSize={14}
                                    width={screenWidth * 1.5}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: "#ffffff",
                                        backgroundGradientFrom: "#ffffff",
                                        backgroundGradientTo: "#ffffff",
                                        decimalPlaces: 1,
                                        color: (opacity = 1) => `rgba(76, 108, 83, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(76, 108, 83, 0.8)`,
                                        style: {
                                            borderRadius: 16
                                        }
                                    }}
                                    tooltipDataAttrs={(value: ContributionChartValue) => ({
                                        'data-tooltip': `${moment(value.date).format('MMM D, YYYY')}: ${value.count} prayers`,
                                        fill: value.count === 5 ? 'rgba(76, 108, 83, 1)' :
                                              value.count >= 4 ? 'rgba(76, 108, 83, 0.8)' :
                                              value.count >= 3 ? 'rgba(76, 108, 83, 0.6)' :
                                              value.count >= 2 ? 'rgba(76, 108, 83, 0.4)' :
                                              value.count >= 1 ? 'rgba(76, 108, 83, 0.2)' : '#ebedf0',
                                        rx: 4,
                                        ry: 4,
                                    })}
                                    gutterSize={3}
                                />
                            </ScrollView>
                        </TabsContent>

                        <TabsContent value="tab2">
                            <ProgressChart
                                data={formattedDataChart}
                                width={screenWidth - 50}
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
                                width={screenWidth - 50}
                                height={200}
                                verticalLabelRotation={30}
                                chartConfig={chartConfig}
                                bezier
                            />
                        </TabsContent>
                    </Tabs>
                </YGroup>
            </ScrollView>
        </MyStack>
    );
};

const TabsContent = (props: TabsContentProps) => {
    return (
        <Tabs.Content
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




export default Tracker;
