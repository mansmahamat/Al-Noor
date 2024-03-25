import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { H2, ScrollView, XStack, YGroup } from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyStack } from "../../../components/MyStack";
import { Calendar } from "react-native-calendars";
import { ContributionGraph } from "react-native-chart-kit";
import useLanguageStore from "../../../store/languagesStore";
import {i18n} from "../../../lib/i18n";

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
            <ScrollView>
                <YGroup space="$4">
                    <XStack
                        alignItems="center"
                        justifyContent="center"
                        borderColor="$color"
                        borderRadius="$4"
                    >
                        <H2 textAlign="center">{i18n.t("fasting.title")}</H2>
                    </XStack>
                    <Calendar
                        theme={{
                            backgroundColor: "#282828",
                            calendarBackground: "#282828",
                            textSectionTitleColor: "#F2D2BD",
                            textSectionTitleDisabledColor: "#d9e1e8",
                            selectedDayBackgroundColor: "#00adf5",
                            selectedDayTextColor: "#ffffff",
                            todayTextColor: "#00adf5",
                            dayTextColor: "#F2D2BD",
                            textDisabledColor: "#d9e1e8",
                            dotColor: "#00adf5",
                            selectedDotColor: "#ffffff",
                            arrowColor: "#4c6c53",
                            disabledArrowColor: "#d9e1e8",
                            monthTextColor: "#4c6c53",
                            indicatorColor: "#4c6c53",
                            textDayFontFamily: "monospace",
                            textMonthFontFamily: "monospace",
                            textDayHeaderFontFamily: "monospace",
                            textDayFontWeight: "300",
                            textMonthFontWeight: "bold",
                            textDayHeaderFontWeight: "300",
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 16,
                        }}
                        style={{
                            borderWidth: 1,
                            borderColor: "gray",
                            height: 450,
                        }}
                        onDayPress={handleDayPress}
                        markedDates={formattedMarkedDates}
                        firstDay={1}
                        enableSwipeMonths={true}
                        markingType="dot"
                    />
                    {/* @ts-ignore */}
                    <ContributionGraph
                        values={formattedFastingData}
                        endDate={new Date(dateOnly)}
                        numDays={105}
                        width={screenWidth - 50}
                        height={220}
                        chartConfig={chartConfig}
                    />
                </YGroup>
            </ScrollView>
        </MyStack>
    );
};

export default FastingTracker;
