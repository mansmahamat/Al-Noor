import { CalendarCheck, Compass, Home, List, Settings, UtensilsCrossed } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";
import { Text, View } from "tamagui";
import useLanguageStore from "../../../store/languagesStore"
import { i18n } from "../../../lib/i18n";

export default function Layout() {
    const { language } = useLanguageStore();
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
                    tabBarLabel: () => (
                        <Text style={{ color: "#4c6c53" }} />
                    ),

                    tabBarIcon() {
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
                    tabBarLabel: () => (
                        <Text style={{ color: "#4c6c53" }} />
                    ),
                    tabBarIcon() {
                        return (
                            <CalendarCheck color="#4c6c53" />
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="fasting"
                options={{
                    tabBarButton: () => null,
                    headerStatusBarHeight: 0,
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
                    tabBarLabel: () => (
                        <Text style={{ color: "#4c6c53" }} />
                    ),
                    tabBarIcon() {
                        return (
                            <Compass color="#4c6c53" />
                        );
                    },

                }}
            />
            <Tabs.Screen
                name="nameAllah"
                options={{
                    tabBarButton: () => null,
                    headerStatusBarHeight: 0,
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
                        <Text style={{ color: "#4c6c53" }} />
                    ),
                    tabBarIcon() {
                        return (
                            <Settings color="#4c6c53" />
                        );
                    },

                }}
            />
        </Tabs>
    );
}
