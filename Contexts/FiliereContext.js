import React, {createContext, useContext, useEffect, useState} from 'react';
import {loadSettings} from "../utils/helpers";

const FiliereContext = createContext();

export const useFiliere = () => {
    return useContext(FiliereContext);
};

export const FiliereProvider = ({ children }) => {
    const [filiere, setFiliere] = useState("L3informatique");
    const [groups, setGroups] = useState([]);

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

    return (
        <FiliereContext.Provider value={{ filiere, setFiliere, groups, setGroups }}>
            {children}
        </FiliereContext.Provider>
    );
};
