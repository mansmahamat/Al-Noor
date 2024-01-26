import { Button, H5, Tabs, Text, View, YStack } from "tamagui";

import { MyStack } from "../../components/MyStack";
import { CardDemo } from "../../components/CardDemo/CardDemo";
import { PrayerList } from "../../components/PrayerList/PrayerList";
import useGetPrayer from "../utils/useGetPrayer";
import { useEffect, useState } from "react";
import moment from "moment";


function calculateTimeDifference(targetTime) {
    const currentTime = moment()
    const difference = moment(targetTime).diff(currentTime, "seconds")
    return difference
}

export default function Home() {




    const today = new Date()
    const { 
        transformedArray, currentPrayer, nextPrayerTime, nextPrayerName } = useGetPrayer(today)

    const [timeDifference, setTimeDifference] = useState(
        calculateTimeDifference(nextPrayerTime)
    )


    useEffect(() => {
        const intervalId = setInterval(() => {
          const difference = calculateTimeDifference(nextPrayerTime)
          setTimeDifference(difference)
    
          // If the difference reaches 0, clear the interval
          if (difference <= 0) {
            //   schedulePushNotification()
            clearInterval(intervalId)
          }
        }, 1000)
        return () => {
          clearInterval(intervalId) // Clean up the interval on unmount
        }
      }, [nextPrayerTime])

    const nextPrayerTimeHours = Math.floor(Math.abs(timeDifference) / 3600)
    const nextPrayerTimeMinutes = Math.floor(
      (Math.abs(timeDifference) % 3600) / 60
    )

    return (
        <>
            <MyStack>

                <YStack
                    space="$4"
                >
                  
                    <CardDemo
                        nextPrayerTime={nextPrayerTime}
                        nextPrayerName={nextPrayerName}
                        nextPrayerTimeHours={nextPrayerTimeHours}
                        nextPrayerTimeMinutes={nextPrayerTimeMinutes}
                        currentPrayer={currentPrayer} />
                    {/* <Text>
                        {JSON.stringify(transformedArray)}
                    </Text> */}
                    <PrayerList transformedArray={transformedArray} />
                </YStack>


            </MyStack>

        </>
    );
}
