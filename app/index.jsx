import { Redirect, useRouter } from "expo-router";
import {
  YStack
} from "tamagui";

import { MySafeAreaView } from "../components/MySafeAreaView";
import { MyStack } from "../components/MyStack";
import { CardDemo } from "../components/CardDemo/CardDemo";
import { PrayerList } from "../components/PrayerList/PrayerList";

export default function Home() {
  const router = useRouter();

  return (
    <MySafeAreaView>
      {/* <MyStack>
        <YStack
          maxWidth={600}
        >
          <CardDemo />
        </YStack>

        <PrayerList />
      </MyStack> */}
      <Redirect href="/home/" />
    </MySafeAreaView>
  );
}
