import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchDataAndConvert} from '../services/ics2Json';
import {loadSettings} from "../utils/helpers";

export const useScheduleData = (filiere, groups, isFocused) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [coursesByDay, setCoursesByDay] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cachedData = await AsyncStorage.getItem('scheduleData');
                if (cachedData) {
                    const data = JSON.parse(cachedData);
                    setScheduleData(data);
                    processCoursesByDay(data);
                } else {
                    const events = await fetchDataAndConvert();
                    const savedGroups = await loadSettings();
                    const filteredEvents = events.events.filter(event =>
                        event.groups.length === 0 || event.groups.some(group => savedGroups.groups.includes(group))
                    );

                    await AsyncStorage.setItem('scheduleData', JSON.stringify(filteredEvents));
                    setScheduleData(filteredEvents);
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
    }, [filiere, groups, isFocused]);

    return { scheduleData, coursesByDay };
};
