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
import {XSquare} from "@tamagui/lucide-icons";
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
                        backgroundColor="#4c6c53"
                        borderColor="white"
                        title={`${item.number} - ${item.transliteration}`}
                        subTitle={language === "en" ? ` ${item.en.meaning} - ${item.name} ` : ` ${item.fr.meaning} - ${item.name} `}
                    />
                </Dialog.Trigger>

                <Adapt when="sm" platform="touch">
                    {/* @ts-ignore */}
                    <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
                        <Sheet.Frame padding="$4" gap="$4">
                            <Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay
                            animation="lazy"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
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
                        gap="$4"
                    >
                        <Dialog.Title>
                            {language === 'en' ? `${item.en.meaning} ${item.name}` : `${item.fr.meaning} ${item.name}`}
                        </Dialog.Title>
                        <Dialog.Description>
                            <Paragraph>
                                {
                                    language === 'en' ? item.en.desc : decodeURIComponent(JSON.parse(`"${item.fr.desc}"`))
                                }
                            </Paragraph>
                        </Dialog.Description>
                        <Unspaced>
                            <Dialog.Close asChild>
                                <Button
                                    position="absolute"
                                    top="$3"
                                    right="$3"
                                    size="$2"
                                    circular
                                    icon={XSquare}
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
        <YStack paddingHorizontal={"$4"}>
            <FlatList
                data={names.data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                initialNumToRender={15}
                maxToRenderPerBatch={15}
                removeClippedSubviews
                ItemSeparatorComponent={Separator}
                ListHeaderComponent={(
                    <H2 marginVertical="$4">
                        {i18n.t('nameAllah.title')}
                    </H2>
                )}
                showsVerticalScrollIndicator={false}
            />
        </YStack>

    )
}



export default App
