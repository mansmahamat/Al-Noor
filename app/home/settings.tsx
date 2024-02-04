import {
    Check,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    ChevronsDown,
    FileQuestion,
} from "@tamagui/lucide-icons"
import React, { useMemo, useState } from "react"
import {
    Adapt,
    Button,
    H1,
    H2,
    Input,
    Label,
    ListItem,
    Paragraph,
    Select,
    Separator,
    Sheet,
    SizableText,
    XStack,
    YGroup,
    YStack,
    getFontSize,
} from "tamagui"
import { useCalculationMethodStore } from "../store/calculationMethodStore"
import { useCalculationMadhab } from "../store/calculationMadhabStore"
import { SelectMadhab } from "../../components/SelectMadhab/SelectMadhab"
import SelectLanguagesSheet from "../../components/SelectLanguages/SelectLanguagesSheet"
import { I18n } from "i18n-js";
import fr from "../../locales/french/fr.json";
import en from "../../locales/english/en.json";
import ar from "../../locales/arabic/ar.json";
import { useLanguageStore } from "../store/languagesStore"

const App = () => {
    const [open, setOpen] = useState(false)
    const [openLanguageSheet, setOpenLanguageSheet] = useState(false)
    const [position, setPosition] = useState(0)
    const [innerOpen, setInnerOpen] = useState(false)
    const { language } = useLanguageStore();

    const { updateCalculationMethod, calculationMethod } = useCalculationMethodStore();
    const { updateCalculationMadhab, madhab } = useCalculationMadhab();





    const i18n = new I18n({
        ...fr,
        ...en,
        ...ar
    });

    i18n.locale = language;

    return (
        <>
            <YStack paddingVertical="$4" paddingHorizontal="$4">
                <H1 marginBottom="$5">
                    {i18n.t('settings.title')}
                </H1>
                <YGroup alignSelf="center" width="100%" size="$5">
                    <YGroup.Item>
                        <ListItem
                            hoverTheme
                            pressTheme
                            color="white"
                            style={{ color: "#fff" }}
                            backgroundColor="#4c6c53"
                            marginBottom="$5"
                            title={i18n.t('settings.prayer_times')}
                            // subTitle="Subtitle"
                            iconAfter={ChevronRight}
                            onPress={() => setOpen(true)}
                        />
                    </YGroup.Item>
                    <YGroup.Item>
                        <ListItem
                            hoverTheme
                            pressTheme
                            marginBottom="$5"
                            backgroundColor="#4c6c53"
                            title={i18n.t('settings.notifications')}

                            // subTitle="Subtitle"
                            iconAfter={ChevronRight}
                        />
                    </YGroup.Item>
                    <YGroup.Item>
                        <ListItem
                            hoverTheme
                            pressTheme
                            backgroundColor="#4c6c53"
                            title={i18n.t('settings.language')}

                            // subTitle="Subtitle"
                            iconAfter={ChevronRight}
                            onPress={() => setOpenLanguageSheet(true)}
                        />
                    </YGroup.Item>
                </YGroup>
            </YStack>
            <Sheet
                forceRemoveScrollEnabled={open}
                modal={true}
                open={open}
                onOpenChange={setOpen}
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
                    {/* <Button
                        size="$6"
                        circular
                        icon={<ChevronsDown size={14} color="white" />}
                        onPress={() => setOpen(false)}
                    /> */}
                    <Label>CalculationMethod : </Label>
                    <SelectDemoItem
                        updateCalculationMethod={updateCalculationMethod}
                        calculationMethod={calculationMethod}
                    />
                    <SelectMadhab
                        updateCalculationMadhab={updateCalculationMadhab}
                        madhab={madhab}
                    />
                    {/* <>
                        <InnerSheet open={innerOpen} onOpenChange={setInnerOpen} />
                        <Button
                            size="$6"
                            circular
                            icon={<FileQuestion size={24} color="white" />}
                            onPress={() => setInnerOpen(true)}
                        />
                    </> */}
                </Sheet.Frame>
            </Sheet>
            <SelectLanguagesSheet
                setOpenLanguageSheet={setOpenLanguageSheet}
                openLanguageSheet={openLanguageSheet}
            />
        </>
    )
}

export default App

