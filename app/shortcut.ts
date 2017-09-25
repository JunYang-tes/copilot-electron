import { remote } from 'electron'
import { MainWinProxy } from './ipc/main-win-proxy'
import { LocalShortCut } from './ipc/local-shortcut'
const { globalShortcut } = remote
console.log("register shortcut")
globalShortcut.unregisterAll() //hot-load, refresh,unregister all old shortcuts
globalShortcut.register("alt+space", async () => {
  if (await MainWinProxy.isFocused()) {
    MainWinProxy.hide()
  } else {
    await MainWinProxy.active()
  }
})
