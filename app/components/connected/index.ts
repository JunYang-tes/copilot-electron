import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'
import { handle, run } from "../../actions/app"
import { IState } from "../../reducers/app"

type state2props = {
  appReducer: IState
}
const opt = { withRef: true }

export const Input = connect(null, (dispatch: Dispatch<Action>, props) => ({
  onChange: (value: string) => dispatch(handle(value) as Action),
  onEnterPress: (_: any) => dispatch(run(0))
}), null, opt)(require("../input").Input)

export const List = connect(({ appReducer }: { appReducer: IState }) => {
  return { data: appReducer.result.items }
}, (dispatch: Dispatch<Action>, props) => ({
  onClick: (index: number) => dispatch(run(index))
}), null, opt)(require("../disp/list").List)

export const Empty = connect(({ appReducer }: state2props) => ({
  showNoResult: !appReducer.clear
}), null, null, opt)(require("../disp/empty").Empty)