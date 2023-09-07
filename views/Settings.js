import React, {useEffect, useState} from 'react';
import {loadSettings, saveSettings} from '../utils/helpers';
import {Button, ScrollView, StyleSheet, TextInput} from "react-native";
import {CheckBox} from 'react-native-elements';
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {fetchDataAndConvert} from "../services/ics2Json";

const Settings = () => {

    const [groups, setGroups] = useState([]);
    const [filiere, setFiliere] = useState('');
    const [availableGroups, setAvailableGroups] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        const loadPreviouslySavedSettings = async () => {
            const settings = await loadSettings();
            if (settings) {
                setFiliere(settings.filiere || '');
                setGroups(settings.groups || []);
            }
        };

        loadPreviouslySavedSettings();
    }, []);

    useEffect(() => {
        if (filiere) {
            const fetchData = async () => {
                const jsonData = await fetchDataAndConvert(`https://orleanspulse.s3.eu-west-3.amazonaws.com/Ical-${filiere}.ics`);
                const uniqueGroups = jsonData.uniqueGroups;
                setAvailableGroups(uniqueGroups);
            };
            fetchData();
        }
    }, [filiere]);

    const handleSave = async () => {
        await saveSettings({ groups, filiere });
        try {
            await AsyncStorage.removeItem('scheduleData');
        } catch (e) {
            console.error('Failed to remove cached data:', e);
        }
        navigation.navigate('MainView');
    };

    return (
        <ScrollView vertical contentContainerStyle={{flexGrow: 1}}>
        <TextInput placeholder="Entrez votre filière" value={filiere} onChangeText={setFiliere} />
            {availableGroups.map((group, index) => (
                <CheckBox
                    key={index}
                    title={group}
                    checked={groups.includes(group)}
                    onPress={() => {
                        if (groups.includes(group)) {
                            setGroups(groups.filter(g => g !== group));
                        } else {
                            setGroups([...groups, group]);
                        }
                    }}
                />
            ))}

            <Button title="Sauvegarder" onPress={handleSave} />
            </ScrollView>
    );
};

const styles = StyleSheet.create({
    filiereInput: {

    }
});

export default Settings;