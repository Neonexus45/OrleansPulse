import React, { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../utils/helpers';
import {Button, ScrollView, StyleSheet, Text, View} from "react-native";
import { CheckBox } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchDataAndConvert } from "../services/ics2Json";
import DropDownPicker from 'react-native-dropdown-picker';

const Settings = () => {

    const [groups, setGroups] = useState([]);
    const [filiere, setFiliere] = useState('');
    const [availableGroups, setAvailableGroups] = useState([]);
    const [open, setOpen] = useState(false);

    const navigation = useNavigation();
    const [filiereList, setFiliereList] = useState([
        {label: "L3 informatique", value: 'L3informatique'},
        {label: "L3 staps Management", value: 'L3StapsManagement'},
        {label: "L3 informatique Miage", value: 'L3InformatiqueMiage'},
        {label: "L3 staps APAS", value: 'L3StapsAPAS'},
    ]);

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
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 15 }}>
                <Text style={styles.title}>Paramètres</Text>
                <DropDownPicker
                    open={open}
                    value={filiere}
                    items={filiereList}
                    setOpen={setOpen}
                    setValue={setFiliere}
                    setItems={setFiliereList}
                    placeholder={'Choisir une filière'}
                />
            </View>
            <ScrollView style={{ flex: 1 }} vertical contentContainerStyle={{ flexGrow: 1 }}>
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
            </ScrollView>
            <View style={{ marginBottom: 10 }}>
                <Button style={styles.SaveButton} title="Sauvegarder" onPress={handleSave} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 30,
    },
    SaveButton: {
    }
});

export default Settings;
