import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Compass, Home } from "@tamagui/lucide-icons";
import { Tabs, useRouter } from "expo-router";
import { Button } from "tamagui";

export default function Layout() {
    const router = useRouter();

    return (
        <Tabs>

            <Tabs.Screen
                name="index"
                options={{
                    title: "Tab 1",
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
                    title: "Tab 1",
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
        </Tabs>
    );
}
