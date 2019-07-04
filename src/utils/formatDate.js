import moment from 'moment'

export default function formatDate(time) {
  if (time) {
    return moment(time).format("YYYY-MM-DD hh:mm:ss")
  }
  return moment().format("YYYY-MM-DD hh:mm:ss")
}