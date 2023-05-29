<template>
  <div style="width:100%;height:100%;">
    <div class="colorarea"> </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit, Watch } from 'vue-property-decorator'
const Pickr = require('@simonwep/pickr/dist/pickr.min.js')
require('@simonwep/pickr/dist/themes/classic.min.css')
require('@simonwep/pickr/dist/themes/monolith.min.css')
require('@simonwep/pickr/dist/themes/nano.min.css')

@Options({})
export default class npColorPicker extends Vue {
  @Prop() public color: string

  @Emit('update:color')
  UpdateColor_Inner(color: string) {}

  private _colorPicker: any
  private isListenColorChange: boolean = true

  @Watch('color')
  onColorChanged(newval: string, oldval: string) {
    this.isListenColorChange = false
    //window.console.log('*****颜色从外部变化', newval)
    this._colorPicker.setColor(newval, false)
    this.isListenColorChange = true
  }

  mounted() {
    this._colorPicker = new Pickr({
      // Selector or element which will be replaced with the actual color-picker.
      // Can be a HTMLElement.
      el: $(this.$el).find('.colorarea')[0],
      // Which theme you want to use. Can be 'classic', 'monolith' or 'nano'
      theme: 'nano',
      default: this.color,
      swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
      ],

      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,
        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: false,
          hsva: false,
          cmyk: false,
          input: true,
          clear: false,
          save: false
        }
      },

      // Button strings, brings the possibility to use a language other than English.
      strings: {
        save: '保存', // Default for save button
        clear: '清空', // Default for clear button
        cancel: '取消' // Default for cancel button
      }
    })

    $(this.$el).find('.pcr-button').css('border', '1px solid #ACACAC')

    this._colorPicker.on('change', (color: any, instance: any) => {
      if (this.isListenColorChange == false) {
        return
      }
      var newcolor = color.toHEXA().toString()
      this._colorPicker.applyColor(true)
      //window.console.log('*****颜色从内部变化', newcolor)
      this.UpdateColor_Inner(newcolor)
    })
  }

  beforeDestroy() {
    if (this._colorPicker) {
      this._colorPicker.destroy()
    }
  }
}
</script>



<style scoped>
.pcr-app[data-theme='nano'] .pcr-interaction {
  display: inline;
}
.pcr-app[data-theme='nano'] .pcr-interaction .pcr-result {
  text-align: center;
  width: 15em;
}

.pcr-app[data-theme='nano'] .pcr-interaction input {
  text-align: center;
  width: 7.1em;
}
.pcr-app[data-theme='nano'] .pcr-interaction .pcr-save {
  text-align: center;
  width: 7.1em;
}

.pcr-app[data-theme='nano'] .pcr-interaction .pcr-clear {
  text-align: center;
  width: 7.1em;
}
</style>