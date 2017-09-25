import { remote } from 'electron'
import { CallerProxy, EventEmitterWrapper } from "./proxy"
import { EventEmitter } from "events"
const { ipcMain } = remote
const callerProxy = new CallerProxy(new EventEmitterWrapper(ipcMain),
  "shortcut", 1000)

export const LocalShortCut = {
  register(accelerator: string, cb: () => void) {
    return callerProxy.invoke("register", accelerator, cb)
  },
  unregister(accelerator: string) {
    return callerProxy.invoke("unregister", accelerator)
  },
  unregisterAll() {
    return callerProxy.invoke("unregisterAll")
  }
}
console.log("unregisterAll")
//hot-load, refresh,unregister all old shortcuts
LocalShortCut.unregisterAll()