import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { optionStyle } from './selectCommonTypes'
import { template } from 'xe-utils/methods'
import { Option } from 'ant-design-vue/types/select/option'
@Component({ name: 'selectoptions' })
export default class select_options extends Vue {
  @Prop() value: any
  vmodel: any = 'lucy'
  @Prop() dataSource: optionStyle[]
  @Prop() showSearch: boolean
  // @Prop() defaultValue: string
  @Prop() disabled: boolean
  @Prop() size: string
  @Prop() mode: string
  @Prop() tokenSeparators: string | string[]
  @Prop() placeholder: string
  @Prop() allowClear: boolean
  @Prop() defaultActiveFirstOption: boolean
  @Prop() maxTagCount: number
  @Prop() notFoundContent: string
  @Prop() autoClearSearchValue: boolean
  @Prop() selectedIcon: string
  @Prop() sufIcon: string
  @Prop() removeIcon: string
  @Prop() clearIcon: string
  // @Prop() dropdownMatchSelectWidth: boolean
  // private currentRender: any = null

  mounted() {}
  public render(h: any) {
    return (
      <a-select
        v-model={this.vmodel}
        style="width:100%"
        showSearch={this.showSearch}
        disabled={this.disabled}
        size={this.size}
        mode={this.mode}
        tokenSeparators={this.tokenSeparators}
        placeholder={this.placeholder}
        allowClear={this.allowClear}
        defaultActiveFirstOption={this.defaultActiveFirstOption}
        notFoundContent={this.notFoundContent}
        maxTagCount={this.maxTagCount}
        autoClearSearchValue={this.autoClearSearchValue}
        dropdownMatchSelectWidth
        onChange={this.handelChange}
        onSearch={this.handleSearch}
        onPopupScroll={this.handlePopupScroll}
        onSelect={this.handleSelect}
        onDeselect={this.handelDeselect}
        onInputKeydown={this.handleInputKeydown}
        onMouseenter={this.handelMouseenter}
        onMouseleave={this.handelMouseleave}
        getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
      >
        <a-icon slot="suffixIcon" type={this.sufIcon} />
        <a-icon slot="menuItemSelectedIcon" type={this.selectedIcon} />
        <a-icon slot="removeIcon" type={this.removeIcon} />
        <a-icon slot="clearIcon" type={this.clearIcon} />
        {this.dataSource.map((ele) => {
          if (ele.child.length > 0) {
            return (
              <a-select-opt-group label={ele.label}>
                {ele.child.map((info) => {
                  return (
                    <a-select-option value={info.value} disabled={info.disabled} key={info.key}>
                      {info.label}
                    </a-select-option>
                  )
                })}
              </a-select-opt-group>
            )
          } else {
            return (
              <a-select-option value={ele.value} disabled={ele.disabled} key={ele.key}>
                {ele.label}
              </a-select-option>
            )
          }
        })}
      </a-select>
    )
  }

  private handelChange(value: any) {
    // window.console.log(value)
    this.$emit('change', value)
  }

  private handleSearch(value: any) {
    this.$emit('search', value)
  }

  private handlePopupScroll() {
    this.$emit('popupScroll')
  }

  private handleSelect(value: any, option: Option) {
    this.$emit('select', value, option)
  }
  private handelDeselect(value: any, option: Option) {
    this.$emit('deselect', value, option)
  }

  private handleInputKeydown() {
    this.$emit('inputKeydown')
  }

  private handelMouseenter() {
    this.$emit('mouseenter')
  }

  private handelMouseleave() {
    this.$emit('mouseleave')
  }
}