function InnerSheet(props) {
    return (
        <Sheet
            animation="medium"
            modal
            snapPoints={[90]}
            dismissOnSnapToBottom
            {...props}
        >
            <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
            />
            <Sheet.Handle />
            <Sheet.Frame
                flex={1}
                backgroundColor="#4c6c53"
                justifyContent="center"
                alignItems="center"
                space="$5"
            >
                <Sheet.ScrollView>
                    <YStack p="$5" gap="$8">
                        <Button
                            size="$6"
                            circular
                            alignSelf="center"
                            icon={ChevronDown}
                            onPress={() => props.onOpenChange?.(false)}
                        />
                        <H2>Adhan Calculation Methods</H2>
                        <Paragraph>
                            <SizableText size="$4" fontWeight="700">
                                Muslim World League:
                            </SizableText>{" "}
                            Standard Fajr time with an angle of 18°. Earlier Isha time with an
                            angle of 17°.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>Egyptian General Authority of Survey:</SizableText>{" "}
                            Early Fajr time using an angle 19.5° and a slightly earlier Isha
                            time using an angle of 17.5°.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>
                                University of Islamic Sciences, Karachi:
                            </SizableText>{" "}
                            A generally applicable method that uses standard Fajr and Isha
                            angles of 18°.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>Umm al-Qura University, Makkah:</SizableText> Uses a
                            fixed interval of 90 minutes from Maghrib to calculate Isha. And a
                            slightly earlier Fajr time with an angle of 18.5°. Note: you
                            should add a +30 minute custom adjustment for Isha during Ramadan.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>Used in the UAE:</SizableText> Slightly earlier Fajr
                            time and slightly later Isha time with angles of 18.2° for Fajr
                            and Isha in addition to 3-minute offsets for sunrise, Dhuhr, Asr,
                            and Maghrib.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>Qatar:</SizableText> Same Isha interval as Umm
                            al-Qura but with the standard Fajr time using an angle of 18°.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>Kuwait:</SizableText> Standard Fajr time with an
                            angle of 18°. Slightly earlier Isha time with an angle of 17.5°.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>Moonsighting Committee Method:</SizableText>{" "}
                            Developed by Khalid Shaukat, founder of Moonsighting Committee
                            Worldwide. Uses standard 18° angles for Fajr and Isha in addition
                            to seasonal adjustment values. This method automatically applies
                            the 1/7 approximation rule for locations above 55° latitude.
                            Recommended for North America and the UK.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>Singapore:</SizableText> Used in Singapore, Malaysia,
                            and Indonesia. Early Fajr time with an angle of 20° and standard
                            Isha time with an angle of 18°.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>Turkey:</SizableText> An approximation of the Diyanet
                            method used in Turkey. This approximation is less accurate outside
                            the region of Turkey.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>Tehran:</SizableText> Institute of Geophysics,
                            University of Tehran. Early Isha time with an angle of 14°.
                            Slightly later Fajr time with an angle of 17.7°. Calculates
                            Maghrib based on the sun reaching an angle of 4.5° below the
                            horizon.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>North America (ISNA Method):</SizableText> Also known
                            as the ISNA method. Can be used for North America, but the
                            Moonsighting Committee method is preferable. Gives later Fajr
                            times and early Isha times with angles of 15°.
                        </Paragraph>
                        <Paragraph>
                            <SizableText>Custom Method (Other):</SizableText> Defaults to
                            angles of 0°, should generally be used for making a custom method
                            and setting your own values.
                        </Paragraph>
                    </YStack>
                </Sheet.ScrollView>
            </Sheet.Frame>
        </Sheet>
    )
}

export function SelectDemoItem(props) {
    const [val, setVal] = useState(props.calculationMethod || "CalculationMethod")

    return (
        <>


            <Select
                id="calculationMethod"
                value={props.calculationMethod}
                onValueChange={props.updateCalculationMethod}
                disablePreventBodyScroll
                {...props}
            >
                <Select.Trigger width="100%" iconAfter={ChevronDown}>
                    <Select.Value placeholder="Something" />
                </Select.Trigger>

                <Adapt when="sm" platform="touch">
                    <Sheet
                        native={!!props.native}
                        modal
                        dismissOnSnapToBottom
                        animationConfig={{
                            type: "spring",
                            damping: 20,
                            mass: 1.2,
                            stiffness: 250,
                        }}
                    >
                        <Sheet.Frame>
                            <Sheet.ScrollView>
                                <Adapt.Contents />
                            </Sheet.ScrollView>
                        </Sheet.Frame>
                        <Sheet.Overlay
                            animation="lazy"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                        />
                    </Sheet>
                </Adapt>

                <Select.Content zIndex={200000}>
                    <Select.ScrollUpButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                    >
                        <YStack zIndex={10}>
                            <ChevronUp size={20} />
                        </YStack>
                    </Select.ScrollUpButton>

                    <Select.Viewport
                        // to do animations:
                        // animation="quick"
                        // animateOnly={['transform', 'opacity']}
                        // enterStyle={{ o: 0, y: -10 }}
                        // exitStyle={{ o: 0, y: 10 }}
                        minWidth={200}
                    >
                        <Select.Group>
                            <Select.Label>CalculationMethod</Select.Label>
                            {/* for longer lists memoizing these is useful */}
                            {useMemo(
                                () =>
                                    items.map((item, i) => {
                                        return (
                                            <Select.Item
                                                index={i}
                                                key={item.name}
                                                value={item.name.toLowerCase()}
                                            >
                                                <Select.ItemText>{item.name}</Select.ItemText>
                                                <Select.ItemIndicator marginLeft="auto">
                                                    <Check size={16} />
                                                </Select.ItemIndicator>
                                            </Select.Item>
                                        )
                                    }),
                                [items]
                            )}
                        </Select.Group>
                        {/* Native gets an extra icon */}
                        {props.native && (
                            <YStack
                                position="absolute"
                                right={0}
                                top={0}
                                bottom={0}
                                alignItems="center"
                                justifyContent="center"
                                width={"$4"}
                                pointerEvents="none"
                            >
                                <ChevronDown size={getFontSize(props.size ?? "$true")} />
                            </YStack>
                        )}
                    </Select.Viewport>

                    <Select.ScrollDownButton
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        width="100%"
                        height="$3"
                    >
                        <YStack zIndex={10}>
                            <ChevronDown size={20} />
                        </YStack>
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select>
        </>
    )
}

const items = [
    { name: "MuslimWorldLeague" },
    { name: "Egyptian" },
    { name: "Karachi" },
    { name: "UmmAlQura" },
    { name: "Dubai" },
    { name: "Qatar" },
    { name: "Kuwait" },
    { name: "MoonsightingCommittee" },
    { name: "Singapore" },
    { name: "Turkey" },
    { name: "Tehran" },
    { name: "NorthAmerica" },
    { name: "Other" },
]
