import React from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';


interface CalendarDateTimePickerProps {
    date: Date;
    onChange: (event: DateTimePickerEvent, date?: Date) => void;
}

const CalendarDateTimePicker: React.FC<CalendarDateTimePickerProps> = ({
    date,
    onChange,
}) => {
    return (
        <DateTimePicker
            testID="dateTimePicker"
            style={{ backgroundColor: "#4c6c53" }}
            textColor="#ffffff"
            themeVariant="dark"
            collapsable={true}
            value={date}
            mode="date"
            is24Hour={true}
            onChange={onChange}
        />
    );
};

export default CalendarDateTimePicker;
