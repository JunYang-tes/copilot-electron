import { app, BrowserWindow, ipcMain, screen, globalShortcut } from 'electron';
import MenuBuilder from './menu';
import * as ipc from "./ipc/main"
import * as copilot from "copilot-core"
const localShortcut = require("electron-localshortcut")

let loaded = false
let mainWindow: Electron.BrowserWindow

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

  //It's seems no way to get the display which holds mainWindow
  let display = screen.getPrimaryDisplay()
  let minHeight = 48 + 24 * 2
  let winHeight = .65 * display.size.height
  let winWidth = .50 * display.size.width

  mainWindow = new BrowserWindow({
    show: false,
    width: winWidth,
    height: winHeight,
    center: true,
    // transparent: true,
    frame: false
  });

  let { x, y } = mainWindow.getBounds()

  ipc.register({
    register(accelerator: string, cb: () => any) {
      console.log("register")
      localShortcut.register(accelerator, () => {
        cb()
      })
      return "@register"
    },
    unregisterAll() {
      console.log("@unregisterAll")
      localShortcut.unregisterAll()
      return "@unregisterAll"
    },
    unregister(accelerator: string) {
      localShortcut.unregister(accelerator)
    }
  }, "shortcut")

  ipc.register({
    active() {
      console.log("active")
      mainWindow.show()
      mainWindow.focus()
    },
    hide() {
      mainWindow.hide()
    },
    isFocused() {
      return mainWindow.isFocused()
    },
    setHeight(height: number | ("maximum" | "fullscreen" | "normal")) {
      console.log("setHeight", height)
      if (typeof height === "number") {
        let bound = mainWindow.getBounds()
        if (height < 1) {
          height = height * display.size.height
        } else {
          height += minHeight
        }
        if (height < 50) {
          return;
        }
        if (height > winHeight) {
          height = winHeight
        }
        bound.width = winWidth
        bound.height = height
        // bound.x = x;
        // bound.y = y;
        mainWindow.setFullScreen(false)
        mainWindow.setBounds(bound)
      } else {
        switch (height) {
          case "maximum":
            mainWindow.maximize()
            break;
          case "fullscreen":
            mainWindow.setFullScreen(true)
            break;
          case "normal":
            mainWindow.unmaximize()
            break;
          default:
            console.log("Unexpected height:", height)
            break;
        }
      }
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

  mainWindow.webContents.on('will-prevent-unload', (event) => {
    console.log("unregister all")
    globalShortcut.unregisterAll()
  })

  mainWindow.on('closed', () => {
    // mainWindow = null;
  });
});
