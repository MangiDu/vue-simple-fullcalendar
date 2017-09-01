<template lang="html">
  <div class="sfc-table-wrapper">
    <table class="sfc-table" :style="{'height': `${wrapperHeight}px`}">
      <tbody class="sfc-table-bg">
        <tr>
          <td v-for="day in eventsWeek" :class="{'highlight': day.moment.isBetween(...highlightTimeRange, 'day', '[]')}" :data-date="day.dateText" @mousedown="recordDate('start', $event)" @mouseup="recordDate('end', $event)" @mouseover="recordDate('between', $event)">
          </td>
        </tr>
      </tbody>
    </table>
    <table class="sfc-table sfc-events-table" ref="eventsTable">
      <tbody>
        <tr class="sfc-date">
          <!-- date -->
          <td v-for="day in eventsWeek" :class="{'not-current-month': !day.moment.isSame(monthMoment, 'month')}">{{ day.date }}</td>
        </tr>
        <tr class="sfc-events" v-for="i in maxCount">
          <!-- events wrapper -->
          <template v-for="day in eventsWeek">
            <td v-if="!day.events[i - 1]"></td>
            <template v-else-if="day.events[i - 1].placehold"></template>
            <td v-else-if="day.events[i - 1]" :colspan="day.events[i - 1].colspan">
              <div class="sfc-event-item" :class="{'is-start': day.events[i - 1].isStart, 'is-end': day.events[i - 1].isEnd}" :title="day.events[i - 1].content">
                {{ day.events[i - 1].time }}<br/>{{ day.events[i - 1].content }}
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getDurationsDays } from '../util.js'

const WAIT_TIME = 100
export default {
  props: {
    monthMoment: {
      type: Object
    },
    week: {
      type: Array,
      required: true
    },
    events: {
      type: Array,
      default: []
    },
    highlightTimeRange: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      wrapperHeight: 0
    }
  },
  computed: {
    eventsWeek () {
      let week = this.week.map((day) => {
        day.events = []
        day.dateText = day.moment.format('YYYY-MM-DD')
        this.events.forEach(function (eventItem, eventIndex) {
          if (day.moment.isBetween(eventItem.startMoment.clone().startOf('day'), eventItem.endMoment.clone().endOf('day'), null, '[]')) {
            let event
            if (eventItem.startMoment.isSame(day.moment, 'day')) {
              // event start in current day, must have a start, maybe an end
              let durationDays = eventItem.durationDays
              let state = {
                isStart: true,
                isEnd: true
              }
              if ((eventItem.durationDays + eventItem.startWeekday - 1) > 7) {
                durationDays = 7 - eventItem.startWeekday + 1
                state.isEnd = false
              }
              event = {
                time: `${eventItem.startMoment.format('MM-DD')}~${eventItem.endMoment.format('MM-DD')}`,
                content: eventItem.content,
                colspan: durationDays
              }
              Object.assign(event, state)
              let order = 0
              for (let i = 0; i < day.events.length; i++) {
                if (!day.events[i]) order = i
              }
              eventItem._order = order || day.events.length
            } else if (day.moment.isoWeekday() === 1) {
              // current day is monday, event began at least last week, not a start, maybe have an end
              let durationDays = getDurationsDays(day.moment.format('YYYY-MM-DD'), eventItem.endMoment.format('YYYY-MM-DD'))
              let state = {
                isStart: false,
                isEnd: true
              }
              if (durationDays > 7) {
                durationDays = 7
                state.isEnd = false
              }
              event = {
                time: `${eventItem.startMoment.format('MM-DD')}~${eventItem.endMoment.format('MM-DD')}`,
                content: eventItem.content,
                colspan: durationDays
              }
              Object.assign(event, state)
              let order = 0
              for (let i = 0; i < day.events.length; i++) {
                if (!day.events[i]) order = i
              }
              eventItem._order = order || day.events.length
            } else {
              event = {
                placehold: true
              }
            }
            let order = eventItem._order || day.events.length
            day.events[order] = event
          }
        })
        return day
      })
      return week
    },
    maxCount () {
      return Math.max.apply(null, this.eventsWeek.map(day => day.events.length))
    }
  },
  watch: {
    eventsWeek () {
      this.updateHeight()
    }
  },
  mounted () {
    this.updateHeight()
  },
  methods: {
    recordDate (point, e) {
      if (this._recordTimer) {
        clearTimeout(this._recordTimer)
      }
      this._recordTimer = setTimeout(() => {
        this.$emit('select', point, e)
      }, WAIT_TIME)
    },
    updateHeight () {
      this.$nextTick(() => {
        let height = this.$refs.eventsTable.clientHeight
        this.wrapperHeight = height
      })
    }
  }
}
</script>

<style lang="css">
</style>
