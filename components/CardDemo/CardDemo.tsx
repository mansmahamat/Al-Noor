import { LocateFixed } from "@tamagui/lucide-icons";
import moment from "moment";
import { Button, Card, CardProps, H2, Image, Paragraph, Text, XStack } from "tamagui";
import useGetDateHijri from "../../app/utils/useGetDateHijri";
import { prayerImages } from "../../utils/utils";
import { capitalizeFirstLetter } from "../../app/utils/utils";

interface Props {
    currentPrayer: string
    nextPrayerTime: Date
    nextPrayerName: string
    nextPrayerTimeHours: number
    nextPrayerTimeMinutes: number
    city: string
    date: Date
}


export function CardDemo({ currentPrayer, nextPrayerTime, nextPrayerName,
    nextPrayerTimeHours, nextPrayerTimeMinutes, city, date
}: Props) {





    const { data, month, day, year, designation, isLoading, error, refetch } =
        useGetDateHijri(date)

    return (

        <Card height="30%" backgroundColor="#4c6c53" borderColor="#4c6c53" size="$5" >
            <Card.Header padded>
                <Paragraph fontWeight="600" fontSize={26} color="white" numberOfLines={1}>
                    {capitalizeFirstLetter(currentPrayer)}
                </Paragraph>
                {/* <Text fontWeight="600"  fontSize={26} color="white" numberOfLines={1}>
                    {moment(nextPrayerTime).format('LT')} 
                </Text> */}


                <Paragraph color="white" fontSize={16} fontWeight="800" numberOfLines={1}>
                    {capitalizeFirstLetter(nextPrayerName)} in {nextPrayerTimeHours > 0 && `${nextPrayerTimeHours} hrs`} {nextPrayerTimeMinutes > 0 && `${nextPrayerTimeMinutes} mins`}
                </Paragraph>

            </Card.Header>
            <Card.Footer padded>
                <XStack flex={1} />

                <Button display="flex" backgroundColor="#4c6c53" alignItems="center" borderRadius="$10">
                    {/* <LocateFixed size={20} color="white" />
                    {city} */}
                    <Paragraph size="$2" textAlign="center" color="white" fontWeight="600">
                        {month} {day}, {year} {designation}
                    </Paragraph>
                </Button>

            </Card.Footer>
            <Card.Background shadowColor="#000"
                backgroundColor="rgba(0, 0, 0, 1)"
                borderRadius="$4"

                shadowOffset={
                    {
                        width: 0,
                        height: 2
                    }
                }
                shadowOpacity={0.3}
                shadowRadius={8}
                elevation={5} >
                <Image
                    resizeMode="cover"
                    alignSelf="center"
                    borderRadius="$4"
                    opacity={0.7}
                    width="100%"
                    height="100%"
                    source={{
                        width: 100,
                        height: 100,
                        uri: prayerImages[currentPrayer]

                    }}
                />

            </Card.Background>
        </Card >


    );
}

