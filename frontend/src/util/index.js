
import _ from 'lodash'
import moment from 'moment'

const getLabelByStatus = (s) => {
  if (_.isEmpty(s)) {
    return 'label-default'
  }
  switch (s.toUpperCase()) {
    case 'IDLE': return 'label-warning'
    case 'DONE': return 'label-success'
    case 'SUCCESS': return 'label-success'
    case 'ERROR': return 'label-danger'
    case 'KILLED': return 'label-danger'
    case 'BLOCKED': return 'label-default'
    case 'RUNNING': return 'label-info'
    case 'STOPPED': return 'label-danger'
  }
  return 'label-default'
}

const toUrlString = (payload) => {
  return _.chain(payload)
    .keys()
    .filter(k => payload[k])
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(payload[k])}`)
    .value()
    .join('&')
}

const dateString = (x) => {
  return moment.unix(x / 1000).format('YYYY-MM-DD HH:mm')
}

export {
  getLabelByStatus,
  toUrlString,
  dateString
}
