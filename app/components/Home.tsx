import { Component } from 'react';
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Input, List, Empty } from './connected'
import { UIFactory, Display } from "./disp"
import { remote } from 'electron'

const styles = require("./Home.css")

export interface IProps {
  type: string,
  itemCount: number,
  onHeightChanged?: (height: number | string) => void
}

export class Home extends Component<IProps, Object> {
  height: number | string
  ele: Display
  input: any
  render() {
    let { type, itemCount } = this.props
    const UI = itemCount > 0 ? UIFactory(type) : Empty
    return (
      <div className="home">
        <div className={styles.container} data-tid="container">
          <div className={styles.input}>
            <Input ref={(input) => this.input = input} />
          </div>
          <Display ref={ui => this.ele = ui} component={UI} />
        </div>
      </div>
    )
  }
  setHeight() {
    let height = this.ele.getPrefHeight()
    if (height != this.height) {
      this.height = height
      this.props.onHeightChanged && this.props.onHeightChanged(height)
    }
  }
  onWinFocus = () => {
    console.log("focused")
    this.input.getWrappedInstance().setFocus()
  }
  componentDidMount() {
    remote.getCurrentWindow()
      .on("focus", this.onWinFocus)
    setTimeout(() => {
      //wait style working
      this.setHeight()
    }, 0)
  }
  componentDidUpdate(prevProps: IProps, prevState: any) {
    this.setHeight()
  }
  componentWillUnmount() {
    remote.getCurrentWindow().removeListener("focus", this.onWinFocus)
  }
}
