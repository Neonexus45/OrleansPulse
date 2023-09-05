import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DayMessage from "../components/DayMessage";
import TimeIndex from "../components/TimeIndex";
import TimeGrid from "../components/TimeGrid";

const MainView = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.messageContainer}>
                <DayMessage />
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <MaterialIcons name="today" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="autorenew" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="settings" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <TimeGrid />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 25,
        backgroundColor: '#5ebce8',
        borderBottomWidth: 1,
        borderBottomColor: '#CCC',
        borderRadius: 5,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 100,
        flex: 1,
    },
    messageContainer: {
        flex: 2,
    },
    gridContainer: {
        flex: 1, // Takes up most of the horizontal space
    },
    timeIndexContainer: {
        width: 100, // Fixed width for TimeIndex
        backgroundColor: '#f0f0f0',
    },
});

export default MainView;
