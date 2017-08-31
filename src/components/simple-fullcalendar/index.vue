<template lang="html">
  <div class="sfc-wrapper">
    <div class="sfc-month-hint">
      <button @click="changeMonth('prev')">&lt;</button>
      <span>{{ monthText }}</span>
      <button @click="changeMonth('next')">&gt;</button>
      <button @click="changeMonth('reset')">today</button>
    </div>
    <table class="sfc-table sfc-table-head">
      <thead>
        <tr>
          <td v-for="weekday in weekdays">{{ weekday }}</td>
        </tr>
      </thead>
    </table>
    <template v-for="week in weekArr">
      <weekline :month-moment="monthMoment" :week="week" :events="tidyEvents"></weekline>
    </template>
  </div>
</template>

<script>
// event object
// {
//   start: '2017-06-20',
//   end: '2017-06-21',
//   content: 'wow ~'
// }
import weekline from './components/weekline'
import moment from 'moment'
import { getDurationsDays, getTime } from './util.js'
export default {
  components: {
    weekline
  },
  props: {
    formatter: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    events: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      monthMoment: null,
      weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      weekArr: [],
      monthText: ''
    }
  },
  computed: {
    tidyEvents () {
      let events = this.events.map((eventItem, index) => {
        let s = moment(eventItem.start, this.formatter)
        let e = moment(eventItem.end, this.formatter)
        return Object.assign({}, eventItem, {
          startMoment: s,
          endMoment: e,
          startDate: s.date(),
          startWeekday: s.isoWeekday(),
          durationDays: getDurationsDays(s.format('YYYY-MM-DD'), e.format('YYYY-MM-DD')),
          startTime: getTime(s.format('YYYY-MM-DD'))
        })
      })
      events.sort(function (a, b) {
        return a.startTime - b.startTime
      })
      return events
    }
  },
  beforeMount () {
    this.monthMoment = moment()
    this.setMonthInfo()
  },
  methods: {
    getMonthInfo () {
      // if (!month) return []
      let monthMoment = this.monthMoment
      let dayCount = monthMoment.clone().endOf('month').date()
      var dayArr = []
      for (let i = 0; i < dayCount; i++) {
        let date = i + 1
        let dayMoment = monthMoment.clone().date(date)
        let weekday = dayMoment.isoWeekday()
        dayArr.push({
          month: dayMoment.month(),
          date,
          weekday,
          moment: dayMoment
        })
      }
      // fill date to complete weeks
      let d = dayArr[0].weekday
      while (--d) {
        let dayMoment = monthMoment.clone().startOf('month').isoWeekday(d)
        dayArr.unshift({
          month: dayMoment.month(),
          date: dayMoment.date(),
          weekday: d,
          moment: dayMoment
        })
      }

      d = dayArr[dayArr.length - 1].weekday
      while (++d <= 7) {
        let dayMoment = monthMoment.clone().endOf('month').isoWeekday(d)
        dayArr.push({
          month: dayMoment.month(),
          date: dayMoment.date(),
          weekday: d,
          moment: dayMoment
        })
      }

      // splice into weeks
      let weekArr = []
      while (dayArr.length >= 7) {
        weekArr.push(dayArr.splice(0, 7))
      }

      return weekArr
    },
    changeMonth (direction) {
      switch (direction) {
        case 'prev':
          this.monthMoment.add(-1, 'month')
          break
        case 'next':
          this.monthMoment.add(1, 'month')
          break
        case 'reset':
          this.monthMoment = moment()
          break
        default:
      }
      this.setMonthInfo()
    },
    setMonthInfo () {
      this.weekArr = this.getMonthInfo()
      this.monthText = this.monthMoment.format('YYYY-MM')
    }
  }
}
</script>

<style lang="stylus">
$border = 1px solid #666
$eventBg = #3b91ad
$eventColor = #fff
$fontSize = 12px
clearfix()
  zoom: 1
  height: auto
  &:before,
  &:after
    content: " "
    display: table

  &:after
    clear: both
    visibility: hidden
    font-size: 0
    height: 0

.sfc-wrapper
  width: 800px
  margin: auto
  .sfc-month-hint
    text-align: center
  .sfc-table-wrapper
    position: relative
    margin-top: -1px
    .sfc-events-table
      position: absolute
      top: 0
      left: 0
  .sfc-table
    width: 100%
    table-layout: fixed
    border-spacing: 0
    border-collapse: collapse
    .sfc-table-bg
      td
        border: $border
        height: 80px
  .sfc-table-head
    width: 100%
    text-align: center
    td
      border: $border
  .sfc-date
    text-align: right
    font-size: 14px
    .not-current-month
      color: #aaa
  .sfc-events
    .sfc-event-item
      margin: 1px 2px
      padding: 2px
      border-radius: 2px
      border: $border
      border-color: $eventBg
      background-color: $eventBg
      color: $eventColor
      font-size: $fontSize
      line-height: 1.2
      overflow: hidden
      text-overflow: ellipsis
</style>
