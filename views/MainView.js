import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DayMessage from "../components/DayMessage";
import TimeGrid from "../components/TimeGrid";
import {useNavigation} from "@react-navigation/native";

const MainView = () => {

    const [resetScroll, setResetScroll] = useState(false);
    const navigation = useNavigation();

    const resetScrollToToday = () => {
        setResetScroll(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.messageContainer}>
                    <DayMessage />
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={resetScrollToToday}>
                        <MaterialIcons name="today" size={32} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <MaterialIcons name="settings" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <TimeGrid shouldResetScroll={resetScroll} setShouldResetScroll={setResetScroll} />
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

    },
    messageContainer: {
        flex: 2,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 75,
        marginLeft: 10,
    },
});

export default MainView;
