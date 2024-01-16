import { Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'
import React from 'react'
import { ListItem, ScrollView, Text, YGroup } from 'tamagui'
import moment from 'moment'


export function PrayerList({ transformedArray }) {
    return (
        <ScrollView>

            <YGroup alignSelf="center" bordered width="100%" size="$4">
                {transformedArray.map((item, index) => {
                    return (
                        <YGroup.Item key={index}>
                            <ListItem hoverTheme icon={Star} title={item.name} subTitle={moment(item.time).format('LT')} />
                        </YGroup.Item>)

                })}

            </YGroup>
        </ScrollView>
    )
}
