import { ComponentClass } from 'react'
import {
  List
} from '../connected'
const UIs: { [name: string]: ComponentClass<{}> } = {
  list: List
}
export function UIFactory(type: string): ComponentClass<{}> {
  if (type in UIs) {
    return UIs[type]
  } else {
    return List
  }
}