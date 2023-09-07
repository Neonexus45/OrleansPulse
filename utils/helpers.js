import AsyncStorage from "@react-native-async-storage/async-storage";
export  function getDayLetter(date) {
    const weekday = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return weekday[date.getDay()].charAt(0).toUpperCase();
}

export  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return hash;
}

export  function getColorFromHash(hash) {
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 100%, 70%)`;
}


export const saveSettings = async (settings) => {
    try {
        await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (e) {
        console.error(e);
    }
};

export const loadSettings = async () => {
    try {
        const value = await AsyncStorage.getItem('userSettings');
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (e) {
        console.error(e);
    }
    return null;
};
