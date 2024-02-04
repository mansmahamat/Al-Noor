import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Compass, Home, List, Settings } from "@tamagui/lucide-icons";
import { Tabs, useRouter } from "expo-router";
import { Text, View } from "tamagui";
import { Button } from "tamagui";

export default function Layout() {
    const router = useRouter();

    return (
        <Tabs>

            <Tabs.Screen
                name="index"

                options={{
                    headerStatusBarHeight: 0,

                    tabBarStyle: {
                        borderTopColor: "#4c6c53",
                        borderTopWidth: 0,
                    },
                    title: "Prayer Times",
                    tabBarLabel: ({ focused, color, size }) => (
                        <Text style={{ color: "#4c6c53" }}>Prayer times</Text>
                    ),


                    tabBarIcon(props) {
                        return (
                            <Home color="#4c6c53" />
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
                    title: "Qibla",
                    tabBarLabel: ({ focused, color, size }) => (
                        <Text style={{ color: "#4c6c53" }}>Qibla</Text>
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
                    tabBarLabel: ({ focused, color, size }) => (
                        <Text style={{ color: "#4c6c53" }}>99 names </Text>
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
                    title: "Settings",
                    tabBarLabel: ({ focused, color, size }) => (
                        <Text style={{ color: "#4c6c53" }}>Settings</Text>
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
