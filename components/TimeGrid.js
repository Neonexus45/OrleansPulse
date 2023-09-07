import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, FlatList, StyleSheet } from 'react-native';
import TimeIndex from './TimeIndex';
import DayColumn from './DayColumn';
import { fetchSchedule } from '../services/fetchSchedule';
import { useFiliere } from '../Contexts/FiliereContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused} from "@react-navigation/native";

const TimeGrid = ({ shouldResetScroll, setShouldResetScroll }) => {
    const [loadedDays, setLoadedDays] = useState([]);
    const startDate = new Date(2023, 8, 1);
    const scrollViewRef = useRef();
    const [scheduleData, setScheduleData] = useState([]);
    const [coursesByDay, setCoursesByDay] = useState({});

    const { filiere, groups } = useFiliere();
    const isFocused = useIsFocused();

    const getMostRecentMonday = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    useEffect(() => {
        if (shouldResetScroll) {
            const today = new Date();
            const mostRecentMonday = getMostRecentMonday(today);

            const mondayIndex = loadedDays.findIndex(
                date => date.toDateString() === mostRecentMonday.toDateString()
            );

            if (mondayIndex !== -1) {
                scrollViewRef.current?.scrollToOffset({
                    offset: mondayIndex * (Dimensions.get('window').width / 8),
                    animated: true,
                });
            }

            setShouldResetScroll(false);
        }
    }, [shouldResetScroll, loadedDays]);

    useEffect(() => {
        const loadCachedData = async () => {
            try {
                const cachedData = await AsyncStorage.getItem('scheduleData');
                if (cachedData) {
                    setScheduleData(JSON.parse(cachedData));
                    //process your cached data to setCoursesByDay
                    const newCoursesByDay = {};
                    JSON.parse(cachedData).forEach(course => {
                        const dateStr = new Date(course.startTime).toDateString();
                        if (!newCoursesByDay[dateStr]) newCoursesByDay[dateStr] = [];
                        newCoursesByDay[dateStr].push(course);
                    }
                    );
                    setCoursesByDay(newCoursesByDay);
                } else {
                    console.log("No cached data found");
                    fetchData();
                }
            } catch (e) {
                console.error(e);
            }
        }
        const fetchData = async () => {
            const events = await fetchSchedule(`https://orleanspulse.s3.eu-west-3.amazonaws.com/Ical-${filiere}.ics`);
            const filteredEvents = events.filter(event =>
                !event.group || groups.includes(event.group)
            );
            await AsyncStorage.setItem('scheduleData', JSON.stringify(filteredEvents));
            setScheduleData(filteredEvents);

            // Pre-compute courses by day
            const newCoursesByDay = {};
            filteredEvents.forEach(course => {
                const dateStr = new Date(course.startTime).toDateString();
                if (!newCoursesByDay[dateStr]) newCoursesByDay[dateStr] = [];
                newCoursesByDay[dateStr].push(course);
            });
            setCoursesByDay(newCoursesByDay);
        };

        const asyncOperation = async () => {
            const cachedData = await AsyncStorage.getItem('scheduleData');
            if (cachedData) {
                 loadCachedData();
            } else {
                 fetchData();
            }
        };

        if (isFocused) {
            asyncOperation();
        }
        }, [filiere, groups, isFocused]);



    const loadMoreDays = (numberOfDays) => {
        let newDays = [];
        let lastDate = loadedDays.length ? new Date(loadedDays[loadedDays.length - 1]) : new Date(startDate);

        for (let i = 0; i < numberOfDays; i++) {
            let nextDate = new Date(lastDate);
            nextDate.setDate(lastDate.getDate() + 1);
            newDays.push(nextDate);
            lastDate = nextDate;
        }

        setLoadedDays([...loadedDays, ...newDays]);
    };

    useEffect(() => {
        loadMoreDays(14);
    }, []);

    const renderItem = ({ item: date }) => {
        const coursesOnThisDay = coursesByDay[date.toDateString()] || [];
        return (
            <DayColumn
                day={date.getDate()}
                month={date.getMonth()}
                year={date.getFullYear()}
                courses={coursesOnThisDay}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.timeIndexContainer}>
                <TimeIndex />
            </View>
            <FlatList
                ref={scrollViewRef}
                horizontal
                data={loadedDays}
                renderItem={renderItem}
                keyExtractor={item => item.toDateString()}
                onEndReached={() => {
                    loadMoreDays(14);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    timeIndexContainer: {
        width: 50,
    }
});

export default TimeGrid;
