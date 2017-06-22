<template lang="html">
  <tbody class="sfc-table-body">
    <tr class="sfc-date">
      <!-- date -->
      <td v-for="day in eventsWeek" :class="{'not-current-month': !day.moment.isSame(monthMoment, 'month')}">{{ day.date }}</td>
    </tr>
    <tr class="sfc-events" v-for="i in maxCount">
      <!-- events wrapper -->
      <template v-for="day in eventsWeek">
        <td v-if="day.events[i - 1] && !day.events[i - 1].placehold" class="sfc-event-item" :colspan="day.events[i - 1].colspan">{{ day.events[i - 1].time }}<br/>{{ day.events[i - 1].content }}</td>
        <td v-if="!day.events[i - 1]"></td>
      </template>
    </tr>
  </tbody>
</template>

<script>
import { getDurationsDays } from '../util.js'
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
    }
  },
  computed: {
    eventsWeek () {
      let week = this.week.map((day) => {
        day.events = []
        this.events.forEach(function (eventItem, eventIndex) {
          if (day.moment.isBetween(eventItem.startMoment.clone().startOf('day'), eventItem.endMoment.clone().endOf('day'), null, '[]')) {
            let event
            if (eventItem.startMoment.isSame(day.moment, 'day')) {
              let durationDays = (eventItem.durationDays + eventItem.startWeekday - 1) > 7 ? 7 - eventItem.startWeekday + 1 : eventItem.durationDays
              event = {
                time: `${eventItem.startMoment.format('MM-DD')}~${eventItem.endMoment.format('MM-DD')}`,
                content: eventItem.content,
                colspan: durationDays
              }
            } else if (day.moment.isoWeekday() === 1) {
              let durationDays = getDurationsDays(day.moment.format('YYYY-MM-DD'), eventItem.endMoment.format('YYYY-MM-DD'))
              durationDays = durationDays >= 7 ? 7 : durationDays
              event = {
                time: `${eventItem.startMoment.format('MM-DD')}~${eventItem.endMoment.format('MM-DD')}`,
                content: eventItem.content,
                colspan: durationDays
              }
            } else {
              event = {
                placehold: true
              }
            }
            day.events.push(event)
          }
        })
        return day
      })
      return week
    },
    maxCount () {
      return Math.max.apply(null, this.eventsWeek.map(day => day.events.length))
    }
  }
}
</script>

<style lang="css">
</style>
