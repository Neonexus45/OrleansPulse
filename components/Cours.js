import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {getColorFromHash, hashString} from '../utils/helpers';



const Cours = ({ startTime, endTime, courseName, group, location }) => {
    const startHour = new Date(startTime).getHours();
    const startMinutes = new Date(startTime).getMinutes();
    const endHour = new Date(endTime).getHours();
    const endMinutes = new Date(endTime).getMinutes();

    const durationHours = endHour - startHour;
    const durationMinutes = endMinutes - startMinutes;

    const timeSlotHeight = Dimensions.get('window').height / 12;
    const totalDuration = (durationHours + durationMinutes / 60) * timeSlotHeight;
    const topPosition = (startHour + startMinutes / 60) * timeSlotHeight;

    const color = getColorFromHash(hashString(courseName));

    return (
        <View style={[styles.course, { height: totalDuration, top: topPosition, backgroundColor: color }]}>
            <Text  style={styles.courseName}>{courseName}</Text>
            {group && <Text  style={styles.courseInfo}>{group}</Text>}
            {location && <Text style={styles.courseInfo}>{location}</Text>}
        </View>
    );
};
const styles = StyleSheet.create({
    course: {
        position: 'absolute',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderRadius: 2,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1,
        borderWidth: 0.25,
        borderColor: '#7c7878',
    },
    courseName: {
        fontSize: 6,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    courseInfo: {
        fontSize: 5,
        color: '#000000',
        textAlign: 'center',
    },
});

export default Cours;
