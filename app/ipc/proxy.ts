import { EventEmitter } from 'events'
import * as util from 'util'
export interface ICallArgs {
  id: number,
  namespace: string,
  method: string,
  args: any[],
}
export interface ICallResult {
  id: number,
  error?: Error,
  result?: any,
}
export interface ICallParam {
  /**
   * How long to wait
   */
  timeout?: number,
  method: string,
  args: any[],
}
export interface IServices {
  [namespace: string]: {
    [method: string]: Function
  }
}
export interface ISender extends EventEmitter {
  send: (channel: string, ...args: any[]) => any
}

interface Event {
  sender: ISender
}

export class CalleeProxy {
  private services: IServices
  constructor(emitter: EventEmitter, services?: IServices) {
    this.services = services || {}
    emitter.on('call', async (evt: Event, args: ICallArgs) => {
      const ser = this.services[args.namespace]
      if (!ser) {
        evt.sender.send("result", {
          id: args.id,
          error: new Error("ENONS")
        })
        return
      }
      const fn = ser[args.method] as Function
      if (util.isFunction(fn)) {
        try {
          const ret = await fn(...args.args)
          evt.sender.send('result', {
            id: args.id,
            result: ret
          })
        } catch (e) {
          evt.sender.send('result', {
            id: args.id,
            error: e
          })
        }
      } else {
        evt.sender.send('result', {
          id: args.id,
          error: new Error('ENOMETHOD')
        })
      }
    })
  }
  public register(namespace: string, services: any) {
    if (namespace in this.services) {
      this.services[namespace] = {
        ...this.services[namespace],
        ...services
      }
    } else {
      this.services[namespace] = services
    }
  }
}


export class CallerProxy {
  private remoteEmitter: ISender
  private namespace: string
  private callId: number
  private callQueue: {
    [id: number]: {
      res: (...args: any[]) => void,
      rej: (err: Error) => void,
      timer: any
    }
  }
  private timeout: number

  constructor(
    remoteEmitter: ISender,
    namespace = "main",
    timeout?: number) {
    this.callId = 0
    this.remoteEmitter = remoteEmitter
    this.namespace = namespace
    this.timeout = timeout || 1000
    this.callQueue = {}

    remoteEmitter.on('result', (evt: Event, ret: ICallResult) => {
      const id = ret.id
      if (id in this.callQueue) {
        const handler = this.callQueue[id]
        clearTimeout(handler.timer)
        if (ret.error) {
          handler.rej(ret.error)
        } else {
          handler.res(ret.result)
        }
        delete this.callQueue[id]
      }
    })
  }
  public call<T>(param: ICallParam): Promise<T> {
    const id = this.callId++
    return new Promise<T>((res, rej) => {
      const timeout = setTimeout(() => {
        const handler = this.callQueue[id]
        delete this.callQueue[id]
        handler.rej(new Error('ETIMEOUT'))
      }, param.timeout || this.timeout)
      this.callQueue[id] = {
        res,
        rej,
        timer: timeout
      }
      this.remoteEmitter.send('call', {
        namespace: this.namespace,
        method: param.method,
        id,
        args: param.args
      })
    })
  }

  public invoke<T>(name: string, ...args: any[]) {
    return this.call<T>({
      method: name,
      args
    })
  }
}
