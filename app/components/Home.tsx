import { Component } from 'react';
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Input, List, Empty } from './connected'
import { UIFactory } from "./disp"
const styles = require("./Home.css")

export interface IProps {
  type: string,
  itemCount: number
}

export class Home extends Component<IProps, Object> {
  render() {
    let { type, itemCount } = this.props
    const UI = itemCount > 0 ? UIFactory(type) : Empty
    return (
      <div className="home">
        <div className={styles.container} data-tid="container">
          <div className={styles.input}>
            <Input />
          </div>
          <UI />
        </div>
      </div>
    )
  }
}
