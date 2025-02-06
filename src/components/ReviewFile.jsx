import React, { useEffect, useState, useContext } from 'react';
import { CSVContext } from '../context/CSVContext';

const ReviewFile = ({ token, onSubmit, onBack }) => {
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');
    const [siteUrl, setSiteUrl] = useState('');
    const { csvData } = useContext(CSVContext) || { csvData: [] };
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 50;
    const dataToDisplay = csvData.data || [];
    const groupId = csvData.groupId || []; 

    console.log('Data received in ReviewFile:', csvData); // Debug

    // Fetch site URL when component loads
    useEffect(() => {
        const fetchApiUrl = async () => {
            const url = await window.api.invoke('get-api-url');
            console.log('Fetched API URL:', url); // Debug
            setSiteUrl(url);
        };

        fetchApiUrl();
    }, []);

    // Fetch group name using Group ID
    useEffect(() => {
        if (!siteUrl) return; // Wait until siteUrl is loaded

        const fetchGroupName = async () => {
            try {
                const response = await fetch(`${siteUrl}/uapi/v1/static-groups/computers/${groupId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log('Group name fetched:', result.name);
                    setGroupName(result.name || 'Unknown Group');
                } else {
                    setError('Failed to fetch group name.');
                }
            } catch (err) {
                console.error('Error fetching group name:', err);
                setError('Error fetching group name.');
            }
        };

        fetchGroupName();
    }, [groupId, siteUrl, token]);

    const handleSubmit = async () => {
        try {
            const payload = {
                serial_numbers: csvData.map((item) => item.serial_number),
            };
            const response = await fetch(`${siteUrl}/uapi/v1/static-groups/computers/${groupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                alert('Group updated successfully!');
                onSubmit();
            } else {
                setError('Failed to update the group.');
            }
        } catch (err) {
            console.error('Error submitting data:', err);
            setError('Error occurred while updating the group.');
        }
    };

    return (
        <div>
            <h2>Review Uploaded Data</h2>
            <p><strong>Group ID:</strong> {groupId}</p>
            <p><strong>Group Name:</strong> {groupName || 'Loading...'}</p>

            <div style={{ maxHeight: '400px', overflowY: 'scroll', margin: '20px 0', border: '1px solid #ccc', borderRadius: '5px' }}>
                {dataToDisplay.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f4f4f4' }}>
                                {Object.keys(dataToDisplay[0] || {}).map((key) => (
                                    <th key={key} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dataToDisplay.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, idx) => (
                                        <td key={idx} style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            {value || 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data to display. Please upload a valid CSV file.</p>
                )}
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleSubmit} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Submit
            </button>
            <button onClick={onBack} style={{ marginTop: '20px', marginLeft: '10px', padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Back
            </button>
        </div>
    );
};

export default ReviewFile;



// import React, { useEffect, useState, useContext } from 'react';
// import { CSVContext } from '../context/CSVContext';

// const ReviewFile = ({ siteUrl, token, onSubmit, onBack }) => {
//     const [groupName, setGroupName] = useState('');
//     const [error, setError] = useState('');
//     const { csvData } = useContext(CSVContext) || { csvData: [] }; // Ensure csvData is always an array
//     const [currentPage, setCurrentPage] = useState(1); // Current page in pagination
//     const recordsPerPage = 50; // Records per page
//     const dataToDisplay = csvData.data || [];
//     const groupId = csvData.groupId || []; 

//     console.log('Data received in ReviewFile:', csvData); // Debug
    

//     // Fetch group name using Group ID
//     useEffect(() => {
//         const fetchGroupName = async () => {
//             try {
//                 const response = await fetch(`${siteUrl}/uapi/v1/static-groups/computers/${groupId}`, {
//                     method: 'GET',
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         Accept: 'application/json',
//                     },
//                 });
//                 if (response.ok) {
//                     const result = await response.json();
//                     console.log('Group name fetched:', result.name); // Debug
//                     setGroupName(result.name || 'Unknown Group');
//                 } else {
//                     setError('Failed to fetch group name.', error); // Debug
//                 }
//             } catch (err) {
//                 console.error('Error fetching group name:', err);
//                 setError('Error fetching group name.');
//             }
//         };

//         fetchGroupName();
//     }, [groupId, siteUrl, token]);

//     const handleSubmit = async () => {
//         try {
//             const payload = {
//                 serial_numbers: csvData.map((item) => item.serial_number),
//             };
//             const response = await fetch(`${siteUrl}/uapi/v1/static-groups/computers/${groupId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify(payload),
//             });
//             if (response.ok) {
//                 alert('Group updated successfully!');
//                 onSubmit();
//             } else {
//                 setError('Failed to update the group.');
//             }
//         } catch (err) {
//             console.error('Error submitting data:', err);
//             setError('Error occurred while updating the group.');
//         }
//     };

//     // Calculate pagination details
//     // Ensure currentData only runs if csvData is a valid array
//     const totalPages = Math.ceil((Array.isArray(csvData) ? csvData.length : 0) / recordsPerPage);
//     const startIndex = (currentPage - 1) * recordsPerPage;
//     const endIndex = startIndex + recordsPerPage;
//     // const currentData = Array.isArray(csvData) ? csvData.slice(startIndex, endIndex) : [];
    

//     return (
//         <div>
//             <h2>Review Uploaded Data</h2>
//             <p><strong>Group ID:</strong> {groupId}</p>
//             <p><strong>Group Name:</strong> {groupName || 'Loading...'}</p>

// <div style={{ maxHeight: '400px', overflowY: 'scroll', margin: '20px 0', border: '1px solid #ccc', borderRadius: '5px' }}>
//     {dataToDisplay.length > 0 ? (
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//                 <tr style={{ backgroundColor: '#f4f4f4' }}>
//                     {Object.keys(dataToDisplay[0] || {}).map((key) => (
//                         <th key={key} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>
//                             {key}
//                         </th>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody>
//                 {dataToDisplay.map((row, index) => (
//                     <tr key={index}>
//                         {Object.values(row).map((value, idx) => (
//                             <td key={idx} style={{ padding: '10px', border: '1px solid #ddd' }}>
//                                 {value || 'N/A'}
//                             </td>
//                         ))}
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     ) : (
//         <p>No data to display. Please upload a valid CSV file.</p>
//     )}
// </div>

//             {/* Pagination Controls */}
//             <div style={{ margin: '20px 0', textAlign: 'center' }}>
//                 {currentPage > 1 && (
//                     <button
//                         onClick={() => setCurrentPage((prev) => prev - 1)}
//                         style={{
//                             marginRight: '10px',
//                             padding: '10px 15px',
//                             backgroundColor: '#007bff',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '5px',
//                             cursor: 'pointer',
//                         }}
//                     >
//                         Previous
//                     </button>
//                 )}
//                 <span style={{ margin: '0 10px' }}>
//                     Page {currentPage} of {totalPages}
//                 </span>
//                 {currentPage < totalPages && (
//                     <button
//                         onClick={() => setCurrentPage((prev) => prev + 1)}
//                         style={{
//                             marginLeft: '10px',
//                             padding: '10px 15px',
//                             backgroundColor: '#007bff',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '5px',
//                             cursor: 'pointer',
//                         }}
//                     >
//                         Next
//                     </button>
//                 )}
//             </div>

//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <button
//                 onClick={handleSubmit}
//                 style={{
//                     marginTop: '20px',
//                     padding: '10px 20px',
//                     backgroundColor: '#4caf50',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                 }}
//             >
//                 Submit
//             </button>
//             <button
//                 onClick={onBack}
//                 style={{
//                     marginTop: '20px',
//                     marginLeft: '10px',
//                     padding: '10px 20px',
//                     backgroundColor: '#f44336',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                 }}
//             >
//                 Back
//             </button>
//         </div>
//     );
// };

// export default ReviewFile;