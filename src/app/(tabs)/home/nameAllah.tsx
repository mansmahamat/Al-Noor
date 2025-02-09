import {
    Adapt,
    Dialog,
    H2,
    ListItem,
    Paragraph,
    Sheet,
    Unspaced,
    Button,
    YStack,
    Separator
} from "tamagui"
import names from "../../../assets/data/99_name.json"
import useLanguageStore from "../../../store/languagesStore"
import {i18n} from "../../../lib/i18n";
import {FlatList} from "react-native";
import {XSquare, ChevronRight} from "@tamagui/lucide-icons";
import {useCallback} from "react";

const App = () => {
    const { language } = useLanguageStore();
    i18n.locale = language;

    const renderItem = useCallback(({ item }) => {
        return (
            <Dialog modal>
                <Dialog.Trigger asChild>
                    <ListItem
                        hoverTheme
                        pressTheme
                        backgroundColor="$backgroundStrong"
                        borderRadius="$4"
                        marginVertical="$1"
                        paddingVertical="$3"
                        animation="quick"
                        scale={0.97}
                        hoverStyle={{
                            scale: 1,
                            backgroundColor: "$background",
                        }}
                        pressStyle={{
                            scale: 0.95,
                        }}
                        title={`${item.number} - ${item.transliteration}`}
                        subTitle={language === "en" ? ` ${item.en.meaning} - ${item.name} ` : ` ${item.fr.meaning} - ${item.name} `}
                        iconAfter={<YStack opacity={0.5}><ChevronRight size="$1" /></YStack>}
                    />
                </Dialog.Trigger>

                <Adapt when="sm" platform="touch">
                    <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
                        <Sheet.Frame padding="$6" gap="$5">
                            <Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay
                            animation="lazy"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                            backgroundColor="rgba(0,0,0,0.5)"
                        />
                    </Sheet>
                </Adapt>

                <Dialog.Portal>
                    <Dialog.Overlay
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />

                    <Dialog.Content
                        bordered
                        elevate
                        key="content"
                        animateOnly={['transform', 'opacity']}
                        animation={[
                            'quick',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                        gap="$5"
                        padding="$6"
                        borderRadius="$6"
                    >
                        <YStack gap="$2">
                            <H2 color="$color">
                                {item.name}
                            </H2>
                            <Dialog.Title color="$color" opacity={0.7}>
                                {language === 'en' ? item.en.meaning : item.fr.meaning}
                            </Dialog.Title>
                        </YStack>
                        <Dialog.Description>
                            <Paragraph size="$5" lineHeight={24} opacity={0.8}>
                                {
                                    language === 'en' ? item.en.desc : decodeURIComponent(JSON.parse(`"${item.fr.desc}"`))
                                }
                            </Paragraph>
                        </Dialog.Description>
                        <Unspaced>
                            <Dialog.Close asChild>
                                <Button
                                    position="absolute"
                                    top="$4"
                                    right="$4"
                                    size="$3"
                                    circular
                                    icon={XSquare}
                                    opacity={0.7}
                                    hoverStyle={{ opacity: 1 }}
                                />
                            </Dialog.Close>
                        </Unspaced>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>
        )
    }, [])

    const keyExtractor = (item: { number: number }) => `name-${item.number.toString()}`

    return (
        <YStack paddingHorizontal="$4" flex={1} backgroundColor="$background">
            <FlatList
                data={names.data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                initialNumToRender={15}
                maxToRenderPerBatch={15}
                removeClippedSubviews
                ItemSeparatorComponent={() => <YStack height={1} />}
                ListHeaderComponent={(
                    <H2 marginVertical="$5" textAlign="center" opacity={0.9}>
                        {i18n.t('nameAllah.title')}
                    </H2>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </YStack>
    )
}

export default App
