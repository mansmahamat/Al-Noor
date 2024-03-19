import {
    Check,
    ChevronDown,
    ChevronRight,
    ChevronUp,
} from "@tamagui/lucide-icons"
import React, { useMemo, useState } from "react"
import {
    Adapt,
    H2,
    Label,
    ListItem,
    Select,
    Sheet,
    YGroup,
    YStack,
} from "tamagui"
import useCalculationMethodStore from "../../../store/calculationMethodStore"
import useCalculationMadhab from "../../../store/calculationMadhabStore"
import { SelectMadhab } from "../../../components/SelectMadhab/SelectMadhab"
import SelectLanguagesSheet from "../../../components/SelectLanguages/SelectLanguagesSheet"
import useLanguageStore from "../../../store/languagesStore"
import { itemsCalculationMethod } from "../../../data/itemCalculation"
import {i18n} from "../../../lib/i18n";

const App = () => {
    const [open, setOpen] = useState(false)
    const [openLanguageSheet, setOpenLanguageSheet] = useState(false)
    const [position, setPosition] = useState(0)
    const { language } = useLanguageStore();
    i18n.locale = language;

    const { updateCalculationMethod, calculationMethod } = useCalculationMethodStore();
    const { updateCalculationMadhab, madhab } = useCalculationMadhab();



    return (
        <>
            <YStack paddingVertical="$4" paddingHorizontal="$4">
                <H2 marginBottom="$5">
                    {i18n.t('settings.title')}
                </H2>
                <YGroup alignSelf="center" width="100%" size="$5">
                    <YGroup.Item>
                        <ListItem

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

                    <Label>CalculationMethod : </Label>
                    <SelectDemoItem
                        updateCalculationMethod={updateCalculationMethod}
                        calculationMethod={calculationMethod}
                    />
                    <SelectMadhab
                        updateCalculationMadhab={updateCalculationMadhab}
                        madhab={madhab}
                    />

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



export function SelectDemoItem(props) {

    return (
        <>


            <Select
                id="calculationMethod"
                value={props.calculationMethod ?? "MuslimWorldLeague"}
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

                        minWidth={200}
                    >
                        <Select.Group>
                            <Select.Label>CalculationMethod</Select.Label>
                            {/* for longer lists memoizing these is useful */}
                            {useMemo(
                                () =>
                                    itemsCalculationMethod.map((item, i) => {
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
                                [itemsCalculationMethod]
                            )}
                        </Select.Group>

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


