import React from 'react';
import '../styles/GroupSelection.css';

const GroupSelection = ({ onSelectGroup, onBack }) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Select Group Type</h2>
            <button onClick={() => onSelectGroup('Computer')}>Upload a Computer Group</button>
            {/* <button onClick={() => onSelectGroup('User')} style={{ marginLeft: '10px' }}>
                User Groups
            </button> */}
            <button onClick={onBack} style={{ marginTop: '20px' }}>Back</button>
        </div>
    );
};

export default GroupSelection;