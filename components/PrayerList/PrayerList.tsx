import { ChevronsDown, ChevronsUp, Cloud, CloudSun, Moon, MoonStar, Star, Sun, SunMedium, Sunrise, Sunset } from '@tamagui/lucide-icons'
import React from 'react'
import { ListItem, ScrollView, Separator, Text, YGroup } from 'tamagui'
import moment from 'moment'


export function PrayerList({ transformedArray }) {



  const getPrayerIcon = (prayerName) => {
    switch (prayerName.toLowerCase()) {
      case 'fajr':
        return <Moon />;
      case 'sunrise':
        return <Sunrise />;
      case 'dhuhr':
        return <Sun />;
      case 'asr':
        return <CloudSun />;
      case 'maghrib':
        return <Sunset />;
      case 'isha':
        return <MoonStar />;
      default:
        return null; // You can set a default icon or handle the case differently
    }
  };



  return (

    <YGroup separator={<Separator />} alignSelf="center" bordered width="100%" >
      {transformedArray.map((item, index) => {
        return (
          <YGroup.Item key={index}>
            <ListItem hoverTheme icon={getPrayerIcon(item.name)} height="$6" title={item.name} subTitle={moment(item.time).format('LT')} />
          </YGroup.Item>)

      })}

    </YGroup>
  )
}
