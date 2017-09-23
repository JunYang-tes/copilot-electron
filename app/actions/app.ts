import { Dispatch, Action } from "redux"
import { CopilotProxy } from "../ipc/copilot"


export const RUN_START = 'RUN_START'
export const RUN_END = "RUN_END"
export const RUN_ERR = "RUN_ERR"
export const START_UP_DONE = "START_UP_DONE"
export const CLEAN = "CLEARN"

export function startUp() {
  return async (dispatch: Dispatch<Action>) => {
    let error
    try {
      await CopilotProxy.startUp()
    } catch (e) {
      error = e
    }
    dispatch({
      type: START_UP_DONE,
      data: {
        error
      }
    })
  }
}
export function run(idx: number) {
  return async (dispatch: Dispatch<Action>) => {
    await CopilotProxy.run(idx)
  }
}

export function handle(input: string) {
  if (!input.length) {
    return {
      type: CLEAN
    }
  }
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: RUN_START
    })
    try {
      const items = await CopilotProxy.handle(input)
      dispatch({
        type: RUN_END,
        data: {
          items
        }
      })
    } catch (e) {
      dispatch({
        type: RUN_ERR,
        data: {
          error: e
        }
      })
    }
  }
}