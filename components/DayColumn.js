import React, { useRef, useEffect } from 'react';
import {View, Text, FlatList, ScrollView, Dimensions, StyleSheet} from 'react-native';
import {getDayLetter} from "../utils/helpers";
import Cours from "./Cours";

const DayColumn = ({ day, month, year, courses }) => {
    const dayLabelRef = useRef(null);

    const today = new Date();
    const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
    const date = new Date(year, month, day);
    const dayLetter = getDayLetter(date);

    return (
        <View style={styles.dayColumn}>
            <ScrollView>
                <View style={styles.dayLabel} ref={dayLabelRef}>
                    <Text style={styles.daytext}>{`${dayLetter} ${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`}</Text>
                </View>
                <View style={{ position: 'relative', height: '100%' }}>
                    {courses.map((course, index) => (
                        <Cours
                            key={index}
                            startTime={course.startTime}
                            endTime={course.endTime}
                            courseName={course.courseName}
                            group={course.group}
                            location={course.location}
                        />
                    ))}
                <ScrollView nestedScrollEnabled>
                    {[...Array(24).keys()].map((hour) => (
                        <View key={hour} style={[styles.timeSlot, isToday ? { backgroundColor: '#E4E4E4' } : {}]}>
                            {isToday && hour === today.getHours() &&
                                <View style={{
                                    position: 'absolute',
                                    height: 2,
                                    backgroundColor: 'orange',
                                    width: '100%',
                                    top: (today.getMinutes() / 60) * (Dimensions.get('window').height / 12)
                                }} />
                            }

                        </View>

                    ))}
                </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    dayColumn: {
        width: Dimensions.get('window').width / 8,
        height: '100%',
    },
    timeSlot: {
        borderWidth: 0.25,
        borderColor: 'gray',
        height: Dimensions.get('window').height / 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    daytext: {
        justifyContent: "center",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 10,
    },
    dayLabel: {
        zIndex: 1,
        width: '100%',
        height: Dimensions.get('window').height / 32,
        backgroundColor: 'white',
        marginTop:Dimensions.get('window').height / 64,
        marginLeft: 0,
    }
});

export default React.memo(DayColumn);
