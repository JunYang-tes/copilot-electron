import React from 'react'
import { IResult } from "../../../types"
import { Component } from 'react'
export interface IProps {
  showNoResult: boolean
}
export class Empty extends Component<IProps, any> {

  render() {
    //TODO: UI beautify
    return (<div>
      {this.props.showNoResult ?
        <div>
          No result
        </div> : ""}
      <ul>
        <li>
          ctrl+backspace : Delete a word
        </li>
        <li>
          alt+[1-9] : Run item
        </li>
      </ul>
    </div>)
  }
  getPrefHeight() {
    return 0.4
  }
  shouldComponentUpdate?(nextProps: Readonly<IProps>, nextState: Readonly<any>, nextContext: any) {
    if (nextProps.showNoResult === this.props.showNoResult)
      return false;
    return true;
  }
}