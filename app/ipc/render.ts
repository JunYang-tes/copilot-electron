import { remote, ipcRenderer } from 'electron'
const { ipcMain } = remote
import { CallerProxy } from "./proxy"

export class RenderSideCaller extends CallerProxy {
  constructor(namespace = "main", timeout?: number) {
    super(ipcRenderer, namespace, timeout)
  }
}


const callerProxy = new RenderSideCaller()

export class IPCProxy {
  constructor() {

  }
  active() {
    console.log("call active @main_process")
    return callerProxy.invoke("active")
  }
  setHeight(height: number | string) {
    return callerProxy.invoke("setHeight", height)
  }
}