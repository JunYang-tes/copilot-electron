import React from 'react'
import { IResult } from "../../../types"
import { Component } from 'react'
export interface IProps {
  showNoResult: boolean
}
export class Empty extends Component<IProps, any> {

  render() {
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
  shouldComponentUpdate?(nextProps: Readonly<IProps>, nextState: Readonly<any>, nextContext: any) {
    console.log("should c update")
    return false;
  }
}