<template lang="html">
  <div class="sfc-wrapper">
    <div class="sfc-month-hint">
      <div class="month-info">
        <span class="sfc-button" @click="changeMonth('prev')">&lt;</span>
        <span>{{ monthText }}</span>
        <span class="sfc-button" @click="changeMonth('next')">&gt;</span>
      </div>
      <div class="operations">
        <span class="sfc-button" @click="changeMonth('reset')">back to current month</span>
      </div>
    </div>
    <table class="sfc-table sfc-table-head">
      <thead>
        <tr>
          <td v-for="weekday in weekdays">{{ weekday }}</td>
        </tr>
      </thead>
    </table>
    <template v-for="week in weekArr">
      <weekline :month-moment="monthMoment" :week="week" :events="tidyEvents" :highlight-time-range="selectedTimeRangeResult" @select="onSelect"></weekline>
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
      weekdays: 'Monday_Tuesday_Wednesday_Thursday_Friday_Saturday_Sunday'.split('_'),
      weekArr: [],
      monthText: '',
      selectedTimeRange: {
        start: null,
        between: null,
        end: null
      }
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
    },
    selectedTimeRangeResult () {
      let timeRange = this.selectedTimeRange
      let start = timeRange.start
      let end = timeRange.end || timeRange.between
      if (start && end) {
        return start > end ? [end, start] : [start, end]
      } else return []
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
    },
    onSelect (point, e) {
      let el = e.target
      let timeRange = this.selectedTimeRange
      switch (point) {
        case 'start':
          timeRange.start = el.getAttribute('data-date')
          timeRange.between = null
          timeRange.end = null
          break
        case 'between':
          if (timeRange.start) {
            timeRange.between = el.getAttribute('data-date')
          }
          break
        case 'end':
          if (timeRange.start) {
            timeRange.end = el.getAttribute('data-date')
            this.addEvent(point === 'end')
          }
          break
        default:
      }
    },
    addEvent (isSelected) {
      if (!isSelected) return
      let [start, end] = this.selectedTimeRangeResult
      this.$emit('timeRangeSelected', {
        start,
        end
      })

      let timeRange = this.selectedTimeRange
      timeRange.start = null
      timeRange.between = null
      timeRange.end = null
    }
  }
}
</script>

<style lang="stylus">
$gray = #666
$cyan = #3b91ad
$white = #fff
$fontSize = 12px
$border = 1px solid $gray
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

.sfc-button
  display: inline-block
  height: 24px
  padding: 0 5px
  border: $border
  border-color: $cyan
  color: $cyan
  border-radius: 4px
  cursor: pointer
  &:hover
    color: darken($cyan, 50%)
    border-color: @color
.sfc-month-hint
  margin-bottom: 10px
  text-align: center
  clearfix()
  .month-info
    float: left
  .operations
    float: right

.sfc-wrapper
  width: 800px
  margin: auto
  .sfc-table-wrapper
    position: relative
    margin-top: -1px
    .sfc-events-table
      position: absolute
      top: 0
      left: 0
      pointer-events: none
  .sfc-table
    width: 100%
    table-layout: fixed
    border-spacing: 0
    border-collapse: collapse
    user-select: none
    .sfc-table-bg
      td
        border: $border
        height: 80px
        &.highlight
          background-color: rgba(59, 143, 173, .1)
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
      margin: -1px 0 2px
      padding: 2px
      border: $border
      border-color: $cyan
      background-color: $cyan
      color: $white
      font-size: $fontSize
      line-height: 1.2
      overflow: hidden
      text-overflow: ellipsis
      pointer-events: auto
      &.is-start
        margin-left: 2px
        border-top-left-radius: 2px
        border-bottom-left-radius: 2px
      &.is-end
        margin-right: 2px
        border-top-right-radius: 2px
        border-bottom-right-radius: 2px
</style>
