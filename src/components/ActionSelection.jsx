import React from 'react';
import '../styles/ActionSelection.css';

const ActionSelection = ({ onSelectAction, onBack }) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Select an Action</h2>
            <button onClick={() => onSelectAction('Upload')} style={{ marginLeft: '10px' }}>
                Upload a Group
            </button>
            {/* <button onClick={() => onSelectAction('Create')}>Create Group</button> */}
            <button onClick={onBack} style={{ marginTop: '20px' }}>Back</button>
        </div>
    );
};

export default ActionSelection;