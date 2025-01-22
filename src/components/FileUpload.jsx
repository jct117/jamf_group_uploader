import React, { useState } from 'react';
import Papa from 'papaparse';

const FileUpload = ({ groupType, actionType, onUpload, onBack }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError(''); // Clear any previous errors
        } else {
            setError('Please select a valid CSV file.');
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (!file) {
            setError('No file selected. Please select a CSV file.');
            return;
        }

        // Use PapaParse to parse the CSV file
        Papa.parse(file, {
            header: true, // Automatically map header row to keys
            skipEmptyLines: true,
            complete: (result) => {
                console.log('Parsed CSV Data:', result.data); // Debug parsed data
                onUpload(result.data); // Pass parsed data to parent
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
                    Upload
                </button>
            </form>
            <button onClick={onBack} style={{ marginTop: '20px' }}>Back</button>
        </div>
    );
};

export default FileUpload;