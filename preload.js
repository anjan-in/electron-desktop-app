const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // openFile: () => ipcRenderer.invoke('open-file'),
    // saveFile: (content) => ipcRenderer.invoke('save-file', content)

    saveNote: (content) => ipcRenderer.invoke('save-note', content),
    getNotes: () => ipcRenderer.invoke('get-notes'),

    toggleAutoLaunch: (enable) => ipcRenderer.invoke('toggle-auto-launch', enable),

    onUpdateAvailable: (callback) => ipcRenderer.on("update-available", callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on("update-downloaded", callback),
});
