import React, { useState } from 'react'
import { Sheet } from 'tamagui'
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
            snapPoints={[35]}
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
                backgroundColor="rgba(0,0,0,0.5)"
            />
            <Sheet.Handle backgroundColor="#E1E1E1" />
            <Sheet.Frame
                padding="$5"
                justifyContent="flex-start"
                backgroundColor="#FFFFFF"
                space="$3"
                borderTopLeftRadius={20}
                borderTopRightRadius={20}
            >
                <SelectLanguagesForm />
            </Sheet.Frame>
        </Sheet>
    )
}