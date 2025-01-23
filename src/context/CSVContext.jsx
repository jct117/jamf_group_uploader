import React, { createContext, useState } from 'react';

export const CSVContext = createContext();

export const CSVProvider = ({ children }) => {
    const [csvData, setCSVData] = useState([]);

    return (
        <CSVContext.Provider value={{ csvData, setCSVData }}>
            {children}
        </CSVContext.Provider>
    );
};