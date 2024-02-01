import { Button, H5, Paragraph, Tabs, Text, View, XStack, YStack } from "tamagui";

import { MyStack } from "../../components/MyStack";
import { CardDemo } from "../../components/CardDemo/CardDemo";
import { PrayerList } from "../../components/PrayerList/PrayerList";
import useGetPrayer from "../utils/useGetPrayer";
import { useEffect, useState } from "react";
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import useGetDateHijri from "../utils/useGetDateHijri";
import { Cross, XCircle } from "@tamagui/lucide-icons";

function calculateTimeDifference(targetTime) {
    const currentTime = moment()
    const difference = moment(targetTime).diff(currentTime, "seconds")
    return difference
}

export default function Home() {


    const today = new Date()


    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);



    const {
        transformedArray, } = useGetPrayer(date)
    const { currentPrayer, nextPrayerTime, nextPrayerName, city } = useGetPrayer(today)

    const [timeDifference, setTimeDifference] = useState(
        calculateTimeDifference(nextPrayerTime)
    )


    useEffect(() => {
        const intervalId = setInterval(() => {
            const difference = calculateTimeDifference(nextPrayerTime)
            setTimeDifference(difference)

            // If the difference reaches 0, clear the interval
            if (difference <= 0) {
                //   schedulePushNotification()
                clearInterval(intervalId)
            }
        }, 1000)
        return () => {
            clearInterval(intervalId) // Clean up the interval on unmount
        }
    }, [nextPrayerTime])

    const nextPrayerTimeHours = Math.floor(Math.abs(timeDifference) / 3600)
    const nextPrayerTimeMinutes = Math.floor(
        (Math.abs(timeDifference) % 3600) / 60
    )

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const reset = () => {
        setDate(today);
    };


    const filteredPrayerTimes = transformedArray.filter(
        (prayer) => prayer.name !== "sunrise" && prayer.name !== "sunset"
    )

    return (
        <>
            <MyStack>

                <YStack
                    space="$4"
                    paddingBottom="$18"
                >

                    <CardDemo
                        nextPrayerTime={nextPrayerTime}
                        nextPrayerName={nextPrayerName}
                        city={city}
                        date={date}
                        nextPrayerTimeHours={nextPrayerTimeHours}
                        nextPrayerTimeMinutes={nextPrayerTimeMinutes}
                        currentPrayer={currentPrayer} />
                    {/* <Text>
                        {JSON.stringify(transformedArray)}
                    </Text> */}

                    <XStack
                        display="flex"
                        alignItems="center"

                        justifyContent="center"
                        borderColor="$color"
                        borderRadius="$4"
                    >
                        <DateTimePicker
                            testID="dateTimePicker"

                            themeVariant="light"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            onChange={onChange}
                        />
                        {date.toDateString() !== today.toDateString() && <XCircle onPress={reset} style={{ marginLeft: 6 }} size={24} color="red" />}

                    </XStack>
                    <PrayerList transformedArray={transformedArray} />
                </YStack>


            </MyStack>

        </>
    );
}
