const os = require('os');
const path = require('path');
const { ipcRenderer } = require('electron');
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('os', {
    homedir: () => os.homedir(),
})

contextBridge.exposeInMainWorld('path', {
    join: (...args) => path.join(...args),
})

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (...args) => ipcRenderer.send(...args),
    on: (...args) => ipcRenderer.on(...args),
})