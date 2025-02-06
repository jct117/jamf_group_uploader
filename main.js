const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // Load .env variables
let currentToken = null;
let apiUrl = null; // Store siteUrl

let mainWindow;
let sessionData = {
    token: null,
    expiration: null,
    loginTime: null,
    apiUrl: null,
};

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
});

// Fetch a new bearer token
const getBearerToken = async ({ siteUrl, username, password }) => {
    try {
        // Ensure the site URL has no trailing slash
        const apiUrl = siteUrl.trim().replace(/\/+$/, '');

        // Perform the API request to get the token
        const response = await axios.post(`${apiUrl}/api/v1/auth/token`, {}, {
            auth: { username, password },
        });

        // Extract token and expiration
        const token = response.data.token;
        const expiresIn = Math.floor(new Date(response.data.expires).getTime() / 1000);

        // Update session data
        sessionData = {
            token,
            expiration: expiresIn,
            loginTime: Date.now(),
            apiUrl,
        };

        return { success: true, token, expiresIn };
    } catch (error) {
        console.error('Login Error:', error.message);
        console.error('Error details:', error.response?.data || error); // Log additional error details if available
        return { success: false, error: 'Failed to authenticate. Please check your credentials or URL.' };
    }
};

// Check token expiration
const checkTokenExpiration = () => {
    const nowEpochUTC = Math.floor(new Date().getTime() / 1000);

    if (sessionData.expiration > nowEpochUTC) {
        console.log('Token is valid until:', sessionData.expiration);
        return { valid: true };
    } else {
        console.log('Token expired. Please fetch a new token.');
        return { valid: false, reason: 'Token expired. Please log in again.' };
    }
};

// Invalidate the current token
const invalidateToken = async () => {
    try {
        const response = await axios.post(`${sessionData.apiUrl}/api/v1/auth/invalidate-token`, {}, {
            headers: { Authorization: `Bearer ${sessionData.token}` },
        });

        if (response.status === 204) {
            console.log('Token successfully invalidated');
            sessionData = { token: null, expiration: null, loginTime: null };
            return { success: true };
        } else {
            console.error('Failed to invalidate token:', response.status);
            return { success: false, error: 'Failed to invalidate token.' };
        }
    } catch (error) {
        console.error('Error invalidating token:', error.message);
        return { success: false, error: error.message };
    }
};

// IPC handlers
ipcMain.handle('login', async (_, { siteUrl, username, password }) => {
    try {
        const response = await axios.post(`${siteUrl}/api/v1/auth/token`, {}, {
            auth: { username, password },
        });

        const token = response.data.token;
        const expiresIn = Math.floor(new Date(response.data.expires).getTime() / 1000);

        sessionData = {
            token,
            expiration: expiresIn,
            loginTime: Math.floor(new Date().getTime() / 1000),
            apiUrl: siteUrl, // Store the siteUrl here
        };

        console.log('Session data after login:', sessionData); // Debug
        return { success: true, token };
    } catch (error) {
        console.error('Error during login:', error.message); // Debug
        return { success: false, error: 'Failed to authenticate. Check your credentials or server URL.' };
    }
});

ipcMain.handle('check-session', () => {
    const nowEpochUTC = Math.floor(new Date().getTime() / 1000);

    console.log('Checking session:', { nowEpochUTC, sessionData }); // Debug

    if (sessionData.token && sessionData.expiration > nowEpochUTC) {
        console.log('Session is valid.'); // Debug
        return { valid: true };
    } else {
        console.log('Session is invalid or expired.'); // Debug
        return { valid: false };
    }
});

ipcMain.handle('get-api-url', async () => {
    console.log('Returning API URL:', sessionData.apiUrl); // Debug log
    return sessionData.apiUrl || ''; // Return stored siteUrl
});

ipcMain.handle('invalidate-token', async (_, apiUrl) => await invalidateToken(apiUrl));

// Capture the token and site URL from Login.jsx
ipcMain.on('save-token', (event, { token, siteUrl }) => {
    currentToken = token;
    apiUrl = siteUrl; // Save siteUrl globally
    console.log('Token and site URL saved:', { token, siteUrl }); // Debug log
});

ipcMain.handle('renew-token', async (_, { apiUrl }) => {
    if (!sessionData.token) {
        return { success: false, error: 'No active session. Please log in again.' };
    }

    const tokenCheck = checkTokenExpiration();
    if (!tokenCheck.valid) {
        console.log('Renewing token...');
        return await getBearerToken({ apiUrl, username: process.env.USERNAME, password: process.env.PASSWORD });
    } else {
        return { success: true, token: sessionData.token, expiresIn: sessionData.expiration };
    }
});

app.on('before-quit', async () => {
    await invalidateToken();
});