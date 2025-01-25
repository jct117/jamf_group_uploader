import React, { useState, useContext } from 'react';
import Papa from 'papaparse';
import { CSVContext } from '../context/CSVContext';

const FileUpload = ({ onNext, onBack }) => {
    const [file, setFile] = useState(null); // File state
    const [groupId, setGroupId] = useState(''); // Group ID state
    const [error, setError] = useState('');
    const { setCSVData } = useContext(CSVContext); // Access the context

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a valid CSV file.');
        }
    };

    const handleGroupIdChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,5}$/.test(value)) {
            setGroupId(value);
            setError('');
        } else {
            setError('Group ID must be a number with up to 5 digits.');
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (!file) {
            setError('No file selected. Please select a CSV file.');
            return;
        }

        if (!groupId) {
            setError('Group ID is required.');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                console.log('Parsed CSV Data:', result.data);
                setCSVData({ data: result.data, groupId }); // Save data and Group ID to context
                setError('');
                onNext(); // Navigate to the next screen
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                setError('Error parsing the file. Please try again.');
            },
        });
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Upload a .CSV file of Computer Serial Numbers</h2>
            <form onSubmit={handleUpload}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="groupId">Group ID:</label>
                    <input
                        type="text"
                        id="groupId"
                        value={groupId}
                        onChange={handleGroupIdChange}
                        placeholder="Enter Group ID"
                        maxLength="5"
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </div>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ marginBottom: '10px' }}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button
                    type="submit"
                    style={{
                        marginLeft: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Upload File
                </button>
            </form>
            <button onClick={onBack} style={{ marginTop: '20px' }}>Back</button>
        </div>
    );
};

export default FileUpload;