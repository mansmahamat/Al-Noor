import { Button, H5, Paragraph, ScrollView, Tabs, Text, View, XStack, YStack } from "tamagui";

import { MyStack } from "../../components/MyStack";
import { CardDemo } from "../../components/CardDemo/CardDemo";
import { PrayerList } from "../../components/PrayerList/PrayerList";
import useGetPrayer from "../utils/useGetPrayer";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import useGetDateHijri from "../utils/useGetDateHijri";
import { Cross, XCircle } from "@tamagui/lucide-icons";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform, Pressable, useColorScheme, StyleSheet } from "react-native";
import { I18n } from "i18n-js";
import fr from "../../locales/french/fr.json";
import en from "../../locales/english/en.json";
import useLanguageStore from "../store/languagesStore";
import { useNavigation } from "expo-router";
import { getItem, reloadAll, setItem, setArray } from "../../modules/widget";
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import useCalculationMadhab from "../store/calculationMadhabStore";
import { useOnboardingStore } from "../store/onBoardingStore";
import { useLocationStore } from "../store/locationStore";
import getPrayerTimesWithCurrentLocation from "../utils/prayer";
import usePrayerTimes from "../utils/usePrayer";
import * as Location from "expo-location"
import {
    Coordinates,
    CalculationMethod,
    PrayerTimes,
    SunnahTimes,
    Prayer,
    Qibla,
} from "adhan"
import useCalculationMethodStore from "../store/calculationMethodStore";
import { capitalizeFirstLetter, getCalculationMadhab, getCalculationMethodByName } from "../utils/utils";

// Define a task name
const BACKGROUND_FETCH_TASK = 'MIDNIGHT_TASK';


TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();


    console.log(`Got background fetch call MANSs at date: ${new Date(now).toISOString()}`);

    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
});





const GROUP_NAME = "group.com.mansjs.AlNoorPrayer";

const setSharedData = setItem(GROUP_NAME);
const setSharedDataArray = setArray(GROUP_NAME);



Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});


function calculateTimeDifference(targetTime) {
    const currentTime = moment()
    const difference = moment(targetTime).diff(currentTime, "seconds")
    return difference
}

interface PrayerTime {
    name: string
    time: Date
}


interface PrayerTimeFormatted {
    name: string;
    time: string;
}[]

