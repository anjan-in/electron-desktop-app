const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const db = require('./database');
const path = require('path');

const AutoLaunch = require('auto-launch');
const { autoUpdater } = require("electron-updater");
const settings = require('electron-settings');
const { Tray, Menu } = require('electron');

let tray;
let mainWindow;

const appAutoLauncher = new AutoLaunch({
    name: "Electron App",
    path: app.getPath("exe"),
});

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Securely load preload.js
            // nodeIntegration: false,
            contextIsolation: true
        }
    });

    tray = new Tray('icon.png'); // Replace with a valid icon path
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show', click: () => mainWindow.show() },
        { label: 'Exit', click: () => app.quit() }
    ]);
    tray.setToolTip('Electron App');
    tray.setContextMenu(contextMenu);

    mainWindow.loadFile('index.html');
    autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.handle('open-file', async () => {
    const { filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] });
    if (filePaths.length > 0) {
        return fs.readFileSync(filePaths[0], 'utf8');
    }
    return null;
});

ipcMain.handle('save-file', async (_, content) => {
    const { filePath } = await dialog.showSaveDialog();
    if (filePath) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
});

ipcMain.handle('save-note', async (_, content) => {
    const stmt = db.prepare('INSERT INTO notes (content) VALUES (?)');
    stmt.run(content);
    return true;
});

ipcMain.handle('get-notes', async () => {
    const stmt = db.prepare('SELECT * FROM notes');
    return stmt.all();
});

ipcMain.handle("toggle-auto-launch", async (_, enable) => {
    if (enable) {
        await appAutoLauncher.enable();
    } else {
        await appAutoLauncher.disable();
    }
    settings.set("autoLaunch", enable);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
