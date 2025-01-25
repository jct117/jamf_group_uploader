import React, { useContext, useEffect, useState } from 'react';
import { CSVContext } from '../context/CSVContext';

const ReviewFile = ({ onSubmit, onBack }) => {
    const { csvData } = useContext(CSVContext); // Access CSV data and Group ID from context
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');

    // Fetch group name using Group ID
    useEffect(() => {
        const fetchGroupName = async () => {
            try {
                const response = await fetch(`https://your-jamf-instance/uapi/v1/static-groups/computers/${csvData.groupId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer YOUR_TOKEN_HERE`,
                        Accept: 'application/json',
                    },
                });
                if (response.ok) {
                    const result = await response.json();
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
    }, [csvData.groupId]);

    const handleSubmit = async () => {
        try {
            const payload = {
                serial_numbers: csvData.data.map((item) => item.serial_number),
            };
            const response = await fetch(`https://your-jamf-instance/uapi/v1/static-groups/computers/${csvData.groupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer YOUR_TOKEN_HERE`,
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
            <p>Group ID: {csvData.groupId}</p>
            <p>Group Name: {groupName}</p>
            {/* Add CSV Data Table */}
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

export default ReviewFile;