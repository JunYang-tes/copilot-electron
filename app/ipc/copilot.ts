import { RenderSideCaller } from "./render"

const callerProxy = new RenderSideCaller(
  "copilot", 1000 * 60)

export const CopilotProxy = {
  startUp() {
    return callerProxy.invoke("startUp")
  },
  handle(input: string): any {
    return callerProxy.invoke("handle", input)
  },
  run(idx: number) {
    return callerProxy.invoke("run", idx)
  }
}