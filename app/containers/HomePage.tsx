import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'
import { IState } from "../reducers/app"
import { Home } from "../components/Home"

export const HomePage = connect(({ appReducer }: { appReducer: IState }) => ({
  type: appReducer.result.type,
  itemCount: appReducer.result.items.length
}))(
  Home
  ) as any
