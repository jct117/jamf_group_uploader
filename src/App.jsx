import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import GroupSelection from './components/GroupSelection.jsx';
import ActionSelection from './components/ActionSelection.jsx';
import FileUpload from './components/FileUpload.jsx';
import ReviewFile from './components/ReviewFile.jsx';

function App() {
    const [token, setToken] = useState(null); // Store the token
    const [currentScreen, setCurrentScreen] = useState('login'); // Track the current screen
    const [uploadedFile, setUploadedFile] = useState(null); // Store the uploaded file
    const [error, setError] = useState(null);

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

    // Handle file upload
    const handleFileUpload = (file) => {
        console.log('File received in App.jsx:', file); // Debug
        setUploadedFile(file); // Store the uploaded file
        setCurrentScreen('reviewFile'); // Navigate to ReviewFile
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

    // Render the appropriate screen
    const renderScreen = () => {
        switch (currentScreen) {
            case 'login':
                return (
                    <Login
                        onAuthenticated={(token) => {
                            console.log('Token received in App.jsx:', token); // Debug  
                            setToken(token);    
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
                        onUpload={handleFileUpload} // Pass the file upload handler
                        onBack={() => handleBack('actionSelection')}
                    />
                );
            case 'reviewFile':
                return (
                    <ReviewFile
                        file={uploadedFile} // Pass the uploaded file
                        onSubmit={() => {
                            console.log('Submission triggered with file:', uploadedFile); // Debug
                            alert('Submission complete!'); // Replace with actual submission logic
                        }}
                        onBack={() => handleBack('fileUpload')}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {renderScreen()}
        </div>
    );
}

export default App;