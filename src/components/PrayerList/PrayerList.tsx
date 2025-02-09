import { CloudSun, Moon, MoonStar, Sun, Sunrise, Sunset } from '@tamagui/lucide-icons'
import React from 'react'
import { ListItem, Separator, Text, YGroup, XStack } from 'tamagui'
import moment from 'moment'
import { capitalizeFirstLetter } from '../../utils/utils'

interface PrayerTime {
  name: string
  time: Date
}

interface PrayerListProps {
  prayerList: PrayerTime[]
  currentPrayer: string
}

export function PrayerList({ prayerList, currentPrayer }: PrayerListProps) {
  const getPrayerIcon = (prayerName) => {
    switch (prayerName.toLowerCase()) {
      case 'fajr':
        return <Moon color="#8E8E93" size={24} />;
      case 'sunrise':
        return <Sunrise color="#8E8E93" size={24} />;
      case 'dhuhr':
        return <Sun color="#8E8E93" size={24} />;
      case 'asr':
        return <CloudSun color="#8E8E93" size={24} />;
      case 'maghrib':
        return <Sunset color="#8E8E93" size={24} />;
      case 'isha':
        return <MoonStar color="#8E8E93" size={24} />;
      default:
        return null;
    }
  };

  const currentPrayerFormatted = currentPrayer.toLowerCase()
  const isCurrentPrayer = (prayerName) => prayerName.toLowerCase() === currentPrayerFormatted

  return (
    <YGroup 
      alignSelf="center" 
      width="100%"
      separator={<Separator opacity={0.2} />}
      backgroundColor="white"
      padding="$2"
      borderRadius="$6"
    >
      {prayerList.map((prayer, index) => (
        <YGroup.Item key={index}>
          <ListItem
            pressStyle={{ opacity: 0.7 }}
            animation="lazy"
            backgroundColor={isCurrentPrayer(prayer.name) ? '#F2F2F7' : 'white'}
            borderRadius={12}
            marginVertical={6}
            height="$6"
            iconAfter={getPrayerIcon(prayer.name)}
          >
            <XStack flex={1} alignItems="center" justifyContent="space-between">
              <Text 
                color={isCurrentPrayer(prayer.name) ? "#4C6C53" : "#000000"}
                fontSize={16}
                fontWeight={isCurrentPrayer(prayer.name) ? "600" : "400"}
              >
                {capitalizeFirstLetter(prayer.name)}
              </Text>
              <Text 
                color="#8E8E93"
                fontSize={15}
                fontWeight="400"
              >
                {moment(prayer.time).format('h:mm A')}
              </Text>
            </XStack>
          </ListItem>
        </YGroup.Item>
      ))}
    </YGroup>
  )
}
