const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // login: (credentials) => ipcRenderer.invoke('login', credentials),
    login: (credentials) => {
        console.log('Forwarding login request to backend:', credentials); // Debug
        return ipcRenderer.invoke('login', credentials);
    },
    invalidateToken: () => ipcRenderer.invoke('invalidate-token'),
    checkTokenExpiration: () => ipcRenderer.invoke('check-token-expiration'),
    checkSession: () => ipcRenderer.invoke('check-session'),
});