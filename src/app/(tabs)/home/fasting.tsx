import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { H2, Paragraph, ScrollView, Separator, XStack, YGroup, YStack } from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyStack } from "../../../components/MyStack";
import { Calendar } from "react-native-calendars";
import { ContributionGraph } from "react-native-chart-kit";
import useLanguageStore from "../../../store/languagesStore";
import { i18n } from "../../../lib/i18n";
import { Link } from "expo-router";

// Define type for fasting status entry
type FastingStatusEntry = {
    date: string;
    fasting: boolean;
};

const FastingTracker = () => {
    const [date, setDate] = useState(new Date());
    const [fastingStatus, setFastingStatus] = useState<FastingStatusEntry[]>([]);
    const [selected, setSelected] = useState<string>("");
    const currentDate = new Date();
    const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 3,
        0
    );
    const dateOnly = endDate.toISOString().split("T")[0];

    useEffect(() => {
        loadFastingStatus();
    }, []);

    useEffect(() => {
        saveFastingStatus();
    }, [fastingStatus]);

    // Load fasting status from AsyncStorage
    const loadFastingStatus = async () => {
        try {
            const savedFastingStatus = await AsyncStorage.getItem(
                "globalFastingStatus"
            );
            if (savedFastingStatus !== null) {
                setFastingStatus(JSON.parse(savedFastingStatus) || []);
            } else {
                setFastingStatus([]);
            }
        } catch (error) {
            console.error("Error loading fasting status:", error);
        }
    };

    // Save fasting status to AsyncStorage
    const saveFastingStatus = async () => {
        try {
            await AsyncStorage.setItem(
                "globalFastingStatus",
                JSON.stringify(fastingStatus)
            );
        } catch (error) {
            console.error("Error saving fasting status:", error);
        }
    };

    // Reset date to today
    const resetDate = () => {
        setDate(new Date());
    };

    // Format date to yyyy-mm-dd
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleDayPress = (day: { dateString: string }) => {
        setSelected(day.dateString);
        toggleFastingStatus(day.dateString);
    };

    const toggleFastingStatus = (selectedDate: string) => {
        // Convert selectedDate to a Date object
        const dateObject = new Date(selectedDate);
        // Extract year, month, and day components
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");
        // Format the selectedDate in YYYY-MM-DD format
        const formattedDate = `${year}-${month}-${day}`;

        // Find the index of the selectedDate in the fastingStatus array
        const index = fastingStatus.findIndex(
            (status) => status.date === formattedDate
        );
        if (index !== -1) {
            // Toggle the fasting status if the date is found
            const updatedStatus = [...fastingStatus];
            updatedStatus[index].fasting = !updatedStatus[index].fasting;
            setFastingStatus(updatedStatus);
            saveFastingStatus();
        } else {
            // Add a new entry with fasting status true if the date is not found
            setFastingStatus((prevStatus) => [
                ...prevStatus,
                { date: formattedDate, fasting: true },
            ]);
            saveFastingStatus();
        }
    };

    const formattedMarkedDates: { [date: string]: any } = {};

    fastingStatus.forEach((entry) => {
        const { date, fasting } = entry;
        formattedMarkedDates[date] = {
            selected: fasting,
            marked: true,
            dotColor: "#F2D2BD",
            selectedColor: "#4c6c53",
        };
    });

    const formattedFastingData = fastingStatus.map((entry) => ({
        date: entry.date,
        count: entry.fasting ? 5 : 0,
    }));

    const chartConfig = {
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(76, 168, 83, ${opacity})`,
        strokeWidth: 3,
        barPercentage: 0.5,
        gutterSize: 5,
        useShadowColorFromDataset: false, // optional
    };

    const screenWidth = Dimensions.get("window").width;

    const { language } = useLanguageStore();
    i18n.locale = language;

    return (
        <MyStack>
            <ScrollView showsVerticalScrollIndicator={false}>
                <YGroup space="$4" paddingHorizontal="$4">
                    <XStack paddingVertical="$4">
                        <H2 textAlign="center" fontSize={28} fontWeight="600">
                            {i18n.t('fasting.title')}
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
                        <Link href="/home/tracker" asChild>
                            <YStack space="$2">
                                <Paragraph 
                                    fontWeight="700" 
                                    fontSize={18} 
                                    color="#4c6c53"
                                    textAlign="left"
                                >
                                    {i18n.t("prayerTracker.title")} →
                                </Paragraph>
                                <Paragraph 
                                    fontSize={15} 
                                    opacity={0.9}
                                    color="#4c6c53"
                                    lineHeight={20}
                                >
                                    {i18n.t("prayerTracker.description")}
                                </Paragraph>
                            </YStack>
                        </Link>
                    </YStack>

                    <Calendar
                        theme={{
                            backgroundColor: "#ffffff",
                            calendarBackground: "#ffffff",
                            textSectionTitleColor: "#4c6c53",
                            textSectionTitleDisabledColor: "rgba(76, 108, 83, 0.2)",
                            selectedDayBackgroundColor: "#4c6c53",
                            selectedDayTextColor: "#ffffff",
                            todayTextColor: "#4c6c53",
                            dayTextColor: "#4c6c53",
                            textDisabledColor: "rgba(76, 108, 83, 0.2)",
                            dotColor: "#4c6c53",
                            selectedDotColor: "#ffffff",
                            arrowColor: "#4c6c53",
                            disabledArrowColor: "rgba(76, 108, 83, 0.2)",
                            monthTextColor: "#4c6c53",
                            indicatorColor: "#4c6c53",
                            textDayFontFamily: "Inter",
                            textMonthFontFamily: "Inter",
                            textDayHeaderFontFamily: "Inter",
                            textDayFontWeight: "400",
                            textMonthFontWeight: "600",
                            textDayHeaderFontWeight: "600",
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 14,
                        }}
                        style={{
                            borderWidth: 1,
                            borderColor: "rgba(76, 108, 83, 0.1)",
                            borderRadius: 12,
                            padding: 10,
                            backgroundColor: "white",
                            marginVertical: 10,
                        }}
                        onDayPress={handleDayPress}
                        markedDates={formattedMarkedDates}
                        firstDay={1}
                        enableSwipeMonths={true}
                        markingType="dot"
                    />

                    <ContributionGraph
                        values={formattedFastingData}
                        endDate={new Date(dateOnly)}
                        numDays={105}
                        width={screenWidth - 32}
                        height={220}
                        tooltipDataAttrs={(value) => ({
                            'data-tip': `${value.date}: ${value.count} fasts`,
                        })}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(76, 108, 83, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(76, 108, 83, 0.8)`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "rgba(76, 108, 83, 0.2)"
                            },
                            strokeWidth: 2,
                            barPercentage: 0.7,
                            useShadowColorFromDataset: false
                        }}
                        style={{
                            borderRadius: 12,
                            padding: 10,
                            backgroundColor: "white",
                            borderWidth: 1,
                            borderColor: "rgba(76, 108, 83, 0.1)",
                        }}
                    />
                </YGroup>
            </ScrollView>
        </MyStack>
    );
};

export default FastingTracker;