export default function Home() {



    const [expoPushToken, setExpoPushToken] = useState<string>();
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);


    const today = new Date()


    const [error, setError] = useState("")
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [timings, setTimings] = useState<PrayerTime[]>([])
    const [nextPrayer, setNextPrayer] = useState<PrayerTime | undefined>()
    const [previousPrayer, setPreviousPrayer] = useState<PrayerTime | undefined>()
    const [prayersToday, setPrayersToday] = useState<PrayerTimeFormatted[]>([])
    const { calculationMethod } = useCalculationMethodStore()
    const { madhab } = useCalculationMadhab()


    useEffect(() => {
        ; (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync()
                if (status !== "granted") {
                    setError("Location permission denied.")
                    return
                }

                let location = await Location.getCurrentPositionAsync({})
                const today = new Date()
                const tomorrow = new Date(today)
                const calculationMethodParamsMadhab = getCalculationMadhab(madhab)
                const calculationMethodParams = getCalculationMethodByName(calculationMethod)
                tomorrow.setDate(tomorrow.getDate() + 1)

                const coordinates = new Coordinates(
                    location.coords.latitude,
                    location.coords.longitude
                )
                let params = calculationMethodParams
                params.madhab = calculationMethodParamsMadhab

                const todayPrayerTimes = new PrayerTimes(coordinates, today, params)




                const tomorrowPrayerTimes = new PrayerTimes(
                    coordinates,
                    tomorrow,
                    params
                )

                const prayerTimesList = new PrayerTimes(coordinates, date, params)

                const prayerNames = [
                    "Fajr",
                    "Sunrise",
                    "Dhuhr",
                    "Asr",
                    "Maghrib",
                    "Isha",
                ]

                // Prepare array for today's prayer times
                const todayPrayerTimesArray = prayerNames.map((prayerName) => ({
                    name: prayerName.toLowerCase(),
                    //@ts-ignore
                    time: todayPrayerTimes[prayerName.toLowerCase()],
                }))


                const formattedPrayerTimes = todayPrayerTimesArray.map(prayer => ({
                    name: capitalizeFirstLetter(prayer.name),
                    time: new Date(prayer.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));

                setPrayersToday(formattedPrayerTimes)




                // Prepare array for tomorrow's prayer times
                const tomorrowPrayerTimesArray = prayerNames.map((prayerName) => ({
                    name: prayerName.toLowerCase(),
                    //@ts-ignore

                    time: tomorrowPrayerTimes[prayerName.toLowerCase()],
                }))

                const prayerTimesListArray = prayerNames.map((prayerName) => ({
                    name: prayerName.toLowerCase(),
                    //@ts-ignore

                    time: prayerTimesList[prayerName.toLowerCase()],
                }))

                // Combine today's and tomorrow's prayer times into a single array
                const combinedPrayerTimesArray = todayPrayerTimesArray.concat(
                    tomorrowPrayerTimesArray
                )

                const nextPrayerTime = combinedPrayerTimesArray.find(
                    (prayerTime) => new Date(prayerTime.time) > today
                )

                const reversedPrayerTimesArray = [...combinedPrayerTimesArray].reverse();

                const previousPrayerTime = reversedPrayerTimesArray.find(
                    (prayerTime) => new Date(prayerTime.time) < today
                );

                const previousPrayer = previousPrayerTime
                    ? previousPrayerTime
                    : combinedPrayerTimesArray.find((prayerTime) => {
                        const prayerDateTime = new Date(prayerTime.time);
                        return (
                            prayerDateTime < today && prayerDateTime.getDate() !== today.getDate()
                        );
                    });


                const nextPrayer = nextPrayerTime
                    ? nextPrayerTime
                    : combinedPrayerTimesArray.find((prayerTime) => {
                        const prayerDateTime = new Date(prayerTime.time)
                        return (
                            prayerDateTime > today &&
                            prayerDateTime.getDate() !== today.getDate()
                        )
                    })
                setPreviousPrayer(previousPrayer)

                setNextPrayer(nextPrayer)



                //@ts-ignore

                setTimings(prayerTimesListArray)
            } catch (error) {
                setError("Error fetching timings.")
            }
        })()
    }, [date])




















    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };


    const reset = () => {
        setDate(today);
    };








    const [timeDifference, setTimeDifference] = useState<any>(

    )






    const { completeOnboarding } = useOnboardingStore();

    // useEffect(() => {
    //     schedulePrayerNotifications(prayersToday);
    //     registerBackgroundFetchAsync();
    //     completeOnboarding;

    // }, [prayersToday]);

    useEffect(() => {
        setSharedDataArray("prayerTime", prayersToday!);
        setSharedData("prayerTime", JSON.stringify(prayersToday!));
        reloadAll();
    }, [nextPrayer]);


    useEffect(() => {
        const intervalId = setInterval(() => {
            const difference = calculateTimeDifference(nextPrayer?.time)
            setTimeDifference(difference)

            // If the difference reaches 0, clear the interval
            // if (difference <= 0) {
            //     schedulePushNotification()
            //     clearInterval(intervalId)
            // }
        }, 1000)
        return () => {
            clearInterval(intervalId) // Clean up the interval on unmount
        }
    }, [nextPrayer?.time])

    const nextPrayerTimeHours = Math.floor(Math.abs(timeDifference) / 3600)
    const nextPrayerTimeMinutes = Math.floor(
        (Math.abs(timeDifference) % 3600) / 60
    )




    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        //@ts-ignore
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            //@ts-ignore

            setNotification(notification);
        });



        //@ts-ignore

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);


    const i18n = new I18n({
        ...fr,
        ...en,
    });

    const { language, updateLanguage } = useLanguageStore();





    i18n.defaultLocale = "fr";
    i18n.locale = language;


    function calculateTimeDifference(targetTime) {
        const currentTime = moment();
        const difference = moment(targetTime).diff(currentTime, "seconds");
        return difference;
    }

    // Function to schedule a notification for the next prayer time
    async function scheduleNextPrayerNotification(dateTime, message) {
        await schedulePushNotification(dateTime, message); // Assume this function is already defined
    }

    useEffect(() => {

        const difference = calculateTimeDifference(nextPrayer?.time);

        // If the difference is negative or zero, the prayer time has already passed
        if (difference <= 0) {
            // Calculate the next prayer time after the current time
            const nextPrayerAfterNow = timings.find(prayer => new Date(prayer.time) > new Date());

            // If there's a prayer time after now, use it for scheduling notification
            if (nextPrayerAfterNow) {
                scheduleNextPrayerNotification(nextPrayerAfterNow.time, `It's time for ${nextPrayerAfterNow.name} prayer`);
            } else {
                // If no prayer time is found after now, the day's prayers have ended
                // You can handle this case as needed, maybe schedule a notification for the next day's Fajr prayer
            }
        } else {
            // If the difference is positive, schedule notification for the next prayer time
            scheduleNextPrayerNotification(nextPrayer.time, `It's time for ${nextPrayer.name} prayer`);
        }

        // Register a background fetch task to update notifications
        if (Platform.OS === 'ios') {
            BackgroundFetch.setMinimumIntervalAsync(1); // Set the minimum interval for background fetch task
        }
        const task = BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 1, // Minimum interval in minutes
            stopOnTerminate: false, // Continue executing even if the app is terminated
            startOnBoot: true, // Start the background task when the device boots up
        });

        return () => {
            task.then(() => {
                BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
            });
        };
    }, [nextPrayer, timings]); // Trigger effect when the nextPrayer or timings change



    return (
        <>
            <MyStack>
                {/* <View >
                    <View >
                        <Text>
                            Background fetch status:{' '}
                            <Text >
                                {status && BackgroundFetch.BackgroundFetchStatus[status]}
                            </Text>
                        </Text>
                        <Text>
                            Background fetch task name:{' '}
                            <Text >
                                {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
                            </Text>
                        </Text>
                    </View>
                    <View></View>
                    <Button

                        onPress={toggleFetchTask}
                    >
                        {isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
                    </Button>
                </View> */}
                <YStack
                    space="$4"
                    paddingBottom="$18"
                >
                    <Text>
                    </Text>
                    <CardDemo
                        nextPrayerTime={nextPrayer?.time}
                        nextPrayerName={nextPrayer?.name}
                        city={"city"}
                        date={date}
                        nextPrayerTimeHours={nextPrayerTimeHours}
                        nextPrayerTimeMinutes={nextPrayerTimeMinutes}
                        currentPrayer={previousPrayer?.name} />


                    <XStack
                        display="flex"
                        alignItems="center"

                        justifyContent="center"
                        borderColor="$color"
                        borderRadius="$4"
                    >
                        <DateTimePicker
                            testID="dateTimePicker"
                            style={{ backgroundColor: "#4c6c53" }}
                            textColor="#ffffff"
                            themeVariant="dark"
                            collapsable={true}
                            value={date}
                            mode="date"
                            is24Hour={true}
                            onChange={onChange}
                        />
                        {date.toDateString() !== today.toDateString() && <XCircle onPress={reset} style={{ marginLeft: 6 }} size={24} color="red" />}

                    </XStack>
                    <PrayerList prayerList={timings} />


                </YStack>


            </MyStack>

        </>
    );
}



async function schedulePushNotification(dateTime, message) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Al noorPrayer Time',
            body: message,
            sound: "default"
        },
        trigger: {
            date: dateTime,
        },
    });


}







async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        token = (await Notifications.getExpoPushTokenAsync({ projectId: "9cba4f70-b7d4-4a38-afa4-9c9294a7258b" })).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}