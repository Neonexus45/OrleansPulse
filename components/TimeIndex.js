// TimeIndex.js

import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';

const formatHour = (hour) => {
    return hour < 10 ? `0${hour}` : `${hour}`;
};
const TimeIndex = () => {
    return (
        <ScrollView style={styles.container} vertical>
            {[...Array(23).keys()].map((hour) => (
                <View key={hour + 1} style={styles.hourBlock}>
                    <Text style={styles.hourText}>{`${formatHour(hour + 1)}:00`}</Text>
                </View>

            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Dimensions.get('window').height/12 + Dimensions.get('window').height / 64 - Dimensions.get('window').height / 100,
        flex: 1,
    },
    hourBlock: {
        height: Dimensions.get('window').height / 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    hourText: {
        color: 'grey',
        marginLeft: 5,
        marginRight: 5,
        fontSize: 12,
    },
    gridstyle: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',

    }
});

export default TimeIndex;
