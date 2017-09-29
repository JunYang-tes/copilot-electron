import { Component, ChangeEvent } from 'react'
import React from 'react'
import * as lodash from 'lodash'
const { throttle } = lodash

export const KeyCode = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ENTER: 13,
}
export interface IProps {
  throttle?: number,
  onChange?: (value: string) => void,
  onKeyUp?: (evt: IKeyEvent) => void,
  onEnterPress?: (evt: IKeyEvent) => void,
}
interface IState {

}

export interface IKeyEvent {
  alt: boolean,
  ctrl: boolean,
  meta: boolean,
  code: number,
  keyCode: number,
  char: string
}

export class Input extends Component<IProps, IState>{
  static defaultProps: IProps = {
    throttle: 100,
  }
  input:HTMLInputElement

  constructor(props: IProps) {
    super(props)
  }

  render() {
    return <input
      ref={input => this.input = input}
      autoFocus
      onKeyUp={(e) => this.onKeyUp({
        alt: e.altKey,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
        code: e.charCode,
        keyCode: e.keyCode,
        char: e.key
      })}
      onChange={(e) => this.onChange(e.target.value)}
    />
  }

  setFocus() {
    this.input.focus()
  }

  select(){
    this.input.select()
  }

  componentWillReceiveProps(nextProps: IProps) {
    let { throttle: wait } = nextProps
    this.onKeyUp = throttle(this.onKeyUp, wait)
    this.onChange = throttle(this.onChange, wait)
  }

  onKeyUp = (evt: IKeyEvent) => {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(evt)
    }
    if (evt.keyCode === KeyCode.ENTER) {
      this.props.onEnterPress && this.props.onEnterPress(evt)
    }
  }

  onChange = (value: string) => {
    const { onChange } = this.props
    if (onChange) {
      onChange(value)
    }
  }
}