import W3CWebSocket from 'websocket'

import { getConfigByName } from '@common/baseConfigs'
const websockAddr = () => getConfigByName('websocketAddr')

export enum msgType {
  //  ********system message 0-999****************************************************
  /// <summary>
  /// 当自己的设备上线
  /// </summary>
  system_onMachineOnline = 0,
  /// <summary>
  /// 当自己的设备下线
  /// </summary>
  system_onMachineDownline = 1,
  /// <summary>
  /// 当获取到自己在线的设备
  /// </summary>
  system_onGetMyMachine = 2,
  /// <summary>
  /// 客户端不在线
  /// </summary>
  system_clientNotOnline = 3,
  /// <summary>
  /// 开始直播
  /// </summary>
  system_startPlay = 50,
  /// <summary>
  /// 直播服务端创建offer成功
  /// </summary>
  system_onPlayServerOfferCreated = 51,
  /// <summary>
  /// 直播端创建answer给服务端
  /// </summary>
  system_setPlayServerAnswer = 52,
  /// <summary>
  /// 直播服务端创建了icecandidate
  /// </summary>
  system_onPlayServerIcecandidate = 53,
  /// <summary>
  /// 直播端创建了icecandidate
  /// </summary>
  system_onPlayerIcecandidate = 54,
  /// <summary>
  /// 观看直播
  /// </summary>
  system_onWatchPlay = 60,
  /// <summary>
  /// 观看者offer创建成功
  /// </summary>
  system_onWatcherOfferCreated = 61,
  /// </summary>
  system_onWatcherIcecandidate = 62,
  /// <summary>
  /// 直播端创建answer给服务端
  /// </summary>
  system_setWatcherAnswer = 63,
  //  ********machine message 1000-9999****************************************************
  client_onRequestConnect = 1000,
  client_onAnswerRequestConnect = 1001,
  client_onCutPeerConnection = 1002,
  client_onCaller_CreateOffer = 1003,
  client_onCallee_CreateAnswer = 1004,
  client_onCaller_CreateIceCandite = 1005,
  client_onCallee_CreateIceCandite = 1006,
  client_onCaller_SetRemoteSdpCompleted = 1007,
  client_onCallee_SetRemoteSdpCompleted = 1008,
  client_onNameChange = 1050,
  //  ********user message 10000-99999****************************************************
  user_onPeerMessage = 10000,
  user_onGroupMessage = 10001,
  user_onRemoveFromGroup = 10002,
  user_onNewRequest = 10003,
  user_onDeleteFriend = 10004,
  user_onAgreeJoinGroup = 10005,
  user_onAgreeAddFriend = 10006,

  user_onRequestConnect = 10050,
  user_onRefuseConnect = 10051,
  user_onAcceptConnect = 10052
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
  private static websocketClient: W3CWebSocket.w3cwebsocket
  private static currentMachineId: string
  private static _onmessageCallbacks: onMessageCallback[] = []

  public static Initlize() {
    let token = window.localStorage.getItem('token')
    let websocketServerAddress = websockAddr()

    if (!websocketChat.websocketClient) {
      websocketChat.websocketClient = new W3CWebSocket.w3cwebsocket(websocketServerAddress + token)
      websocketChat.websocketClient.onmessage = websocketChat.onwebsocketMessage
      websocketChat.websocketClient.onerror = function () {
        window.console.info('Connection Error')
      }
      websocketChat.websocketClient.onopen = function () {
        window.console.info('WebSocket Client Connected')
      }
      websocketChat.websocketClient.onclose = function () {
        window.console.info('echo-protocol Client Closed')
      }
    }
    return websocketChat.websocketClient
  }

  private static onwebsocketMessage(e: any) {
    if (!e.data) {
      return
    }
    var data = JSON.parse(e.data) as websocketMsgTemp<any>
    // window.console.log('**********消息回调个数:', websocketChat._onmessageCallbacks.length)
    websocketChat._onmessageCallbacks.forEach((o) => o(data))
  }

  // *******实例方法************************************************************************************
  public sendMessageTo(receiverId: string, content: any, msgType: msgType) {
    var message: any = new websocketMsgTemp<any>()
    message.senderId = websocketChat.currentMachineId
    message.receiverId = receiverId
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
}
