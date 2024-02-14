import { BellRing, ChevronsDown, ChevronsUp, Cloud, CloudSun, Moon, MoonStar, Star, Sun, SunMedium, Sunrise, Sunset } from '@tamagui/lucide-icons'
import React from 'react'
import { ListItem, ScrollView, Separator, Text, YGroup } from 'tamagui'
import moment from 'moment'
import { capitalizeFirstLetter } from '../../app/utils/utils'

interface PrayerTime {
  name: string
  time: Date
}


export function PrayerList({ prayerList }: { prayerList: PrayerTime[] }) {



  const getPrayerIcon = (prayerName) => {
    switch (prayerName.toLowerCase()) {
      case 'fajr':
        return <Moon
          color="#fff"
          size="$1"
        />;
      case 'sunrise':
        return <Sunrise
          color="#fff"
          size="$1"
        />;
      case 'dhuhr':
        return <Sun
          color="#fff"
          size="$1"
        />;
      case 'asr':
        return <CloudSun
          color="#fff"
          size="$1"
        />;
      case 'maghrib':
        return <Sunset
          color="#fff"
          size="$1"
        />;
      case 'isha':
        return <MoonStar
          color="#fff"
          size="$1"
        />;
      default:
        return null; // You can set a default icon or handle the case differently
    }
  };



  return (

    <YGroup separator={<Separator />} alignSelf="center" height="80%" width="100%" >
      {prayerList.map((prayer, index) => {
        return (
          <YGroup.Item key={index}>
            <ListItem backgroundColor="#4c6c53" color="white" borderColor="#fffff" icon={getPrayerIcon(prayer.name)} height="$6" title={capitalizeFirstLetter(prayer.name)} subTitle={moment(prayer.time).format('LT')} />
          </YGroup.Item>)

      })}

    </YGroup>
  )
}
