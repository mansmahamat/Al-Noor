import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons"
import { useMemo, useState } from "react"
import { Adapt, Label, Select, Sheet, YStack } from "tamagui"

interface SelectMadhabProps {
    updateCalculationMadhab: (madhab: string) => void
    madhab: string
}


export function SelectMadhab({ updateCalculationMadhab, madhab }: SelectMadhabProps) {
    const [val, setVal] = useState(madhab || "Shafi")

    return (
        <>
            <Label>Madhab {madhab} </Label>
            <Select
                id="calculationMethod"
                value={val}
                onValueChange={updateCalculationMadhab}
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
                        // to do animations:
                        // animation="quick"
                        // animateOnly={['transform', 'opacity']}
                        // enterStyle={{ o: 0, y: -10 }}
                        // exitStyle={{ o: 0, y: 10 }}
                        minWidth={200}
                    >
                        <Select.Group>
                            <Select.Label>Madhab</Select.Label>
                            {/* for longer lists memoizing these is useful */}
                            {useMemo(
                                () =>
                                    items.map((item, i) => {
                                        return (
                                            <Select.Item
                                                index={i}
                                                key={i}
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

const items = [{ name: "shafi" }, { name: "hanafi" }]
