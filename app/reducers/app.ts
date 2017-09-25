import { IResult } from "../types"
import { Action } from "redux"
import { RUN_START, RUN_END, RUN_ERR, CLEAN, START_UP_DONE } from "../actions/app"
export interface IState {
  running: boolean,
  shortcut: string,
  starting: boolean,
  path: string,
  clear: boolean,
  result: {
    type: string
    items: IResult[]
  },
  settings: {
    activeShortcut: string
  }
}

const initial: IState = {
  running: false,
  shortcut: 'Alt',
  starting: true,
  clear: true,
  path: '/',
  result: {
    type: "list",
    items: []
  },
  settings: {
    activeShortcut: "alt+space"
  }
}

const handlers = {
  [RUN_START](state: IState) {
    return {
      ...state,
      running: true
    }
  },
  [RUN_END](state: IState, { items }: any) {
    return {
      ...state,
      running: false,
      clear: false,
      result: {
        type: "list",
        items
      }
    }
  },
  [RUN_ERR](state: IState) {
    return {
      ...state,
      runing: true
    }
  },
  [START_UP_DONE](state: IState) {
    return {
      ...state,
      path: '/app',
      starting: false
    }
  },
  [CLEAN](state: IState) {
    return {
      ...state,
      result: {
        ...state.result,
        items: []
      },
      clear: true
    }
  }
}

export function appReducer(state = initial, action: Action & { data: any }) {
  if (action.type in handlers) {
    return handlers[action.type](state, action.data)
  } else {
    return state
  }
}