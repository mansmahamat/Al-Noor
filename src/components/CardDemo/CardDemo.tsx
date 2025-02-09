import { Button, Card, Image, Paragraph, XStack } from "tamagui";
import useGetDateHijri from "../../utils/useGetDateHijri";
import { prayerImages } from "../../utils/utils";
import { capitalizeFirstLetter } from "../../utils/utils";
import { ActivityIndicator } from "react-native";

interface Props {
  currentPrayer: string;
  nextPrayerTime: Date;
  nextPrayerName: string;
  nextPrayerTimeHours: number;
  nextPrayerTimeMinutes: number;
  city?: string;
  date: Date;
  isLoading?: boolean;
  theme?: 'light' | 'dark';
}

export function CardDemo({
  currentPrayer,
  nextPrayerName,
  nextPrayerTimeHours,
  nextPrayerTimeMinutes,
  city,
  date,
  isLoading = false,
  theme = 'light',
}: Props) {
  const { month, day, year, designation } = useGetDateHijri(date);
  
  const colors = {
    background: theme === 'light' ? '#4c6c53' : '#2d4132',
    text: 'white',
    overlay: 'rgba(0, 0, 0, 0.7)'
  };

  return (
    <Card
      height="30%"
      backgroundColor={colors.background}
      borderColor={colors.background}
      size="$5"
      accessible={true}
      accessibilityLabel={`Current prayer: ${currentPrayer}. Next prayer: ${nextPrayerName}`}
    >
      <Card.Header padded>
        <Paragraph
          fontWeight="600"
          fontSize={26}
          color={colors.text}
          numberOfLines={1}
          accessible={true}
          accessibilityRole="header"
        >
          {capitalizeFirstLetter(currentPrayer)}
        </Paragraph>

        <Paragraph
          color={colors.text}
          fontSize={16}
          fontWeight="800"
          numberOfLines={1}
        >
          {capitalizeFirstLetter(nextPrayerName)}:{' '}
          {!isLoading ? (
            <>
              {nextPrayerTimeHours > 0 && `${nextPrayerTimeHours} ${nextPrayerTimeHours === 1 ? 'hour' : 'hours'}`}{' '}
              {nextPrayerTimeMinutes > 0 && `${nextPrayerTimeMinutes} ${nextPrayerTimeMinutes === 1 ? 'minute' : 'minutes'}`}
            </>
          ) : (
            <ActivityIndicator size="small" color={colors.text} />
          )}
        </Paragraph>

        {city && (
          <Paragraph
            fontWeight="600"
            fontSize="$7"
            marginTop="$2"
            color={colors.text}
            numberOfLines={1}
          >
            {capitalizeFirstLetter(city)}
          </Paragraph>
        )}
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
        backgroundColor={colors.overlay}
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
          accessible={true}
          accessibilityLabel={`Prayer time background image for ${currentPrayer}`}
        />
      </Card.Background>
    </Card>
  );
}
