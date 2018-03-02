export default {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  LOAD_VERSION (state, version) {
    state.version.major = version.major.split('=')[1]
    state.version.minor = version.minor.split('=')[1]
    state.version.versionCode = version.versionCode.split('=')[1]
    state.version.date = version.date.substring(1)
  },
  SET_CONNECTION (state, connectionId) {
    state.connectionId = connectionId
  }
}
