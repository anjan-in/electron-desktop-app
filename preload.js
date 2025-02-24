const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    appName: 'Electron Desktop App'
});
