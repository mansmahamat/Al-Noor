import React from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Button, Text } from 'tamagui';
import moment from 'moment';

interface CalendarDateTimePickerProps {
    date: Date;
    onChange: (event: DateTimePickerEvent, date?: Date) => void;
    showPicker: boolean;
    onPress: () => void;
}

const CalendarDateTimePicker: React.FC<CalendarDateTimePickerProps> = ({
    date,
    onChange,
    showPicker,
    onPress,
}) => {
    return (
        <>
            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="default"
                    themeVariant="light"
                    accentColor="#007AFF"
                    onChange={onChange}
                />
            )}
        </>
    );
};

export default CalendarDateTimePicker;
