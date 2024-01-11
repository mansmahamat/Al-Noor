import { Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'
import React from 'react'
import { ListItem, ScrollView, Text, YGroup } from 'tamagui'


export function PrayerList() {
    return (
        <ScrollView>
            <YGroup alignSelf="center" bordered width="100%" size="$4">
                <YGroup.Item>
                    <ListItem hoverTheme icon={Star} title="Fajr" subTitle="6h53" />
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem hoverTheme icon={Star} title="Dhur" subTitle="12h03" />
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem hoverTheme icon={Star} title="Asr" subTitle="13h05" />
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem hoverTheme icon={Star} title="Mahgrib" subTitle="15h18" />
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem hoverTheme icon={Star} title="Isha" subTitle="16h52" />
                </YGroup.Item>
            </YGroup>
        </ScrollView>
    )
}
