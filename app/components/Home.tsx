import { Component } from 'react';
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Input, List, Empty } from './connected'
import { UIFactory, Display } from "./disp"
const styles = require("./Home.css")

export interface IProps {
  type: string,
  itemCount: number,
  onHeightChanged?: (height: number | string) => void
}

export class Home extends Component<IProps, Object> {
  height: number | string
  ele: Display
  render() {
    console.log("render")
    let { type, itemCount } = this.props
    const UI = itemCount > 0 ? UIFactory(type) : Empty
    return (
      <div className="home">
        <div className={styles.container} data-tid="container">
          <div className={styles.input}>
            <Input />
          </div>
          <Display ref={ui => this.ele = ui} component={UI} />
        </div>
      </div>
    )
  }
  setHeight() {
    let height = this.ele.getPrefHeight()
    console.log("setHeight", height)
    if (height != this.height) {
      this.height = height
      this.props.onHeightChanged && this.props.onHeightChanged(height)
    }
  }
  componentDidMount() {
    setTimeout(() => {
      //wait style working
      this.setHeight()
    }, 0)
  }
  componentDidUpdate(prevProps: IProps, prevState: any) {
    this.setHeight()
  }
}
