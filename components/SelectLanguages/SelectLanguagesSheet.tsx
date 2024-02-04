import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Label, Sheet } from 'tamagui'
import { SelectLanguagesForm } from './SelectLanguagesForm'

interface SelectLanguagesSheetProps {
    setOpenLanguageSheet: React.Dispatch<React.SetStateAction<boolean>>
    openLanguageSheet: boolean
}

export default function SelectLanguagesSheet(
    {
        setOpenLanguageSheet,
        openLanguageSheet
    }: SelectLanguagesSheetProps
) {
    const [position, setPosition] = useState(0)
    return (
        <Sheet
            forceRemoveScrollEnabled={openLanguageSheet}
            modal={true}
            open={openLanguageSheet}
            onOpenChange={setOpenLanguageSheet}
            snapPoints={[45]}
            snapPointsMode={"percent"}
            dismissOnSnapToBottom
            position={position}
            onPositionChange={setPosition}
            zIndex={100_000}
            animation="lazy"
        >
            <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
            />
            <Sheet.Handle />
            <Sheet.Frame
                padding="$4"
                justifyContent="center"
                backgroundColor="#4c6c53"
                space="$1"
            >

                <SelectLanguagesForm />

            </Sheet.Frame>
        </Sheet>
    )
}