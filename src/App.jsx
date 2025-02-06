import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import GroupSelection from './components/GroupSelection.jsx';
import ActionSelection from './components/ActionSelection.jsx';
import FileUpload from './components/FileUpload.jsx';
import ReviewFile from './components/ReviewFile.jsx';
import { CSVProvider } from './context/CSVContext'; // Import the CSVProvider

function App() {
    const [token, setToken] = useState(null); // Store the token
    const [currentScreen, setCurrentScreen] = useState('login'); // Track the current screen
    const [siteUrl, setSiteUrl] = useState(''); // Store the site URL (Add this line)
    const [uploadedData, setUploadedData] = useState(null); // Store the uploaded CSV data
    const [groupId, setGroupId] = useState(''); // Store the Group ID
    const [error, setError] = useState(null);

    // const handleFileUpload = (data, groupId) => {
    //     console.log('CSV Data and Group ID received:', data, groupId);
    //     setUploadedData(data); // Save CSV data
    //     setGroupId(groupId); // Save Group ID
    //     setCurrentScreen('reviewFile'); // Navigate to ReviewFile
    // };

    // Check if the token is valid
    const isTokenValid = async () => {
        try {
            console.log('Calling window.api.checkSession'); // Debug
            const session = await window.api.checkSession();
            console.log('Token validation result:', session.valid); // Debug
            return session.valid;
        } catch (err) {
            console.error('Error checking token validity:', err); // Debug
            return false;
        }
    };

    // Handle navigation
    const handleNext = (nextScreen) => {
        setCurrentScreen(nextScreen);
    };

    const handleBack = (previousScreen) => {
        setCurrentScreen(previousScreen);
    };

    useEffect(() => {
        const checkToken = async () => {
            if (currentScreen !== 'login' && !(await isTokenValid())) {
                console.log('Token expired or invalid. Redirecting to login.');
                setCurrentScreen('login'); // Redirect to login if token is invalid
                setToken(null);
            }
        };
        checkToken();
    }, [currentScreen]);

    // Navigation
    const renderScreen = () => {
        switch (currentScreen) {
            case 'login':
                return (
                    <Login
                    onAuthenticated={({ token, siteUrl }) => {
                        setToken(token);
                        setSiteUrl(siteUrl);
                        setCurrentScreen('groupSelection');
                    }}
                />
            );
            case 'groupSelection':
                return (
                    <GroupSelection
                        onSelectGroup={() => handleNext('actionSelection')}
                        onBack={() => handleBack('login')}
                    />
                );
            case 'actionSelection':
                return (
                    <ActionSelection
                        onSelectAction={() => handleNext('fileUpload')}
                        onBack={() => handleBack('groupSelection')}
                    />
                );
            case 'fileUpload':
                return (
                    <FileUpload
                            onNext={() => setCurrentScreen('reviewFile')} // Pass onNext correctly
                            onBack={() => setCurrentScreen('actionSelection')}
                        />
                );
            case 'reviewFile':
                return (
                    <ReviewFile
                        data={uploadedData}
                        groupId={groupId}
                        siteUrl={siteUrl} // Pass siteUrl
                        token={token} // Pass token
                        onSubmit={() => {
                            alert('Submission complete!');
                        }}
                        onBack={() => setCurrentScreen('fileUpload')}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <CSVProvider>
            {renderScreen()} {/* Wrap the entire app */}
        </CSVProvider>
    );
}

export default App;