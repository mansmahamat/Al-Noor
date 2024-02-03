import { BellRing, ChevronsDown, ChevronsUp, Cloud, CloudSun, Moon, MoonStar, Star, Sun, SunMedium, Sunrise, Sunset } from '@tamagui/lucide-icons'
import React from 'react'
import { ListItem, ScrollView, Separator, Text, YGroup } from 'tamagui'
import moment from 'moment'


export function PrayerList({ transformedArray }) {



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



  return (

    <YGroup separator={<Separator />} alignSelf="center" height="100%" width="100%" >
      {transformedArray.map((item, index) => {
        return (
          <YGroup.Item key={index}>
            <ListItem hoverTheme icon={getPrayerIcon(item.name)} height="$8" title={item.name} subTitle={moment(item.time).format('LT')} />
          </YGroup.Item>)

      })}

    </YGroup>
  )
}
