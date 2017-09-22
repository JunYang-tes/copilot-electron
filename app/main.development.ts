import { app, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './menu';
import * as ipc from "./ipc/main"
import * as copilot from "copilot-core"

let loaded = false
let mainWindow: any

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    center: true,
    // transparent: true,
    frame: false
  });

  ipc.register({
    active() {
      console.log("active")
      mainWindow.show()
      mainWindow.focus()
    }
  })

  let result: any[]

  ipc.register({
    async startUp() {
      console.log("startUp")
      if (!loaded) {
        console.log("run startup")
        await copilot.startUp()
        loaded = true
      }
    },
    async handle(cmd: string) {
      console.log("handle", cmd)
      result = await copilot.handle(cmd)
      return result
    },
    async run(idx: number) {
      if (idx >= 0 && idx < result.length) {
        await copilot.run(result[idx])
      } else {
        throw new Error("EOUTOFRANGE")
      }
    }
  }, "copilot")

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
