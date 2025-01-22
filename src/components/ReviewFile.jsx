import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const ReviewFile = ({ file, onSubmit, onBack }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const parsedData = Papa.parse(text, {
                    header: true, // Use the first row as headers
                    skipEmptyLines: true, // Skip empty rows
                });
                setData(parsedData.data); // Store parsed data as an array of objects
            };
            reader.readAsText(file);
        }
    }, [file]);

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://your-jamf-instance/api/v1/resource', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with your dynamic token
                },
                body: JSON.stringify(data), // Send the parsed data as the body
            });
            const result = await response.json();
            console.log('Response:', result);
            alert('File submitted successfully!');
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error occurred while submitting the data.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Review Uploaded File</h2>
            <div style={{ maxHeight: '400px', overflowY: 'scroll', margin: '20px auto', width: '80%' }}>
                {data.length > 0 ? (
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {Object.keys(data[0]).map((key) => (
                                    <th key={key} style={{ padding: '8px', background: '#f4f4f4' }}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, idx) => (
                                        <td key={idx} style={{ padding: '8px', textAlign: 'center' }}>
                                            {value || 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data to display. Please upload a valid file.</p>
                )}
            </div>
            <button
                onClick={handleSubmit}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Submit
            </button>
            <button
                onClick={onBack}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Back
            </button>
        </div>
    );
};

export default ReviewFile;