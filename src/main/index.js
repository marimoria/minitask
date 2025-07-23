import path from 'path';
import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { spawn } from 'child_process';

const isProd = app.isPackaged;

function startPythonServer() {
	const scriptPath = isProd
		? path.join(process.resourcesPath, 'backend/minitasks_server.exe')
		: path.join(process.cwd(), 'resources/backend/app.py');

	const python = isProd ? spawn(scriptPath) : spawn('python', [scriptPath]);

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
		alwaysOnTop: false,
		resizable: false,
		show: false,
		autoHideMenuBar: true,
		icon: path.join(__dirname, '../../resources/icon.ico'),
		webPreferences: {
			preload: path.join(__dirname, '../preload/index.js'),
			sandbox: false
		}
	});

	globalShortcut.register('Control+Shift+I', () => {
		const win = BrowserWindow.getAllWindows()[0];
		if (win) win.webContents.openDevTools({ mode: 'detach' });
	});

	// prod headers
	mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
		const devCSP =
			"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; connect-src 'self' http://127.0.0.1:5000 ws://localhost:*; img-src 'self' data:;";
		const prodCSP =
			"default-src 'self'; connect-src 'self' http://127.0.0.1:5000; img-src 'self' data:; script-src 'self';";

		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': [isProd ? prodCSP : devCSP]
			}
		});
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
