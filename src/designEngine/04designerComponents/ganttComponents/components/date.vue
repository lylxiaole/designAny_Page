<template>
 
  <div>
    
    <template v-if="currentDaySize.label=='hour'">
      <div class="hour-father">
        <div class="hour" v-for="item in yearMonthDayHourCombine" :key="item.indexKey"
          :style="{'border-right':'1px solid '+dateBorderColor,
                   width: currentDaySize.value * getHourLevelArr(currentDaySize.level).length+'px', height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                   'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
          {{ item.all }}
          <div class="minute-father">
            <div class="minute" v-for="minuteValue in getHourLevelArr(currentDaySize.level)" :key="minuteValue"
              :style="{'border-right':'1px solid '+dateBorderColor,'border-bottom':'1px solid '+dateBorderColor,'border-top':'1px solid '+dateBorderColor,
                       width:currentDaySize.value + 'px', height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                       'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor }">
              {{ item.hour>=10?item.hour:'0'+item.hour }}:{{ minuteValue }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="currentDaySize.label=='day'">
      <div class="year-father">
        <div class="year" v-for="item in allDays" :key="item.year">
          <div class="month" v-for="(value, key) in item.month[0]" :key="value + 'zz' + key">
            <div class="day" v-for="(dayKey,value1) in item.month[0][key]" :key="dayKey.date"
              :style="{'border-right':'1px solid '+dateBorderColor,
                       width:getDayLevelWidth(currentDaySize.level,currentDaySize.value)+'px', height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                       'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
              {{ item.year }}年{{ key }}月{{ dayKey.date }}日
              <div class="hour-father">
                <div class="hour" v-for="hourValue in getDayLevelArr(currentDaySize.level)" :key="hourValue"
                  :style="{'border-right':'1px solid '+dateBorderColor,'border-bottom':'1px solid '+dateBorderColor,'border-top':'1px solid '+dateBorderColor,
                           width:currentDaySize.value + 'px' , height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                           'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
                  {{ hourValue>=10?hourValue:'0'+hourValue }}:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="currentDaySize.label=='week'">
      <div class="year-father">
        <div class="year" v-for="item in allDaysMonAndSun" :key="item.year">
          <div class="month" v-for="(value, key) in item.month[0]" :key="value + 'zz' + key">
            <div class="day" v-for="(dayKey,value1) in item.month[0][key]" v-if="dayKey.weekday==1" :key="dayKey.date"
              style="padding-top:1px"
              :style="{'border-right':'1px solid '+dateBorderColor, 
                       width:currentDaySize.value*7 + 'px', height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                       'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
              {{ item.year }}年{{ key }}月{{ dayKey.date }}日~{{ key }}月{{ dayKey.date +6}}日
            </div>
          </div>
        </div>
      </div>
      <div class="year-father" style="margin-top:-2px">
        <div class="year" v-for="item in allDaysMonAndSun" :key="item.year">
          <div class="month" v-for="(value, key) in item.month[0]" :key="value + 'zz' + key">
            <div class="day" v-for="(dayKey,value1) in item.month[0][key]" :key="dayKey.date"
            
              style="padding-top:1px"
              :style="{'border-right':'1px solid '+dateBorderColor,'border-bottom':'1px solid '+dateBorderColor,'border-top':'1px solid '+dateBorderColor,
                       width:currentDaySize.value + 'px', height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                       'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
              {{ getWeekDay(dayKey.weekday,currentDaySize.value) }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="currentDaySize.label=='month'">
      <template v-if="currentDaySize.level==10">
        <div class="year-father">
          <div class="year" v-for="item in allDays" :key="item.year">
            <div class="month-father">
              <div class="month" v-for="(value, key) in item.month[0]" :key="value + 'zz' + key"
                :style="{'border-right':'1px solid '+dateBorderColor,
                         width:currentDaySize.value*item.month[0][key].length + 'px', height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                         'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important' ,background:dateBackgroundColor}">
                <template v-if="currentDaySize.value*item.month[0][key].length > 100">
                  {{ item.year }}年{{ key }}月
                </template>
                <template v-else>
                  &nbsp;
                </template>
                <div class="day-father">
                  <div class="day" v-for="(dayKey,value1) in item.month[0][key]" :key="dayKey.date"
                    :style="{'border-right':'1px solid '+dateBorderColor,'border-bottom':'1px solid '+dateBorderColor,'border-top':'1px solid '+dateBorderColor,
                             width:currentDaySize.value + 'px', height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                             'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor }">
                    <template v-if="currentDaySize.value<=30">
                      {{ dayKey.date }}
                    </template>
                    <template v-if="currentDaySize.value>30 && currentDaySize.value<=60">
                      {{ dayKey.date }}日
                    </template>
                    <template v-if="currentDaySize.value>=120">
                      {{ item.year }}年{{ key }}月{{ dayKey.date }}日
                    </template>
                    <template v-if="currentDaySize.value>60 && currentDaySize.value<120">
                      {{ key }}月{{ dayKey.date }}日
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="currentDaySize.level==11">
        <div class="year-father">
          <div class="year" v-for="item in allDaysMonAndSun" :key="item.year">
            <div class="month-father">
              <div class="month" v-for="(value, key) in item.month[0]" :key="value + 'zz' + key"
                :style="{'border-right':'1px solid '+dateBorderColor, 
                         width:currentDaySize.value*item.month[0][key].length + 'px', height:dateHeaderHeight+1+'px','line-height':dateHeaderHeight+'px',
                         'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
                <div v-if="currentDaySize.value*item.month[0][key].length>=60">
                  {{ item.year }}年{{ key }}月
                </div>
                <div v-else>
                  &nbsp;
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="year-father" style="margin-top:-1.5px">
          <div class="year" v-for="item in allDaysMonAndSun" :key="item.year">
            <div class="month-week" v-for="(value, key ) in item.month[0]" :key="value + 'zz' + key">
              <div class="day" v-for="(dayKey,value1) in item.month[0][key]" v-if="dayKey.weekday ==1" :key="dayKey.date"
                :style="{'border-right':'1px solid '+dateBorderColor,'border-bottom':'1px solid '+dateBorderColor,'border-top':'1px solid '+dateBorderColor,
                         width:currentDaySize.value*7 + 'px' , height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                         'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
                <template v-if="currentDaySize.value*7>=70">
                  {{ dayKey.date }}日~{{ dayKey.date+6 }}日
                </template>
                <template v-if="currentDaySize.value*7<70">
                  {{ dayKey.date }}~{{ dayKey.date+6 }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-if="currentDaySize.label=='year'">
      <template v-if="currentDaySize.level==12">
        <div class="year-father">
          <div class="year" v-for="item in allDays" :key="item.year"
            :style="{ 'border-right':'1px solid '+dateBorderColor ,
                      width: currentDaySize.value* Object.keys(item.month[0]).length+'px', height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                      'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
            {{ item.year }}年
            <div class="month-father">
              <div class="month" v-for="(value, key) in item.month[0]" :key="value + 'zz' + key"
                :style="{'border-right':'1px solid '+dateBorderColor,'border-bottom':'1px solid '+dateBorderColor,'border-top':'1px solid '+dateBorderColor,
                         width:currentDaySize.value + 'px', height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                         'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
                <template v-if="currentDaySize.value<=30">
                  {{ key }}
                </template>
                <template v-if="currentDaySize.value>30">
                  {{ key }}月
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="currentDaySize.level==13">
        <div class="year-father">
          <div class="year" v-for="item in allDays" :key="item.year"
            :style="{'border-right':'1px solid '+dateBorderColor,
                     width: currentDaySize.value* 4+'px', height:dateHeaderHeight+'px','line-height':dateHeaderHeight+'px',
                     'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
            {{ item.year }}年
            <div class="month-father">
              <div class="month" v-for="monthItem in monthArrLevel13_new" :key="monthItem"
                :style="{'border-right':'1px solid '+dateBorderColor,'border-bottom':'1px solid '+dateBorderColor,'border-top':'1px solid '+dateBorderColor,
                         width:currentDaySize.value + 'px',height:dateHeaderHeight+'px',lineHeight:dateHeaderHeight+'px',
                         'font-size': dateHeaderFontSize+'px !important','font-weight': dateHeaderFontWeight+' !important',color: dateHeaderColor+' !important',background:dateBackgroundColor}">
                <template v-if="currentDaySize.value<=30">
                  {{ monthItem }}
                </template>
                <template v-if="currentDaySize.value>30">
                  {{ monthItem }}季度
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Date',

  props: [
    'dateHeaderHeight', //日期头每层的高度
    'dateHeaderFontSize', //日期头字体大小
    'dateHeaderFontWeight', //日期头字体的粗细
    'dateHeaderColor', //日期头字体的颜色
    'dateBorderColor', //日期边框的颜色
    'dateBackgroundColor', //日期的背景颜色

    'showNonWeekday', //是否显示周六周日
    'weekdayBGColor', //周六周日的背景颜色

    'allDays',
    'allDaysMonAndSun',
    'daysGanttMonAndSun',
    'yearMonthDayHourCombine',
    'currentDaySize',
    'weekendsHeight',
  ],
  data() {
    return {
      hourArrLevel4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], //小时数
      hourArrLevel5: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], //小时数
      hourArrLevel6: [0, 4, 8, 12, 16, 20], //小时数
      hourArrLevel7: [0, 6, 12, 18], //小时数
      hourArrLevel8: [0, 8, 16], //小时数

      monthArrLevel13: [1, 4, 7, 10],
      monthArrLevel13_new:["一","二","三","四"],

      hoursArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], //小时数
      minuteArrLevel1: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
      minuteArrLevel2: ['00', '10', '20', '30', '40', '50'],
      minuteArrLevel3: ['00', '15', '30', '45'],

      weekdayArr: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      weekdayArr1: ['一', '二', '三', '四', '五', '六', '日'],

    }
  },

  methods: {
    getWeekDay(weekday, width) {
      if (width >= 50) {
        switch (weekday) {
          case 0:
            return '星期日'
            break
          case 1:
            return '星期一'
            break
          case 2:
            return '星期二'
            break
          case 3:
            return '星期三'
            break
          case 4:
            return '星期四'
            break
          case 5:
            return '星期五'
            break
          case 6:
            return '星期六'
            break
        }
      } else {
        switch (weekday) {
          case 0:
            return '日'
            break
          case 1:
            return '一'
            break
          case 2:
            return '二'
            break
          case 3:
            return '三'
            break
          case 4:
            return '四'
            break
          case 5:
            return '五'
            break
          case 6:
            return '六'
            break
        }
      }
    },
    getDayLevelArr(level) {
      switch (level) {
        case 4:
          return this.hourArrLevel4
          break
        case 5:
          return this.hourArrLevel5
          break
        case 6:
          return this.hourArrLevel6
          break
        case 7:
          return this.hourArrLevel7
          break
        case 8:
          return this.hourArrLevel8
          break
      }
    },
    getDayLevelWidth(level, value) {
      switch (level) {
        case 4:
          return value * 24
          break
        case 5:
          return value * 12
          break
        case 6:
          return value * 6
          break
        case 7:
          return value * 4
          break
        case 8:
          return value * 3
          break
      }
    },
    getHourLevelArr(level) {
      switch (level) {
        case 1:
          return this.minuteArrLevel1
          break
        case 2:
          return this.minuteArrLevel2
          break
        case 3:
          return this.minuteArrLevel3
          break
      }
    },
  },
}
</script>

<style lang="less" scoped>

.year-father {
  white-space: nowrap;
}
.year {
  text-align: center;
  display: inline-block;
  border-top:1px solid #f1f1f1;
}

.month {
  text-align: center;
  display: inline-block;
}

.month-week {
  text-align: center;
  display: inline-block;
}
.day-father {
  white-space: nowrap;
}
.day {
  text-align: center;
  display: inline-block;
}
.week-father {
  z-index: 1;
  white-space: nowrap;
}
.week {
  text-align: center;
  display: inline-block;
}

.hour-father {
  white-space: nowrap;
}
.hour {
  text-align: center;
  display: inline-block;
}
.minute-father {
  white-space: nowrap;
}
.minute {
  text-align: center;
  display: inline-block;
}
</style>

