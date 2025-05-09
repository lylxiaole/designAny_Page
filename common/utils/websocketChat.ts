import { getConfigByName } from '@common/baseConfigs'
const websockAddr = () => getConfigByName('websocketAddr')
import { getStore } from '@common/baseConfigs'

export enum msgType {
  user_editingPage = 1,
  user_closePage = 2,
  server_lockingPageChange = 100
}
export class websocketMsgTemp<T> {
  senderId: string = ''
  receiverId: string = ''
  // sendMachineId: string = ''
  // receiverMachineId: string = ''
  msgType: msgType = msgType.system_clientNotOnline
  content: T | null = null
}

declare type onMessageCallback = (data: websocketMsgTemp<any>) => void

export default class websocketChat {
  private static websocketClient: WebSocket | null
  private static _onmessageCallbacks: onMessageCallback[] = []
  private static _socketAddress: string

  public static Initlize() {
    let token = window.localStorage.getItem('token')
    let websocketServerAddress = websockAddr()

    if (!websocketChat.websocketClient) {
      websocketChat.websocketClient = new WebSocket(websocketServerAddress + '?token=' + token)
      websocketChat.websocketClient.onmessage = websocketChat.onwebsocketMessage
      websocketChat.websocketClient.onerror = () => {
        websocketChat.startLoop()
        window.console.info('Connection Error')
      }
      websocketChat.websocketClient.onopen = () => {
        websocketChat.startLoop()
        window.console.info('WebSocket Client Connected')
        // 开始订阅
        // let data = {
        //   requestHead: 'Logon',
        //   message: {
        //     token: getToken()
        //   }
        // }
        // websocketChat.websocketClient?.send(JSON.stringify(data))
      }

      websocketChat.websocketClient.onclose = () => {
        websocketChat.startLoop()
        window.console.info('echo-protocol Client Closed')
      }
    }
  }

  public static Close() {
    if (!websocketChat.websocketClient) {
      return
    }
    websocketChat._onmessageCallbacks = []
    websocketChat.websocketClient.close()
  }

  private static onwebsocketMessage(e: any) {
    if (!e.data) {
      return
    }
    // window.console.log('onwebsocketMessage:', e)
    var data = JSON.parse(e.data)
    // window.console.log('**********消息回调个数:', websocketChat._onmessageCallbacks.length)
    websocketChat._onmessageCallbacks.forEach((o) => o(data))
  }

  public static isStartLoop: boolean = false
  public static threadSleep(millionSeconds: number) {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        resolve(null)
      }, millionSeconds)
    })
  }
  public static async startLoop() {
    if (websocketChat.isStartLoop === true) {
      return
    }
    websocketChat.isStartLoop = true
    while (websocketChat.isStartLoop) {
      // console.log('startLoop')
      let isok = true

      try {
        // websocketChat.websocketClient?.send('心跳')
        if (websocketChat.websocketClient?.readyState !== websocketChat.websocketClient?.OPEN) {
          console.log('websocket已经断开，开始重新创建..................')
          try {
            websocketChat.websocketClient?.close()
          } catch (error) {}
          isok = false
        }
      } catch (error) {
        try {
          console.log('主动关闭websocket')
          isok = false
          websocketChat.websocketClient?.close()
        } catch (error) {}
      }
      await websocketChat.threadSleep(3000)
      if (isok === false) {
        websocketChat.websocketClient = null
        websocketChat.isStartLoop = false
        websocketChat.Initlize()
        break
      }

      // console.log('websocket状态正常，继续运行循环检查................' + websocketChat.websocketClient.OPEN)
    }
  }
  // *******实例方法************************************************************************************
  public sendMessageToServer(content: any, msgType: msgType) {
    let machineId = getStore().state.app.machineId
    var message: any = new websocketMsgTemp<any>()
    message.senderId = machineId
    message.content = content
    message.msgType = msgType
    websocketChat.websocketClient.send(JSON.stringify(message))
  }

  public listenOnMessgae(callback: onMessageCallback) {
    if (websocketChat._onmessageCallbacks.indexOf(callback) < 0) {
      websocketChat._onmessageCallbacks.push(callback)
    }
  }

  public unListenOnMessgae(callback: onMessageCallback) {
    var index = websocketChat._onmessageCallbacks.indexOf(callback)
    if (index > -1) {
      websocketChat._onmessageCallbacks.splice(index, 1)
    }
  }
  // *********************************************************
}
