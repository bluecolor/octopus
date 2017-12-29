
import _ from 'lodash'

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
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(payload[k])}`)
    .value()
    .join('&')
}

export {
  getLabelByStatus,
  toUrlString
}
