import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons"
import { Adapt, Label, Select, Sheet, YStack } from "tamagui"
import useLanguageStore from "../../store/languagesStore"



export function SelectLanguagesForm() {


    const { language, updateLanguage } = useLanguageStore();


    return (
        <>
            <Label>
                Language
            </Label>
            <Select
                value={language}
                onValueChange={updateLanguage}
                disablePreventBodyScroll
            >
                <Select.Trigger width="100%" color="white" iconAfter={ChevronDown}>
                    <Select.Value placeholder="Something" />
                </Select.Trigger>

                <Adapt when="sm" platform="touch">
                    <Sheet
                        native={false}
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
                            <Select.Label>Languages  </Select.Label>
                            {/* for longer lists memoizing these is useful */}
                            <Select.Item
                                value="en"
                                index={1}
                            >
                                <Select.ItemText>English</Select.ItemText>
                                <Select.ItemIndicator marginLeft="auto">
                                    <Check size={16} />
                                </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                                value="fr"
                                index={2}
                            >
                                <Select.ItemText>Français</Select.ItemText>
                                <Select.ItemIndicator marginLeft="auto">
                                    <Check size={16} />
                                </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                                value="ar"
                                index={2}
                            >
                                <Select.ItemText>العربية</Select.ItemText>
                                <Select.ItemIndicator marginLeft="auto">
                                    <Check size={16} />
                                </Select.ItemIndicator>
                            </Select.Item>
                        </Select.Group>
                        {/* Native gets an extra icon */}
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