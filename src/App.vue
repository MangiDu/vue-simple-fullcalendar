<template>
  <div id="app">
    <div class="header">
      <h2>vue simple fullcalendar</h2>
    </div>
    <simple-fullcalendar :events="events" @timeRangeSelected="addEvent2Events"></simple-fullcalendar>
    <div class="events-list">
      <p>* select in calendar to add event</p>
      <ul>
        <li v-for="(eventItem, index) in events">
          {{ eventItem.start }}~{{ eventItem.end }}: {{ eventItem.content }}
          <button type="button" name="button" @click="removeEvent(index)">x</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import simpleFullcalendar from './components/simple-fullcalendar'

const FORMATTER = 'YYYY-MM-DD'
let TODAY = moment()

export default {
  name: 'app',
  components: {
    simpleFullcalendar
  },
  data () {
    return {
      cache: {
        start: '',
        end: '',
        content: ''
      },
      events: [{
        start: TODAY.format(FORMATTER),
        end: TODAY.clone().add(1, 'day').format(FORMATTER),
        content: 'wow ~~~'
      }, {
        start: TODAY.format(FORMATTER),
        end: TODAY.clone().add(7, 'day').format(FORMATTER),
        content: 'so nice a simple fullcalendar with vue2 ~~~'
      }],
      today: TODAY.format(FORMATTER)
    }
  },
  methods: {
    clearCache () {
      this.cache.start = ''
      this.cache.end = ''
      this.cache.content = ''
    },
    removeEvent (index) {
      this.events.splice(index, 1)
    },
    addEvent2Events (event) {
      let content = window.prompt(`${event.start} ~ ${event.end}`)
      if (content && content.length) {
        this.events.push(Object.assign(event, {
          content
        }))
      }
    }
  }
}
</script>

<style lang="stylus">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #2c3e50
.header
  text-align: center
.events-list
  width: 800px
  margin: 0 auto
</style>
