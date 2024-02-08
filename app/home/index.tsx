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
import { useLanguageStore } from "../store/languagesStore";
import { useNavigation } from "expo-router";
import { getItem, reloadAll, setItem } from "../../modules/widget";

const GROUP_NAME = "group.com.mansjs.AlNoorPrayer";

const getSharedData = getItem(GROUP_NAME);
const setSharedData = setItem(GROUP_NAME);



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

export default function Home() {

    const navigation = useNavigation();

    const today = new Date()


    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

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

    const {
        transformedArray, } = useGetPrayer(date)
    const { currentPrayer, nextPrayerTime, nextPrayerName, city } = useGetPrayer(today)



    const [timeDifference, setTimeDifference] = useState(
        calculateTimeDifference(nextPrayerTime)
    )

    const nextPrayerTimeHours = Math.floor(Math.abs(timeDifference) / 3600)
    const nextPrayerTimeMinutes = Math.floor(
        (Math.abs(timeDifference) % 3600) / 60
    )
    const formattedTime = `${nextPrayerTimeHours > 0 ? `${nextPrayerTimeHours} hrs` : ''} ${nextPrayerTimeMinutes > 0 ? `${nextPrayerTimeMinutes} min` : ''}`;
    const [value, setValue] = useState(nextPrayerName);

    useEffect(() => {
        setSharedData("savedData", nextPrayerName);
        setSharedData("prayerTime", formattedTime);
        reloadAll();
    }, [nextPrayerName, nextPrayerTime]);

    const onPress = () => {
        setValue("Hello from App.tsx");
    };

    const clear = () => {
        setValue("");
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const difference = calculateTimeDifference(nextPrayerTime)
            setTimeDifference(difference)
            // If the difference reaches 0, clear the interval
            if (difference <= 0) {
                schedulePushNotification()
                clearInterval(intervalId)
            }
        }, 1000)
        return () => {
            clearInterval(intervalId) // Clean up the interval on unmount
        }
    }, [nextPrayerTime])








    const [expoPushToken, setExpoPushToken] = useState<string>();
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        //@ts-ignore
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            //@ts-ignore

            setNotification(notification);
        });


        console.log("notificationListener", expoPushToken)

        //@ts-ignore

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const [notificationScheduled, setNotificationScheduled] = useState(false);

    // useEffect(() => {

    //     const intervalId = setInterval(() => {
    //         const difference = calculateTimeDifference(nextPrayerTime);
    //         setTimeDifference(difference);

    //         // If both hours and minutes are as expected and notification hasn't been scheduled
    //         if (
    //             nextPrayerTimeHours === 0 &&
    //             nextPrayerTimeMinutes === 0 &&
    //             !notificationScheduled
    //         ) {
    //             schedulePushNotification();
    //             setNotificationScheduled(true)// Set the flag to true

    //             clearInterval(intervalId);
    //         }
    //     }, 1000);

    //     return () => {
    //         clearInterval(intervalId); // Clean up the interval on unmount
    //     };
    // }, [nextPrayerTime, nextPrayerTimeHours, nextPrayerTimeMinutes]);

    let colorScheme = useColorScheme()

    const i18n = new I18n({
        ...fr,
        ...en,
    });

    const { language, updateLanguage } = useLanguageStore();

    const handleLanguageChange = (newLanguage: string) => {
        updateLanguage(newLanguage);
    };

    // i18n.defaultLocale = "fr";
    i18n.locale = language;
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
                    {/* <Button

                        onPress={async () => {
                            await schedulePushNotification();
                        }}
                    >
                        Notification
                    </Button> */}

                    <XStack
                        display="flex"
                        alignItems="center"

                        justifyContent="center"
                        borderColor="$color"
                        borderRadius="$4"
                    >
                        <DateTimePicker
                            testID="dateTimePicker"
                            style={{ backgroundColor: "#4c6c53", }}
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
                    <PrayerList transformedArray={transformedArray} />


                </YStack>


            </MyStack>

        </>
    );
}


async function schedulePushNotification() {

    await Notifications.scheduleNotificationAsync({
        content: {
            title: " PRAYER TIME",
            body: "It's time to pray ",
            // data: { data: 'goes here' },
            sound: '../../assets/a4.wav',
        },
        trigger: null

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