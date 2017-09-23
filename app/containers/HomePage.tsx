import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'
import { IState } from "../reducers/app"
import { Home } from "../components/Home"
import { IPCProxy } from "../ipc/render"

const ipcProxy = new IPCProxy()

export const HomePage = connect(({ appReducer }: { appReducer: IState }) => ({
  type: appReducer.result.type,
  itemCount: appReducer.result.items.length
}), () => ({
  onHeightChanged: (height: number | string) => ipcProxy.setHeight(height)
}))(
  Home as any
  ) as any
