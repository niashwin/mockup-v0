const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  Notification,
  shell,
} = require("electron");
const { exec } = require("child_process");
const path = require("path");

let mainWindow;
let pillWindow;

const MAIN_SIZES = {
  expanded: { width: 1440, height: 900 },
  compact: { width: 520, height: 720 },
};

const getUrlWithParams = (baseUrl, params) => {
  const query = new URLSearchParams(params).toString();
  return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${query}`;
};

const applyMainSize = (mode) => {
  if (!mainWindow) return;
  const size = MAIN_SIZES[mode] || MAIN_SIZES.expanded;
  const [currentWidth, currentHeight] = mainWindow.getSize();
  if (currentWidth !== size.width || currentHeight !== size.height) {
    mainWindow.setSize(size.width, size.height, true);
    mainWindow.center();
  }
  mainWindow.setResizable(mode !== "compact");
};

const createMainWindow = (baseUrl, isDev) => {
  mainWindow = new BrowserWindow({
    width: MAIN_SIZES.expanded.width,
    height: MAIN_SIZES.expanded.height,
    show: false,
    backgroundColor: "#0b0b0b",
    title: "Sentra Organizational Memory System",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  const mainUrl = getUrlWithParams(baseUrl, { mode: "expanded" });
  if (isDev) {
    mainWindow.loadURL(mainUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadURL(mainUrl);
  }

  mainWindow.on("close", (e) => {
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
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  pillWindow.setAlwaysOnTop(true, "floating");
  pillWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  pillWindow.setHasShadow(false);

  const pillUrl = getUrlWithParams(baseUrl, { mode: "pill", overlay: "1" });
  if (isDev) {
    pillWindow.loadURL(pillUrl);
  } else {
    pillWindow.loadURL(pillUrl);
  }
};

app.whenReady().then(() => {
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  const isDev = Boolean(devServerUrl);
  const baseUrl =
    devServerUrl ||
    `file://${path.join(__dirname, "..", "build", "index.html")}`;

  createMainWindow(baseUrl, isDev);
  createPillWindow(baseUrl, isDev);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(baseUrl, isDev);
      createPillWindow(baseUrl, isDev);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("open-main", (_, mode) => {
  if (!mainWindow) return;
  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }
  const nextMode = mode || "expanded";
  applyMainSize(nextMode);
  mainWindow.webContents.send("set-mode", nextMode);
  mainWindow.focus();
});

ipcMain.on("mode-changed", (_, mode) => {
  if (!mode) return;
  applyMainSize(mode);
});

ipcMain.on("hide-main", () => {
  if (!mainWindow) return;
  mainWindow.hide();
});

ipcMain.on("commit-meeting", (_, payload) => {
  if (!mainWindow) return;
  mainWindow.webContents.send("commit-meeting", payload);
});

/**
 * Sound mapping - maps semantic sound IDs to macOS system sounds
 * These sounds provide audio feedback for user actions (Principle 7 & 10)
 */
const SOUND_MAP = {
  // Completion sounds
  complete: "Glass", // Subtle, satisfying completion
  celebrate: "Hero", // Celebratory for streaks/milestones
  success: "Blow", // Quick success acknowledgment

  // Action sounds
  snooze: "Submarine", // Soft, indicates deferral
  delegate: "Morse", // Indicates handoff

  // Alert sounds
  warning: "Basso", // Low tone for warnings
  error: "Sosumi", // Error indication

  // Interaction sounds
  tap: "Tink", // Light tap feedback
  pop: "Pop", // UI pop/appear
};

/**
 * Haptic feedback handler
 * On macOS, we use system sounds as haptic-like feedback since
 * true haptics require Force Touch trackpad and native modules.
 *
 * The audio cues serve as "audio haptics" - short, subtle sounds
 * that acknowledge user actions (Principle 7: Reward bias toward action)
 */
ipcMain.on("trigger-haptic", (event, type) => {
  if (process.platform !== "darwin") return;

  // Map haptic types to appropriate sounds
  const hapticSoundMap = {
    light: "Tink",
    medium: "Pop",
    heavy: "Blow",
    success: "Glass",
    warning: "Basso",
    error: "Sosumi",
  };

  const soundName = hapticSoundMap[type] || "Tink";
  const soundPath = `/System/Library/Sounds/${soundName}.aiff`;

  // Play at reduced volume for subtle haptic-like feedback
  exec(`afplay "${soundPath}" -v 0.3`, (err) => {
    if (err) {
      // Fallback to system beep if sound file not found
      shell.beep();
    }
  });
});

/**
 * Sound feedback handler
 * Plays macOS system sounds for various app events
 *
 * Implements Principle 10: "Haptic/sound on completion"
 * Implements Principle 7: "Reward bias toward action"
 */
ipcMain.on("play-sound", (event, soundId) => {
  if (process.platform !== "darwin") {
    // Fallback for non-macOS: use system beep
    shell.beep();
    return;
  }

  const soundName = SOUND_MAP[soundId] || SOUND_MAP.tap;
  const soundPath = `/System/Library/Sounds/${soundName}.aiff`;

  // Full volume for intentional sound feedback
  exec(`afplay "${soundPath}"`, (err) => {
    if (err) {
      // Fallback to system beep
      shell.beep();
    }
  });
});

// Desktop notification handler
ipcMain.on("show-notification", (event, { title, body }) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: title || "Sentra",
      body: body || "",
    });
    notification.show();
  }
});
