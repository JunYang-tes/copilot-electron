import React from 'react'
import { IResult } from "../../../types"
import { Component } from 'react'

const styles = require("./style.css")
export interface IProps {
  showNoResult: boolean
}
const texts = [
  ["Ctrl + Backspace", "Delete a word"],
  ["Alt + Space", "Active window"],
  ["Alt + [1-9]", "Run item"],
]


export class Empty extends Component<IProps, any> {

  render() {
    //TODO: UI beautify
    return (<div className={styles.empty}>
      <div className={styles.noResult}>
        {this.props.showNoResult ?
          "No result"
          : " "}
      </div>
      <ul>
        {
          texts.map((text, idx) =>
            <li className={styles.text} key={idx}>
              <span className={styles.left}>{text[0]}</span>
              <span className={styles.right}>{text[1]}</span>
            </li>)
        }
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