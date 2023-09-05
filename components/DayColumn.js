import React from 'react';
import { View, Text, FlatList } from 'react-native';
import TimeSlot from './TimeSlot';

const DayColumn = ({ day, timeSlots }) => {
    return (
        <View>
            <Text>{day}</Text>
            <FlatList
                data={timeSlots}
                renderItem={({ item }) => <TimeSlot details={item} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

export default DayColumn;
