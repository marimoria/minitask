import path from 'path';
import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { spawn } from 'child_process';

function startPythonServer() {
	const isProd = app.isPackaged;
	const scriptPath = isProd
		? path.join(process.resourcesPath, 'backend/app.py')
		: path.join(process.cwd(), 'backend/app.py');

	const python = spawn('python', [scriptPath]);

	python.stdout.on('data', (data) => {
		console.log(`Python: ${data}`);
	});

	python.stderr.on('data', (data) => {
		console.error(`Python error: ${data}`);
	});

	python.on('close', (code) => {
		console.log(`Python exited with code ${code}`);
	});
}

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 670,
		alwaysOnTop: true,
		resizable: false,
		show: false,
		autoHideMenuBar: true,
		icon: path.join(__dirname, '../../resources/icon.ico'),
		webPreferences: {
			preload: path.join(__dirname, '../preload/index.js'),
			sandbox: false
		}
	});

	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: 'deny' };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
	} else {
		mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron');

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	// IPC test
	ipcMain.on('ping', () => console.log('pong'));

	startPythonServer();

	createWindow();

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
