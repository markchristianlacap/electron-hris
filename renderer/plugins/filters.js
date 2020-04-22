import moment from "moment"
import Vue from "vue"

function date(date) {
  return moment(date).format("dddd, MMM Do, YYYY")
}
const filters = { date }

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
