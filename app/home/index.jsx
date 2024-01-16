import { Button, H5, Tabs, Text, View, YStack } from "tamagui";

import { MyStack } from "../../components/MyStack";
import { CardDemo } from "../../components/CardDemo/CardDemo";
import { PrayerList } from "../../components/PrayerList/PrayerList";
import useGetPrayer from "../utils/useGetPrayer";


export default function Home() {

    const { prayerTimesArray, transformedArray } = useGetPrayer()

    return (
        <>
            <MyStack>

                <YStack
                    space="$4"
                >
                    <CardDemo />
                    {/* <Text>
                        {JSON.stringify(transformedArray)}
                    </Text> */}
                    <PrayerList transformedArray={transformedArray} />
                </YStack>


            </MyStack>

        </>
    );
}
