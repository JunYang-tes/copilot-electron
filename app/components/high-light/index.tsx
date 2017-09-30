import { PureComponent, ChangeEvent } from 'react'
import React from 'react'
const styles = require("./style.css")
export interface IProp {

}
export class HightLight extends PureComponent<IProp, any> {
  render() {
    let text = ""
    if (typeof this.props.children === "string") {
      text = this.props.children
    }
    return (<span>
      {
        this.parse(text)
      }
    </span>)
  }
  parse(text: string) {
    console.log(text)
    let state = 0
    let NORMAL = 1
    let HIGH_LIGHT = 2
    let buff = []
    let ret = []
    let key = 0
    for (let i = 0; i < text.length; i++) {
      let ch = text.charAt(i)
      switch (state) {
        case 0:
          if (ch === "`") {
            state = HIGH_LIGHT
          } else {
            state = NORMAL
            buff.push(ch)
          }
          break;
        case NORMAL:
          if (ch === "`") {
            state = HIGH_LIGHT
            if (buff.length) {
              ret.push(<span key={key++} className={"normal " + styles.normal}>{buff.join("")}</span>)
              buff = []
            }
          } else {
            buff.push(ch)
          }

          break;
        case HIGH_LIGHT:
          if (ch === "`") {
            state = NORMAL
            if (buff.length) {
              ret.push(<span key={key++} className={"highlight " + styles.highlight}>{buff.join("")}</span>)
              buff = []
            }
          } else {
            buff.push(ch)
          }
          break;
      }
    }
    if (buff.length) {
      switch (state) {
        case NORMAL:
          ret.push(<span key={key++} className={"normal " + styles.normal}>{buff.join("")}</span>)
          break;

        case HIGH_LIGHT:
          ret.push(<span key={key++} className={"highlight " + styles.highlight} >{buff.join("")}</span>)
          break;
      }
    }
    return ret
  }
}