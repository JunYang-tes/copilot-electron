import { RenderSideCaller } from "./render"

const callerProxy = new RenderSideCaller(
  "main", 1000 * 60)

export const MainWinProxy = {
  active() {
    console.log("call active @main_process")
    return callerProxy.invoke("active")
  },
  isFocused() {
    return callerProxy.invoke("isFocused")
  },
  setHeight(height: number | string) {
    return callerProxy.invoke("setHeight", height)
  },
  hide() {
    console.log("hide")
    return callerProxy.invoke("hide")
  }
}