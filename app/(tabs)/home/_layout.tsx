import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Calendar, CalendarCheck, Compass, Home, List, Settings, UtensilsCrossed } from "@tamagui/lucide-icons";
import { Tabs, useRouter } from "expo-router";
import { Text, View } from "tamagui";
import { Button } from "tamagui";
import { I18n } from "i18n-js";
import fr from "../../../locales/french/fr.json";
import en from "../../../locales/english/en.json";
import ar from "../../../locales/arabic/ar.json";
import useLanguageStore from "../../store/languagesStore"

export default function Layout() {
    const router = useRouter();
    const { language } = useLanguageStore();

    const i18n = new I18n({
        ...fr,
        ...en,
        ...ar
    });

    i18n.locale = language;

    return (
        <Tabs screenOptions={{
            tabBarStyle: { backgroundColor: "#fffff" },
        }}>



            <Tabs.Screen
                name="index"

                options={{
                    headerStatusBarHeight: 0,
                    // unmountOnBlur: true,
                    tabBarStyle: {
                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },

                    tabBarLabel: () => (
                        <Text style={{ color: "#4c6c53" }}>
                            {/* {i18n.t('menu.prayer')} */}
                        </Text>
                    ),


                    tabBarIcon(props) {
                        return (
                            <Home color="#4c6c53" />
                        );
                    },

                }}
            />

            <Tabs.Screen
                name="tracker"
                options={{
                    headerStatusBarHeight: 0,
                    tabBarAccessibilityLabel: "Qibla",
                    // headerTintColor: "#4c6c53",
                    headerBackground: () => (
                        <View style={{ backgroundColor: "#4c6c53", height: 80 }} />
                    ),

                    // headerBackgroundContainerStyle: {
                    //     backgroundColor: "#4c6c53",
                    // },
                    tabBarStyle: {

                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },

                    tabBarLabel: () => (
                        <Text style={{ color: "#4c6c53" }}>
                            {/* {i18n.t('menu.qibla')} */}
                        </Text>
                    ),
                    tabBarBackground: () => (
                        <View style={{ backgroundColor: "#4c6c53", height: 80 }} />
                    ),
                    tabBarIcon(props) {
                        return (
                            <CalendarCheck color="#4c6c53" />
                        );
                    },

                }}
            />

            <Tabs.Screen
                name="fasting"
                options={{
                    headerStatusBarHeight: 0,
                    tabBarAccessibilityLabel: "Qibla",
                    // headerTintColor: "#4c6c53",
                    headerBackground: () => (
                        <View style={{ backgroundColor: "#4c6c53", height: 80 }} />
                    ),

                    // headerBackgroundContainerStyle: {
                    //     backgroundColor: "#4c6c53",
                    // },
                    tabBarStyle: {

                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },

                    tabBarLabel: () => (
                        <Text style={{ color: "#4c6c53" }}>
                            {/* {i18n.t('menu.qibla')} */}
                        </Text>
                    ),
                    tabBarBackground: () => (
                        <View style={{ backgroundColor: "#4c6c53", height: 80 }} />
                    ),
                    tabBarIcon(props) {
                        return (
                            <UtensilsCrossed color="#4c6c53" />
                        );
                    },

                }}
            />

            <Tabs.Screen
                name="qibla"
                options={{
                    headerStatusBarHeight: 0,
                    tabBarAccessibilityLabel: "Qibla",
                    // headerTintColor: "#4c6c53",
                    headerBackground: () => (
                        <View style={{ backgroundColor: "#4c6c53", height: 80 }} />
                    ),

                    // headerBackgroundContainerStyle: {
                    //     backgroundColor: "#4c6c53",
                    // },
                    tabBarStyle: {

                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },

                    tabBarLabel: () => (
                        <Text style={{ color: "#4c6c53" }}>
                            {/* {i18n.t('menu.qibla')} */}
                        </Text>
                    ),
                    tabBarBackground: () => (
                        <View style={{ backgroundColor: "#4c6c53", height: 80 }} />
                    ),
                    tabBarIcon(props) {
                        return (
                            <Compass color="#4c6c53" />
                        );
                    },

                }}
            />
            <Tabs.Screen
                name="nameAllah"
                options={{
                    headerStatusBarHeight: 0,
                    tabBarStyle: {

                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },
                    title: "99 names",
                    tabBarLabel: () => (
                        <Text style={{ color: "#4c6c53" }}>
                            {/* {i18n.t('menu.99names')} */}
                        </Text>
                    ),

                    tabBarIcon(props) {
                        return (
                            <List color="#4c6c53" />
                        );
                    },

                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerStatusBarHeight: 0,
                    tabBarStyle: {

                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },

                    tabBarLabel: () => (
                        <Text style={{ color: "#4c6c53" }}>
                            {/* {i18n.t('menu.settings')} */}
                        </Text>
                    ),

                    tabBarIcon(props) {
                        return (
                            <Settings color="#4c6c53" />
                        );
                    },

                }}
            />
        </Tabs>
    );
}
