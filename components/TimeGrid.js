import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import TimeIndex from './TimeIndex';

const DayColumn = ({ day }) => {
    return (
        <View style={styles.dayColumn}>
            <Text>{`Day ${day}`}</Text>
            {[...Array(24).keys()].map((hour) => (
                <View key={hour} style={styles.timeSlot}>
                    <Text>Time Slot</Text>
                </View>
            ))}
        </View>
    );
};

const TimeGrid = () => {
    const [loadedDays, setLoadedDays] = useState([...Array(10).keys()]);

    const loadMoreDays = () => {
        const lastLoadedDay = loadedDays[loadedDays.length - 1];
        const newDays = [...Array(10).keys()].map((day) => lastLoadedDay + day + 1);
        setLoadedDays([...loadedDays, ...newDays]);
    };

    useEffect(() => {
        loadMoreDays();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.timeIndexContainer}>
                <TimeIndex />
            </View>
            <ScrollView
                horizontal
                onScroll={({ nativeEvent }) => {
                    if (nativeEvent.contentOffset.x > (loadedDays.length - 5) * 100) {
                        loadMoreDays();
                    }
                }}
            >
                {loadedDays.map((day) => (
                    <DayColumn key={day} day={day} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    timeIndexContainer: {
        width: 50,
    },
    dayColumn: {
        width: 100,
    },
    timeSlot: {
        borderWidth: 0.25,
        borderColor: 'gray',
        height: Dimensions.get('window').height / 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TimeGrid;
