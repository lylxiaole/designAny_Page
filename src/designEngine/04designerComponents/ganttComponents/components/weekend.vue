<template>
  <div>
    <template v-if="currentDaySize.label=='hour'"> 
        <div class="hour-father">
          <div class="hour" v-for="item in yearMonthDayHourCombine" :key="item.indexKey"
            :style="{width: currentDaySize.value * getHourLevelArr(currentDaySize.level).length+'px'}">
            <div :ref="task.id+'_weekend'" v-if="item.weekday==0||item.weekday==6" :style="{height:weekendsHeight+'px',background:weekdayBGColor}" />
          </div>
        </div> 
    </template>
    <template v-if="currentDaySize.label=='day'"> 
        <div class="year-father">
          <div class="year" v-for="item in allDays" :key="item.year">
            <div class="month" v-for="(value, key) in item.month[0]" :key="value + 'zz' + key">
              <div class="day" v-for="(dayKey,value1) in item.month[0][key]" :key="dayKey.date"
                :style="{width:getDayLevelWidth(currentDaySize.level,currentDaySize.value)+'px'}">
                <div :ref="task.id+'_weekend'" v-if="dayKey.weekday==0||dayKey.weekday==6" :style="{height:weekendsHeight+'px',background:weekdayBGColor}" />
              </div>
            </div>
          </div>
        </div> 
    </template>
    <template v-if="currentDaySize.label=='week'"> 
        <div class="year-father">
          <div class="year" v-for="item in allDaysMonAndSun" :key="item.year">
            <div class="month" v-for="(value, key) in item.month[0]" :key="value + 'zz' + key">
              <div class="day" v-for="(dayKey,value1) in item.month[0][key]" :key="dayKey.date" :style="{width:currentDaySize.value + 'px'}">
                <div :ref="task.id+'_weekend'" v-if="dayKey.weekday==0||dayKey.weekday==6" :style="{height:weekendsHeight+'px',background:weekdayBGColor}" />
              </div>
            </div>
          </div>
        </div> 
    </template>
    <template v-if="currentDaySize.label=='month'">
      <template v-if="currentDaySize.level==10"> 
          <div class="year-father">
            <div class="year" v-for="item in allDays" :key="item.year">
              <div class="month" v-for="(value, key) in item.month[0]" :key="value + 'zz' + key">
                <div class="day" v-for="(dayKey,value1) in item.month[0][key]" :key="dayKey.date" :style="{width:currentDaySize.value+'px'}">
                  <div :ref="task.id+'_weekend'" v-if="dayKey.weekday==0||dayKey.weekday==6" :style="{height:weekendsHeight+'px',background:weekdayBGColor}" />
                </div>
              </div>
            </div>
          </div> 
      </template>
      <template v-if="currentDaySize.level==11"> 
          <div class="year-father">
            <div class="year" v-for="item in allDaysMonAndSun" :key="item.year">
              <div class="month" v-for="(value, key) in item.month[0]" :key="value + 'zz' + key">
                <div class="day-father">
                  <div class="day" v-for="(dayKey,value1) in item.month[0][key]" :key="dayKey.date" :style="{width:currentDaySize.value + 'px' }">
                    <div :ref="task.id+'_weekend'" v-if="dayKey.weekday==0||dayKey.weekday==6" :style="{height:weekendsHeight+'px',background:weekdayBGColor}" />
                  </div>
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
  name: 'Weekend',

  props: [   
    'weekdayBGColor', //周六周日的背景颜色

    'allDays',
    'allDaysMonAndSun', 
    'yearMonthDayHourCombine',
    'currentDaySize',
    'weekendsHeight',
    'task',  
  ],
  data() {
    return {  
      minuteArrLevel1: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
      minuteArrLevel2: ['00', '10', '20', '30', '40', '50'],
      minuteArrLevel3: ['00', '15', '30', '45'], 
    }
  },

  methods: {
    
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

