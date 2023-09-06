import React, { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../utils/helpers';
import {Button, ScrollView, StyleSheet, TextInput, View} from "react-native";
import { fetchGroupsFromIcs } from '../services/fetchSchedule';
import { CheckBox } from 'react-native-elements';
import {useNavigation} from "@react-navigation/native";

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
            console.log("Fetching for filiere:", filiere);
            const fetchData = async () => {
                const groups = await fetchGroupsFromIcs(`https://orleanspulse.s3.eu-west-3.amazonaws.com/Ical-${filiere}.ics`);
                console.log("Available groups:", groups);
                setAvailableGroups(groups);
            };

            fetchData();
        }
    }, [filiere]);

    const handleSave = () => {
        saveSettings({ groups, filiere });
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