import { CalendarCheck, Compass, Home, List, Settings, UtensilsCrossed } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";
import { View } from "tamagui";
import { I18n } from "i18n-js";
import fr from "../../../locales/french/fr.json";
import en from "../../../locales/english/en.json";
import ar from "../../../locales/arabic/ar.json";
import useLanguageStore from "../../store/languagesStore"

export default function Layout() {
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
                    tabBarStyle: {
                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },




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
                    unmountOnBlur: true,
                    headerStatusBarHeight: 0,
                    tabBarAccessibilityLabel: "Qibla",
                    headerBackground: () => (
                        <View style={{ backgroundColor: "#4c6c53", height: 80 }} />
                    ),


                    tabBarStyle: {

                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },


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
                    headerBackground: () => (
                        <View style={{ backgroundColor: "#4c6c53", height: 80 }} />
                    ),


                    tabBarStyle: {

                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },


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
                    headerBackground: () => (
                        <View style={{ backgroundColor: "#4c6c53", height: 80 }} />
                    ),


                    tabBarStyle: {

                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },


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
