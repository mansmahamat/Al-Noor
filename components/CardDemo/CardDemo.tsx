import { Button, Card, Image, Paragraph, XStack } from "tamagui";
import useGetDateHijri from "../../app/utils/useGetDateHijri";
import { prayerImages } from "../../utils/utils";
import { capitalizeFirstLetter } from "../../app/utils/utils";
import { ActivityIndicator } from "react-native";

interface Props {
  currentPrayer: string;
  nextPrayerTime: Date;
  nextPrayerName: string;
  nextPrayerTimeHours: number;
  nextPrayerTimeMinutes: number;
  city: string;
  date: Date;
}

export function CardDemo({
  currentPrayer,
  nextPrayerTime,
  nextPrayerName,
  nextPrayerTimeHours,
  nextPrayerTimeMinutes,
  city,
  date,
}: Props) {
  const { data, month, day, year, designation, isLoading, error, refetch } =
    useGetDateHijri(date);

  return (
    <Card
      height="30%"
      backgroundColor="#4c6c53"
      borderColor="#4c6c53"
      size="$5"
    >
      <Card.Header padded>
        <Paragraph
          fontWeight="600"
          fontSize={26}
          color="white"
          numberOfLines={1}
        >
          {capitalizeFirstLetter(currentPrayer)}
        </Paragraph>

        <Paragraph
          color="white"
          fontSize={16}
          fontWeight="800"
          numberOfLines={1}
        >
          {capitalizeFirstLetter(nextPrayerName)} :{" "}
          {nextPrayerTimeHours > 0 && `${nextPrayerTimeHours} hrs`}{" "}
          {nextPrayerTimeMinutes > 0 ? (
            `${nextPrayerTimeMinutes} mins`
          ) : (
            <ActivityIndicator size="small" color="white" />
          )}
        </Paragraph>
        <Paragraph
          fontWeight="600"
          fontSize={26}
          color="white"
          numberOfLines={1}
        >
          {capitalizeFirstLetter("city")}
        </Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />

        <Button
          display="flex"
          backgroundColor="#4c6c53"
          alignItems="center"
          borderRadius="$10"
        >
          <Paragraph
            size="$2"
            textAlign="center"
            color="white"
            fontWeight="600"
          >
            {month} {day}, {year} {designation}
          </Paragraph>
        </Button>
      </Card.Footer>
      <Card.Background
        shadowColor="#000"
        backgroundColor="rgba(0, 0, 0, 1)"
        borderRadius="$4"
        shadowOffset={{
          width: 0,
          height: 2,
        }}
        shadowOpacity={0.3}
        shadowRadius={8}
        elevation={5}
      >
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
            uri: prayerImages[currentPrayer.toLocaleLowerCase()],
          }}
        />
      </Card.Background>
    </Card>
  );
}
