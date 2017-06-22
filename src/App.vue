<template>
  <div id="app">
    <h2>vue simple fullcalendar</h2>
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
        start: '2017-06-20',
        end: '2017-06-21',
        content: 'wow ~'
      }],
      today: moment().format('YYYY-MM-DD')
    }
  },
  methods: {
    clearCache () {
      this.cache.start = ''
      this.cache.end = ''
      this.cache.content = ''
    },
    addEvent () {
      let start = this.cache.start || this.today
      let end = this.cache.end || this.today
      let content = this.cache.content || 'default event content'
      this.events.push({
        start,
        end,
        content
      })
      this.clearCache()
    },
    removeEvent (index) {
      this.events.splice(index, 1)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
