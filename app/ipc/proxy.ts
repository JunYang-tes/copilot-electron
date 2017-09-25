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
  private static callId = 0
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
    const id = CallerProxy.callId++
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
/**
 * In order to delegate a render callback to main.
 * Use a wrapped event emitter (such as new EventEmitterWrapper(ipcMain)), CallerProxy 
 * and CalleeProxy to implementscall proxy 
 * 
 * Example: local-shortcut.ts
 * 
 */
export class EventEmitterWrapper implements ISender {
  private emitter: EventEmitter
  constructor(emitter: EventEmitter) {
    this.emitter = emitter
  }
  send(channel: string, ...args: any[]) {
    let sender = this
    //This not work.
    // this.emitter.emit(channel, { sender }, ...args)
    this.emitter.emit(channel, {
      sender: {
        send(channel: string, ...arg: any[]) {
          sender.send(channel, ...arg)
        }
      }
    }, ...args)
  }
  //delegate to this.emitter
  addListener(event: string | symbol, listener: Function): this {
    throw new Error("Method not implemented.");
  }
  on(event: string | symbol, listener: Function): this {
    throw new Error("Method not implemented.");
  }
  once(event: string | symbol, listener: Function): this {
    throw new Error("Method not implemented.");
  }
  prependListener(event: string | symbol, listener: Function): this {
    throw new Error("Method not implemented.");
  }
  prependOnceListener(event: string | symbol, listener: Function): this {
    throw new Error("Method not implemented.");
  }
  removeListener(event: string | symbol, listener: Function): this {
    throw new Error("Method not implemented.");
  }
  removeAllListeners(event?: string | symbol | undefined): this {
    throw new Error("Method not implemented.");
  }
  setMaxListeners(n: number): this {
    throw new Error("Method not implemented.");
  }
  getMaxListeners(): number {
    throw new Error("Method not implemented.");
  }
  listeners(event: string | symbol): Function[] {
    throw new Error("Method not implemented.");
  }
  emit(event: string | symbol, ...args: any[]): boolean {
    throw new Error("Method not implemented.");
  }
  eventNames(): (string | symbol)[] {
    throw new Error("Method not implemented.");
  }
  listenerCount(type: string | symbol): number {
    throw new Error("Method not implemented.");
  }
}
//delegate to EventEmitter's method
Object.keys(EventEmitter.prototype)
  .filter(key => util.isFunction((EventEmitter.prototype as any)[key]))
  .forEach(key => (EventEmitterWrapper.prototype as any)[key] = function (...args: any[]) {
    console.log(`@${key}`)
    this.emitter[key](...args)
    return this
  })