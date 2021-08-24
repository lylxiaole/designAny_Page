import React from 'react'
import { ajaxGet, ajaxPost, ajaxPut, ajaxDelete } from '../utils/axiosEnhancer'
import { notifySuccess, notifyWarning, notifyError, alertSuccess, alertWarning, confirmNotify, confirmError } from '../utils/devExtremeUtils'
import ComponentBase from './ComponentBase'
import _axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

interface requestMethod {
  ajaxGet: (url: string, config?: AxiosRequestConfig | undefined) => Promise<any>
  ajaxPost: (url: string, data?: any, config?: AxiosRequestConfig | undefined) => Promise<any>
  ajaxPut: (url: string, data?: any, config?: AxiosRequestConfig | undefined) => Promise<any>
  ajaxDelete: (url: string, config?: AxiosRequestConfig | undefined) => Promise<any>
}

interface popupMethod {
  notifySuccess: (message: string) => any
  notifyWarning: (message: string) => any
  notifyError: (message: string) => any
  alertSuccess: (message: string) => Promise<void>
  alertWarning: (message: string) => Promise<void>
  confirmNotify: (message: string) => Promise<boolean>
  confirmError: (message: string) => Promise<boolean>
}

export default class PageBase<P = {}, S = {}, SS = any> extends ComponentBase<P, S, SS> {
  protected requestMethod: requestMethod = { ajaxGet: ajaxGet, ajaxPost: ajaxPost, ajaxPut: ajaxPut, ajaxDelete: ajaxDelete }
  protected popupMethod: popupMethod = {
    notifySuccess: notifySuccess,
    notifyWarning: notifyWarning,
    notifyError: notifyError,
    alertSuccess: alertSuccess,
    alertWarning: alertWarning,
    confirmNotify: confirmNotify,
    confirmError: confirmError
  }
  constructor(props: any) {
    super(props)
  }
}
