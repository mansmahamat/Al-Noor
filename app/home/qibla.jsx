import { Button, H5, Tabs, Text, View, YStack } from "tamagui";

import { MyStack } from "../../components/MyStack";
import { CardDemo } from "../../components/CardDemo/CardDemo";
import { MySafeAreaView } from "../../components/MySafeAreaView";
import { PrayerList } from "../../components/PrayerList/PrayerList";
import { ArrowBigLeft } from "@tamagui/lucide-icons";
import { Stack } from "expo-router";

export default function Qibla() {
    return (
        <MySafeAreaView>
            <MyStack>
                <Stack.Screen
                    options={{
                        headerShown: true,

                        headerTitle: `'s user page`,
                        headerLeft() {
                            return (
                                <Button
                                    mr="$2.5"
                                // onPress={router.back}
                                >
                                    <ArrowBigLeft />
                                </Button>
                            );
                        }
                    }}
                />
                <YStack
                    space="$4"
                >
                    <Text>Qibla</Text>
                </YStack>


            </MyStack>
        </MySafeAreaView>
    );
}
