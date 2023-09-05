import React from 'react';
import { View, Text, TextInput } from 'react-native';

const Settings = () => {
    return (
        <View>
            <Text>Settings</Text>
            <TextInput placeholder="Groupe de TP" />
            <TextInput placeholder="Groupe de TD" />
            <TextInput placeholder="Filière" />
        </View>
    );
};

export default Settings;
