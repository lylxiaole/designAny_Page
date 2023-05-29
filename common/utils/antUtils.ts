import { Modal } from 'antd'
/**
 * 删除确认框
 * @param {*} callBack回调函数
 */
export function delModal(callBack: any) {
  Modal.confirm({
    title: '删除操作',
    content: '确定要删除这条数据吗？',
    centered: true,
    okText: '确定',
    cancelText: '取消',
    onOk: callBack
  })
}
/**
 * 操作确认框
 * @param {*} callBack回调函数
 */
interface param {
  okText?: String
  title?: String
  content?: String
  callBack: any
}
export function confirmModal(param: param) {
  const contentPrivate = param.content || '确定要执行操作吗？'
  const titlePrivate = param.title || '操作确认'
  const okTextPrivate = param.okText || '确认'
  Modal.confirm({
    title: titlePrivate,
    content: contentPrivate,
    centered: true,
    okText: okTextPrivate,
    cancelText: '取消',
    onOk: param.callBack
  })
}
