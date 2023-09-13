import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchDataAndConvert} from '../services/ics2Json';
import {loadSettings} from "../utils/helpers";

export const useScheduleData = (isFocused) => {
    const [coursesByDay, setCoursesByDay] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cachedData = await AsyncStorage.getItem('scheduleData');
                if (cachedData) {
                    const data = JSON.parse(cachedData);
                    processCoursesByDay(data);
                } else {
                    const savedSettings = await loadSettings();
                    console.log(savedSettings);
                    const events = await fetchDataAndConvert(`https://orleanspulse.s3.eu-west-3.amazonaws.com/Ical-${savedSettings.filiere}.ics`);
                    const filteredEvents = events.events.filter(event =>
                        event.groups.length === 0 || event.groups.some(group => savedSettings.groups.includes(group))
                    );

                    await AsyncStorage.setItem('scheduleData', JSON.stringify(filteredEvents));
                    processCoursesByDay(filteredEvents);
                }
            } catch (error) {
                console.error("Error fetching schedule data:", error);
            }
        };

        const processCoursesByDay = (data) => {
            const byDay = {};
            data.forEach(course => {
                const dateStr = new Date(course.startTime).toDateString();
                if (!byDay[dateStr]) byDay[dateStr] = [];
                byDay[dateStr].push(course);
            });
            setCoursesByDay(byDay);
        };

        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    return {coursesByDay};
};
