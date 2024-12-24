import { CloudSun, Moon, MoonStar, Sun, Sunrise, Sunset } from '@tamagui/lucide-icons'
import React from 'react'
import { ListItem, Separator, Text, YGroup } from 'tamagui'
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
        return <Moon
          color="#4c6c53"
          size="$1"
        />;
      case 'sunrise':
        return <Sunrise
          color="#4c6c53"
          size="$1"
        />;
      case 'dhuhr':
        return <Sun
          color="#4c6c53"
          size="$1"
        />;
      case 'asr':
        return <CloudSun
          color="#4c6c53"
          size="$1"
        />;
      case 'maghrib':
        return <Sunset
          color="#4c6c53"
          size="$1"
        />;
      case 'isha':
        return <MoonStar
          color="#4c6c53"
          size="$1"
        />;
      default:
        return null; // You can set a default icon or handle the case differently
    }
  };

  const currentPrayerFormatted = currentPrayer.toLowerCase()
  const isCurrentPrayer = (prayerName) => prayerName.toLowerCase() === currentPrayerFormatted

  return (
    <YGroup 
      alignSelf="center" 
      height="90%" 
      width="100%"
      separator={<Separator />}
      backgroundColor="$background"
      padding="$2"
      borderRadius="$4"
    >
      {prayerList.map((prayer, index) => (
        <YGroup.Item key={index}>
          <ListItem
            pressStyle={{ opacity: 0.8, scale: 0.98 }}
            animation="lazy"
            style={{
              borderWidth: isCurrentPrayer(prayer.name) ? 2 : 0,
              borderColor: '#4c6c53',
              borderRadius: 12,
              marginVertical: 4,
              backgroundColor: isCurrentPrayer(prayer.name) ? '$green1' : 'transparent',
            }}
            iconAfter={getPrayerIcon(prayer.name)}
            height="$7"
            gap="$3"
          >
            <Text 
              color="#4c6c53" 
              fontSize="$5" 
              fontWeight={isCurrentPrayer(prayer.name) ? "bold" : "normal"}
            >
              {capitalizeFirstLetter(prayer.name)}
            </Text>
            <Text 
              color="#666666" 
              fontSize="$4"
            >
              {moment(prayer.time).format('LT')}
            </Text>
          </ListItem>
        </YGroup.Item>
      ))}
    </YGroup>
  )
}
