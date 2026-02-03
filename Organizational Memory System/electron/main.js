const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let pillWindow;

const MAIN_SIZES = {
  expanded: { width: 1440, height: 900 },
  compact: { width: 520, height: 720 },
};

const getUrlWithParams = (baseUrl, params) => {
  const query = new URLSearchParams(params).toString();
  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${query}`;
};

const applyMainSize = (mode) => {
  if (!mainWindow) return;
  const size = MAIN_SIZES[mode] || MAIN_SIZES.expanded;
  const [currentWidth, currentHeight] = mainWindow.getSize();
  if (currentWidth !== size.width || currentHeight !== size.height) {
    mainWindow.setSize(size.width, size.height, true);
    mainWindow.center();
  }
  mainWindow.setResizable(mode !== 'compact');
};

const createMainWindow = (baseUrl, isDev) => {
  mainWindow = new BrowserWindow({
    width: MAIN_SIZES.expanded.width,
    height: MAIN_SIZES.expanded.height,
    show: false,
    backgroundColor: '#0b0b0b',
    title: 'Sentra Organizational Memory System',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  const mainUrl = getUrlWithParams(baseUrl, { mode: 'expanded' });
  if (isDev) {
    mainWindow.loadURL(mainUrl);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadURL(mainUrl);
  }

  mainWindow.on('close', (e) => {
    if (app.isQuitting) return;
    e.preventDefault();
    mainWindow.hide();
  });
};

const createPillWindow = (baseUrl, isDev) => {
  const { workArea } = screen.getPrimaryDisplay();
  const width = 280;
  const height = 360;
  const x = Math.round(workArea.x + workArea.width - width - 16);
  const y = Math.round(workArea.y + (workArea.height - height) / 2);

  pillWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  pillWindow.setAlwaysOnTop(true, 'floating');
  pillWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  pillWindow.setHasShadow(false);

  const pillUrl = getUrlWithParams(baseUrl, { mode: 'pill', overlay: '1' });
  if (isDev) {
    pillWindow.loadURL(pillUrl);
  } else {
    pillWindow.loadURL(pillUrl);
  }
};

app.whenReady().then(() => {
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  const isDev = Boolean(devServerUrl);
  const baseUrl = devServerUrl || `file://${path.join(__dirname, '..', 'build', 'index.html')}`;

  createMainWindow(baseUrl, isDev);
  createPillWindow(baseUrl, isDev);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(baseUrl, isDev);
      createPillWindow(baseUrl, isDev);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('open-main', (_, mode) => {
  if (!mainWindow) return;
  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }
  const nextMode = mode || 'expanded';
  applyMainSize(nextMode);
  mainWindow.webContents.send('set-mode', nextMode);
  mainWindow.focus();
});

ipcMain.on('mode-changed', (_, mode) => {
  if (!mode) return;
  applyMainSize(mode);
});

ipcMain.on('hide-main', () => {
  if (!mainWindow) return;
  mainWindow.hide();
});

ipcMain.on('commit-meeting', (_, payload) => {
  if (!mainWindow) return;
  mainWindow.webContents.send('commit-meeting', payload);
});
