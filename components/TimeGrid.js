import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import TimeIndex from './TimeIndex';
import DayColumn from './DayColumn';
import { fetchSchedule } from '../services/fetchSchedule';
import { useFiliere } from '../Contexts/FiliereContext';
import { getMostRecentMonday} from "../utils/helpers";

const TimeGrid = ({ shouldResetScroll, setShouldResetScroll }) => {
    const [loadedDays, setLoadedDays] = useState([]);
    const startDate = new Date(2023, 8, 1);
    const scrollViewRef = useRef();
    const [isScrollEnabled, setIsScrollEnabled] = useState(true);
    const [scheduleData, setScheduleData] = useState([]);

    const { filiere, groups } = useFiliere();

    const getMostRecentMonday = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };



    useEffect(() => {
        if (shouldResetScroll) {
            const today = new Date();
            const mostRecentMonday = getMostRecentMonday(new Date(today));

            const mondayIndex = loadedDays.findIndex(
                date => date.toDateString() === mostRecentMonday.toDateString()
            );

            if (mondayIndex !== -1) {
                scrollViewRef.current?.scrollTo({
                    x: mondayIndex * (Dimensions.get('window').width / 8),
                    animated: true,
                });
            }

            setShouldResetScroll(false);
        }

    }, [shouldResetScroll, loadedDays]);



    useEffect(() => {
        const fetchData = async () => {
            const events = await fetchSchedule(`https://orleanspulse.s3.eu-west-3.amazonaws.com/Ical-${filiere}.ics`);
            const filteredEvents = events.filter(event =>
                !event.group ||
                groups.includes(event.group)
            );

            setScheduleData(filteredEvents);
        };

        fetchData();
    }, [filiere, groups]);


    const loadMoreDays = (numberOfDays) => {
        let newDays = [];
        let lastDate = loadedDays.length ? new Date(loadedDays[loadedDays.length - 1].getTime()) : new Date(startDate);

        for (let i = 0; i < numberOfDays; i++) {
            let nextDate = new Date(lastDate);
            nextDate.setDate(lastDate.getDate() + 1);
            newDays.push(nextDate);
            lastDate = nextDate;
        }

        setLoadedDays([...loadedDays, ...newDays]);
    };

    useEffect(() => {
        loadMoreDays(8);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.timeIndexContainer}>
                <TimeIndex />
            </View>
            <ScrollView ref={scrollViewRef} horizontal scrollEnabled={isScrollEnabled} onScroll={({nativeEvent}) =>{
                //load later days if we are close to the end of the scrollview
            }}>
                {loadedDays.map((date, index) => {
                    const coursesOnThisDay = scheduleData.filter(course =>
                        new Date(course.startTime).toDateString() === date.toDateString()
                    );
                    return (
                        <DayColumn
                            key={index}
                            day={date.getDate()}
                            month={date.getMonth()}
                            year={date.getFullYear()}
                            courses={coursesOnThisDay}
                        />
                    );
                })}
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

    }
});

export default TimeGrid;
