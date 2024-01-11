import { Button, H5, Tabs, Text, View, YStack } from "tamagui";

import { MyStack } from "../../components/MyStack";
import { CardDemo } from "../../components/CardDemo/CardDemo";
import { MySafeAreaView } from "../../components/MySafeAreaView";
import { PrayerList } from "../../components/PrayerList/PrayerList";
import { ArrowBigLeft } from "@tamagui/lucide-icons";
import { Stack } from "expo-router";

export default function Home() {
    return (
        <>
            <MyStack>

                <YStack
                    space="$4"
                >
                    <CardDemo />
                    <PrayerList />
                </YStack>


            </MyStack>

        </>
    );
}
