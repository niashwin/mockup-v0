const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openMain: (mode) => ipcRenderer.send('open-main', mode),
  onSetMode: (cb) => {
    const handler = (_, mode) => cb?.(mode);
    ipcRenderer.on('set-mode', handler);
    return () => ipcRenderer.removeListener('set-mode', handler);
  },
  modeChanged: (mode) => ipcRenderer.send('mode-changed', mode),
  hideMain: () => ipcRenderer.send('hide-main'),
  commitMeeting: (payload) => ipcRenderer.send('commit-meeting', payload),
  onCommitMeeting: (cb) => {
    const handler = (_, payload) => cb?.(payload);
    ipcRenderer.on('commit-meeting', handler);
    return () => ipcRenderer.removeListener('commit-meeting', handler);
  },
});
