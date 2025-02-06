const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    login: (credentials) => {
        // console.log('Forwarding login request to backend:', credentials); // Debug
        return ipcRenderer.invoke('login', credentials);
    },
    invalidateToken: () => ipcRenderer.invoke('invalidate-token'),
    checkTokenExpiration: () => ipcRenderer.invoke('check-token-expiration'),
    checkSession: () => ipcRenderer.invoke('check-session'),
    
    // Add the following functions to the exposed API without testing
    fetchGroups: () => ipcRenderer.invoke('fetch-groups'),
    fetchActions: (groupId) => ipcRenderer.invoke('fetch-actions', groupId),
    submitAction: (action) => ipcRenderer.invoke('submit-action', action),
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    invoke: (channel, data) => {
        return ipcRenderer.invoke(channel, data);
    },
});