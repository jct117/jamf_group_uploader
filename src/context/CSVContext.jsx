import React, { createContext, useState } from 'react';

export const CSVContext = createContext();

export const CSVProvider = ({ children }) => {
    const [csvData, setCSVData] = useState([]); // Ensure this is an array
    const [groupId, setGroupId] = useState('');

    return (
        <CSVContext.Provider value={{ csvData, setCSVData, groupId, setGroupId }}>
            {children}
        </CSVContext.Provider>
    );
};