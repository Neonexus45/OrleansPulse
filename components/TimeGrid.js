import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, FlatList, StyleSheet } from 'react-native';
import TimeIndex from './TimeIndex';
import DayColumn from './DayColumn';
import { useFiliere } from '../Contexts/FiliereContext';
import {useIsFocused} from "@react-navigation/native";
import {useScheduleData} from "../hooks/useScheduleData";

const TimeGrid = ({ shouldResetScroll, setShouldResetScroll, shouldRefresh, setShouldRefresh }) => {
    const [loadedDays, setLoadedDays] = useState([]);
    const startDate = new Date(2023, 8, 1);
    const scrollViewRef = useRef();

    const { filiere, groups } = useFiliere();
    const isFocused = useIsFocused();

    const { scheduleData, coursesByDay } = useScheduleData(filiere, groups, isFocused);

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
                scrollViewRef.current?.scrollToIndex({
                    index: mondayIndex,
                    animated: true,
                });
            }

            setShouldResetScroll(false);
        }
    }, [shouldResetScroll, loadedDays]);

    const loadMoreDays = (numberOfDays) => {
        let newDays = [];
        let lastDate = loadedDays.length ? new Date(loadedDays[loadedDays.length - 1]) : new Date(startDate);

        for (let i = 0; i < numberOfDays; i++) {
            lastDate = new Date(lastDate);
            lastDate.setDate(lastDate.getDate() + 1);
            newDays.push(new Date(lastDate));
        }

        setLoadedDays(prevDays => [...prevDays, ...newDays]);
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
