import React, { useState, useContext } from 'react';
import Papa from 'papaparse';
import { CSVContext } from '../context/CSVContext';

const FileUpload = ({ onUpload, onBack }) => {
    const [file, setFile] = useState(null); // File state
    const [groupId, setGroupId] = useState(''); // Group ID state
    const [error, setError] = useState('');

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
                onUpload(result.data, groupId); // Pass data and Group ID to parent
                setError('');
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




// import React, { useState, useContext } from 'react';
// import Papa from 'papaparse';
// import { CSVContext } from '../context/CSVContext'; // Import context for global state

// const FileUpload = ({ groupType, actionType, onBack }) => {
//     const [file, setFile] = useState(null); // File state
//     const [groupId, setGroupId] = useState(''); // Group ID state
//     const [error, setError] = useState(''); // Error state
//     const { setCSVData } = useContext(CSVContext); // Access the context to store CSV data

//     // Handle CSV file selection
//     const handleFileChange = (e) => {
//         const selectedFile = e.target.files[0];
//         if (selectedFile && selectedFile.type === 'text/csv') {
//             setFile(selectedFile);
//             setError(''); // Clear any previous errors
//         } else {
//             setError('Please select a valid CSV file.');
//         }
//     };

//     // Handle Group ID input and validation
//     const handleGroupIdChange = (e) => {
//         const value = e.target.value;
//         // Allow only numbers and limit to 5 characters
//         if (/^\d{0,5}$/.test(value)) {
//             setGroupId(value);
//             setError(''); // Clear any errors
//         } else {
//             setError('Group ID must be a number with up to 5 digits.');
//         }
//     };

//     // Handle file upload
//     const handleUpload = (e) => {
//         e.preventDefault();

//         if (!file) {
//             setError('No file selected. Please select a CSV file.');
//             return;
//         }

//         if (!groupId) {
//             setError('Group ID is required.');
//             return;
//         }

//         // Parse the CSV file
//         Papa.parse(file, {
//             header: true, // Automatically map header row to keys
//             skipEmptyLines: true,
//             complete: (result) => {
//                 console.log('Parsed CSV Data:', result.data); // Debug parsed data
//                 setCSVData(result.data); // Save parsed data to global state
//                 setError('');
//                 alert(`File uploaded successfully`);
//             },
//             error: (error) => {
//                 console.error('Error parsing CSV:', error);
//                 setError('Error parsing the file. Please try again.');
//             },
//         });
//     };

//     return (
//         <div style={{ textAlign: 'center', marginTop: '50px' }}>
//             <h2>Upload a .CSV file of Computer Serial Numbers</h2>
//             <form onSubmit={handleUpload}>
//                 <div style={{ marginBottom: '10px' }}>
//                     <label htmlFor="groupId">Group ID:</label>
//                     <input
//                         type="text"
//                         id="groupId"
//                         value={groupId}
//                         onChange={handleGroupIdChange}
//                         placeholder="Enter Group ID"
//                         maxLength="5"
//                         style={{ marginLeft: '10px', padding: '5px' }}
//                     />
//                 </div>
//                 <input
//                     type="file"
//                     accept=".csv"
//                     onChange={handleFileChange}
//                     style={{ marginBottom: '10px' }}
//                 />
//                 {error && <p style={{ color: 'red' }}>{error}</p>}
//                 <button
//                     type="submit"
//                     style={{
//                         marginLeft: '10px',
//                         padding: '10px 20px',
//                         backgroundColor: '#4caf50',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                     }}
//                 >
//                     Upload File
//                 </button>
//             </form>
//             <button onClick={onBack} style={{ marginTop: '20px' }}>Back</button>
//         </div>
//     );
// };

// export default FileUpload;