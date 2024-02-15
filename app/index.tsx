// import { Redirect, useRouter } from "expo-router";
// import {
//   YStack
// } from "tamagui";

// import { MySafeAreaView } from "../components/MySafeAreaView";
// import { MyStack } from "../components/MyStack";
// import { CardDemo } from "../components/CardDemo/CardDemo";
// import { PrayerList } from "../components/PrayerList/PrayerList";

// export default function Home() {
//   const router = useRouter();

//   return (
//     <MySafeAreaView>
//       {/* <MyStack>
//         <YStack
//           maxWidth={600}
//         >
//           <CardDemo />
//         </YStack>

//         <PrayerList />
//       </MyStack> */}
//       <Redirect href="/home/" />
//     </MySafeAreaView>
//   );
// }
import { FlatList, Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import data from '../data/data';
import Pagination from '../components/Pagination/Pagination';
import CustomButton from '../components/CustomButtom/CustomButtom';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from './store/onBoardingStore';
import { Redirect, useRouter } from 'expo-router';
import useLanguageStore from './store/languagesStore';
import { OnboardFlow } from 'react-native-onboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";
import { useLocationStore } from './store/locationStore';


const OnboardingScreen = () => {


  const router = useRouter()
  const { onboardingCompleted, completeOnboarding } = useOnboardingStore()
  const { language } = useLanguageStore();
  const { setLatitudeLongitude } = useLocationStore();


  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitudeLongitude(location.coords.latitude, location.coords.longitude);
    };

    fetchLocation();
  }, []);





  if (onboardingCompleted) {
    return <Redirect href="/(tabs)/home" />
  }

  return (
    <OnboardFlow
      onDone={() => completeOnboarding()}
      style={{ backgroundColor: '#4c6c53' }}
      pages={[
        {
          title: "Assalamu'alaikum 🌙",
          titleStyle: { fontSize: 23, fontWeight: '700', color: 'white' },
          subtitleStyle: { fontSize: 16, color: 'white', marginTop: 20 },
          subtitle: 'Welcome to our ad-free and privacy-focused app made by a Muslim for Muslims. ',
          imageUri: Image.resolveAssetSource(require('../assets/image1.png')).uri,
        },
        {
          title: 'Privacy-Focused and Ad-Free',
          subtitle: 'Our app prioritizes your privacy and is completely free of advertisements. We believe in providing a safe and respectful environment for all users to practice their faith.',
          imageUri: Image.resolveAssetSource(require('../assets/image2.png')).uri,
          titleStyle: { fontSize: 23, fontWeight: '700', color: 'white' },
          subtitleStyle: { fontSize: 16, color: 'white', marginTop: 20 },
        },
        {
          title: 'Happy Prayers, God Bless',
          subtitle: 'Wishing you joyful and fulfilling prayers. May Allah bless your journey and grant you peace, prosperity, and happiness. Happy praying!',
          imageUri: Image.resolveAssetSource(require('../assets/image3.png')).uri,
          titleStyle: { fontSize: 23, fontWeight: '700', color: 'white' },
          subtitleStyle: { fontSize: 16, color: 'white', marginTop: 20 },


        }
      ]}
      type={'fullscreen'}
    />
  );
};

export default OnboardingScreen;

