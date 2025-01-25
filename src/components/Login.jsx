import React, { useState } from 'react';
import '../styles/Login.css'; // Import the CSS file for styling

const Login = ({ onAuthenticated }) => {
    const [siteUrl, setSiteUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const fetchToken = async () => {
        try {
            console.log('Fetching token with credentials:', { siteUrl, username, password }); // Debug
    
            const response = await window.api.login({
                siteUrl,
                username: username.trim(),
                password,
            });
    
            if (response.success) {
                const { token } = response;
                console.log('Token fetched successfully:', token); // Debug
                onAuthenticated(token); // Pass token to App.jsx
                setError(''); // Clear errors
            } else {
                console.error('Login failed with error:', response.error); // Debug
                setError(response.error || 'Login failed.');
            }
        } catch (err) {
            console.error('Error fetching token:', err); // Debug
            setError('An error occurred during login.');
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form from refreshing the page
        console.log('Login form submitted.'); // Debug
    
        if (!siteUrl || !username || !password) {
            setError('All fields are required.');
            return;
        }
    
        fetchToken(); // Trigger token fetching
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>JAMF Uploader</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="siteUrl">Site URL</label>
                        <input
                            type="text"
                            id="siteUrl"
                            placeholder="https://jamfcloud.com"
                            value={siteUrl}
                            onChange={(e) => setSiteUrl(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;