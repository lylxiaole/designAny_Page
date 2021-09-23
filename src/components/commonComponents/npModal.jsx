import { Modal } from 'ant-design-vue'

export default {
  name: 'NpModal',
  extends: Modal,
  props: {
    ...Modal.props, // 这里继承内在组件的props
    /** 弹出效果 */
    transitionName: {
      type: String,
      default: 'fade',
    },
    /**是否可以最大化 */
    canMax: {
      type: Boolean,
      default: false,
    },
    /**是否默认最大化 */
    isMax: {
      type: Boolean,
      default: false,
    },
    /**弹窗状态 */
    operationType: {
      type: Object,
      default: undefined,
    },
    /** 子标题 */
    subtitle: {
      type: String,
      default: undefined,
    },
  },
  created() {},
  data() {
    return {
      modal: {
        /**宽度 */
        width: this.isMax ? '100%' : this.width,
        /**style样式 */
        style: this.isMax ? { top: '0' } : { top: '0' },
        /**全屏操作 */
        fullScreen: this.isMax,
        /**wrapClassName重写 */
        NwrapClassName: '',
        /**垂直居中展示 */
        centered: true,
        /**记录原始弹窗尺寸 */
        oldwidth: this.width,
        /**是否可以esc、点击蒙层关闭 */
        keyboard: true,
        maxicon: this.isMax ? 'fullscreen-exit' : 'fullscreen',
        zIndex: 100,
      },
    }
  },
  methods: {
    ok(e) {
      this.$emit('ok', e)
    },
    cancel(e) {
      this.$emit('cancel', e)
    },
    handleClickToggleFullScreen() {
      const mode = !this.modal.fullScreen
      if (mode) {
        this.modal.width = '100%'
        this.modal.style.top = '0'
        this.modal.NwrapClassName = 'ant-modal-cust-warp'
        this.modal.maxicon = 'fullscreen-exit'
      } else {
        this.modal.width = this.oldwidth
        this.modal.style.top = '0'
        this.modal.NwrapClassName = 'ant-modal-cust-min'
        this.modal.centered = true
        this.modal.maxicon = 'fullscreen'
      }
      this.modal.fullScreen = mode
    },
  },
  render(h) {
    const props = {}

    this.modal.keyboard = this.operationType != undefined && this.operationType === this.operation.view ? true : false
    //window.console.info('keyboard', this.operation)
    const localKeys = Object.keys(this.$data)
    Object.keys(Modal.props).forEach((k) => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      if (k === 'width') {
        props[k] = this.modal.width
        return props[k]
      } else if (k === 'wrapClassName') {
        props[k] = this.modal.NwrapClassName
        return props[k]
      } else if (k === 'keyboard' || k === 'maskClosable') {
        props[k] = this.modal.keyboard
        return props[k]
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    //重新组织弹窗标题
    const NcombineTitle =
      this.title != undefined && this.title.length > 0 ? this.title : this.operationType != undefined ? this.operationType.label + this.subtitle : ''
    //重新组织弹窗取消按钮文字
    const NcancelText =
      this.cancleText != undefined && this.cancelText.length > 0
        ? this.cancelText
        : this.operationType != undefined
        ? this.operationType === this.operation.view
          ? '关闭'
          : '取消'
        : '关闭'
    //重新组织确认按钮props
    const NokButtonProps =
      this.okButtonProps === undefined
        ? {
            props: {
              icon: 'check',
              prefixCls: this.operationType === this.operation.view ? 'Nokstyle' : 'ant-btn ant-btn-primary',
            },
          }
        : this.okButtonProps
    //重新组织取消按钮props
    const NcancelButtonProps = this.cancelButtonProps === undefined ? { props: { icon: 'close' } } : this.cancelButtonProps
    //最大化相关
    this.modal.NwrapClassName = this.modal.fullScreen ? 'ant-modal-cust-warp' : 'ant-modal-cust-min'
    const maxButton = this.canMax ? (
      <div style="float: right;margin-top: -2px;margin-right:-20px;">
        <a-button
          icon={this.modal.maxicon}
          style="width:56px;height:100%;border:0;background: transparent;color: #fff;"
          onclick={this.handleClickToggleFullScreen}
        />
      </div>
    ) : null
    const modal = (
      <a-modal
        destroyOnClose
        {...{ props, scopedSlots: { ...this.$scopedSlots } }}
        onok={this.ok}
        oncancel={this.cancel}
        cancelText={NcancelText}
        okButtonProps={NokButtonProps}
        cancelButtonProps={NcancelButtonProps}
        style={this.modal.style}
        centered={this.modal.centered}
        zIndex={this.modal.zIndex}
        class="SModal"
      >
        {Object.keys(this.$slots).map((name) => {
          return <template slot={name}>{this.$slots[name]}</template>
        })}
        <template slot="title">
          <div style="width: 100%;height:20px;padding-right:32px;font-size:20px;">
            <div style="float: left;">{NcombineTitle}</div>
            {maxButton}
          </div>
        </template>
      </a-modal>
    )
    return <div>{modal}</div>
  },
}
