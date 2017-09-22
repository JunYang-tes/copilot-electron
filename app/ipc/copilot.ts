import { remote } from 'electron'
const { ipcMain } = remote
import { CallerProxy } from "./proxy"

const callerProxy = new CallerProxy(ipcMain,
  "copilot", 1000 * 60)

export class CopilotProxy {
  constructor() {

  }
  startUp() {
    return callerProxy.invoke("startUp")
  }
  handle(input: string): any {
    return callerProxy.invoke("handle", input)
  }
  run(idx: number) {
    return callerProxy.invoke("run", idx)
  }
}