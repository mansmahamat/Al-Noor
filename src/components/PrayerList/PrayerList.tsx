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
    <YGroup alignSelf="center" height="90%" width="100%" >

      {prayerList.map((prayer, index) => {
        return (

          <React.Fragment key={index}>

            <YGroup.Item >
              <ListItem
                style={{ borderWidth: isCurrentPrayer(prayer.name) ? 1 : 0, borderColor: '#4c6c53', borderRadius: 10 }}
                color="#4c6c53"
                borderColor="red"
                icon={getPrayerIcon(prayer.name)}
                height="$6"
                title={capitalizeFirstLetter(prayer.name)}
                subTitle={moment(prayer.time).format('LT')} />
            </YGroup.Item>
          </React.Fragment>
        )

      })}
    </YGroup>
  )
}
