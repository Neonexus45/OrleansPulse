import React from 'react';
import { View, Text } from 'react-native';

const TimeSlot = ({ details }) => {
    return (
        <View>
            <Text>{details.subject}</Text>
            <Text>{details.time}</Text>
        </View>
    );
};

export default TimeSlot;
