<template>
  <div id="app">
    <div class="header">
      <h2>vue simple fullcalendar</h2>
    </div>
    <simple-fullcalenadr :events="events"></simple-fullcalenadr>
    <div class="">
      <ul>
        <li v-for="(eventItem, index) in events">
          {{ eventItem.start }}~{{ eventItem.end }}: {{ eventItem.content }}
          <button type="button" name="button" @click="removeEvent(index)">x</button>
        </li>
        <li>
          <label>start:</label><input type="text" name="start" v-model="cache.start">
          <label>end:</label><input type="text" name="end" v-model="cache.end">
          <label>content:</label><input type="text" name="content" v-model="cache.content">
          <button type="button" name="button" @click="addEvent()">add</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import simpleFullcalenadr from './components/simple-fullcalendar'

const FORMATTER = 'YYYY-MM-DD'
let TODAY = moment()
let INVALID_PATTERN = /Invalid Date/i

export default {
  name: 'app',
  components: {
    simpleFullcalenadr
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
    addEvent () {
      try {
        let start = moment(new Date(this.cache.start || this.today)).format(FORMATTER)
        let end = moment(new Date(this.cache.end || this.today)).format(FORMATTER)
        if (!INVALID_PATTERN.test(start) && !(INVALID_PATTERN.test(end))) {
          let content = this.cache.content || 'default event content'
          this.events.push({
            start,
            end,
            content
          })
        } else {
          let error = new Error('wrong date!')
          throw error
        }
      } catch (err) {
        alert('Got a wrong date!')
      }
      this.clearCache()
    },
    removeEvent (index) {
      this.events.splice(index, 1)
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
</style>
