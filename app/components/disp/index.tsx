import { ComponentClass, Component } from 'react'
import React from 'react'
import {
  List
} from '../connected'

const styles = require("./style.css")

const UIs: { [name: string]: ComponentClass<{}> } = {
  list: List
}
interface props {
  component: ComponentClass<any>
}
export class Display extends Component<props, any>{
  ele: HTMLElement
  child: ComponentClass<any>
  render() {
    let Comp = this.props.component
    return (<div className={styles.scrollable}>
      <div ref={ele => this.ele = ele}>
        <Comp ref={(ele: any) => this.child = ele} />
      </div>
    </div>)
  }
  getPrefHeight(): number | ("maximum" | "fullscreen" | "normal") {
    let component: any = this.child
    if ("getWrappedInstance" in component) {
      component = component.getWrappedInstance()
    }
    if (component && "getPrefHeight" in component) {
      return component.getPrefHeight()
    }
    return this.ele.clientHeight
  }
}

export function UIFactory(type: string): ComponentClass<{}> {
  if (type in UIs) {
    return UIs[type]
  } else {
    return List
  }
}