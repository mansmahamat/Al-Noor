import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Compass, Home, List } from "@tamagui/lucide-icons";
import { Tabs, useRouter } from "expo-router";
import { Button } from "tamagui";

export default function Layout() {
    const router = useRouter();

    return (
        <Tabs>

            <Tabs.Screen
                name="index"
                options={{
                    title: "Prayer Times",
                    tabBarIcon(props) {
                        return (
                            <Home />
                        );
                    },
                    headerLeft() {
                        return (
                            <Button
                                ml="$2.5"
                                onPress={() => router.push("/")}
                            >
                                <MaterialCommunityIcons name="arrow-left" />
                            </Button>
                        );
                    }
                }}
            />
            <Tabs.Screen
                name="qibla"
                options={{
                    title: "Qibla",
                    tabBarIcon(props) {
                        return (
                            <Compass />
                        );
                    },
                    headerLeft() {
                        return (
                            <Button
                                ml="$2.5"
                                onPress={() => router.push("/")}
                            >
                                <MaterialCommunityIcons name="arrow-left" />
                            </Button>
                        );
                    }
                }}
            />
            <Tabs.Screen
                name="nameAllah"
                options={{
                    title: "99 Names of Allah",
                    tabBarIcon(props) {
                        return (
                            <List />
                        );
                    },
                    headerLeft() {
                        return (
                            <Button
                                ml="$2.5"
                                onPress={() => router.push("/")}
                            >
                                <MaterialCommunityIcons name="arrow-left" />
                            </Button>
                        );
                    }
                }}
            />
        </Tabs>
    );
}
