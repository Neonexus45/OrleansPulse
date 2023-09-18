import React, {useRef, PureComponent, useState} from 'react';
import {View, Text, FlatList, ScrollView, Dimensions, StyleSheet} from 'react-native';
import {getDayLetter} from "../utils/helpers";
import Cours from "./Cours";

const DayColumn = ({ day, month, year, courses }) => {

    const [timeSlotPosition, setTimeSlotPosition] = useState(null);

    const dayLabelRef = useRef(null);

    const today = new Date();
    const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
    const date = new Date(year, month, day);
    const dayLetter = getDayLetter(date);

    return (
        <View style={styles.dayColumn}>
            <View style={styles.dayLabel} ref={dayLabelRef}>
                <Text style={styles.daytext}>{`${dayLetter} ${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`}</Text>
            </View>
            <View style={{ position: 'relative', height: '100%' }}>
                {timeSlotPosition !== null &&
                    <View style={{
                        position: 'absolute',
                        height: 2,
                        backgroundColor: 'orange',
                        width: '100%',
                        top: timeSlotPosition + (today.getMinutes() / 60) * (Dimensions.get('window').height / 12),
                        zIndex: 9999,
                    }} />
                }
                {courses.map((course, index) => (
                    <Cours
                        key={index}
                        startTime={course.startTime}
                        endTime={course.endTime}
                        courseName={course.courseName}
                        group={course.groups}
                        location={course.location}
                    />
                ))}
                {[...Array(15).keys()].map((hour) => (
                    <View
                        key={hour + 7}
                        onLayout={(event) => {
                            const layout = event.nativeEvent.layout;
                            if (isToday && (hour + 7) === today.getHours()) {
                                setTimeSlotPosition(layout.y);
                            }
                        }}
                        style={[styles.timeSlot, isToday ? { backgroundColor: '#E4E4E4', elevation: 1, position: 'relative' } : {}]}
                    >
                    </View>
                ))}
            </View>
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
