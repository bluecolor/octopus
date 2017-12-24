
import _ from 'lodash'
import api from '../../api/arch'
import store from '../'
import {success as notifySuccess, error as notifyError} from '../../lib/notify'

const DELETE_PHYSICAL_AGENT = 'DELETE_PHYSICAL_AGENT'
const RESET_PHYSICAL_AGENTS = 'RESET_PHYSICAL_AGENTS'
const LOAD_PHYSICAL_AGENTS = 'LOAD_PHYSICAL_AGENTS'
const CREATE_PHYSICAL_AGENT = 'CREATE_PHYSICAL_AGENT'
const UPDATE_PHYSICAL_AGENT = 'UPDATE_PHYSICAL_AGENT'
const CREATE_PHYSICAL_SCHEMA = 'CREATE_PHYSICAL_SCHEMA'
const CREATE_LOGICAL_SCHEMA = 'CREATE_LOGICAL_SCHEMA'

const RESET_LOGICAL_AGENTS = 'RESET_LOGICAL_AGENTS'
const LOAD_LOGICAL_AGENTS = 'LOAD_LOGICAL_AGENTS'
const CREATE_LOGICAL_AGENT = 'CREATE_LOGICAL_AGENT'
const UPDATE_LOGICAL_AGENT = 'UPDATE_LOGICAL_AGENT'
const DELETE_LOGICAL_AGENT = 'DELETE_LOGICAL_AGENT'

const RESET_TECHNOLOGIES = 'RESET_TECHNOLOGIES'
const LOAD_TECHNOLOGIES = 'LOAD_TECHNOLOGIES'
const DELETE_TECHNOLOGY = 'DELETE_TECHNOLOGY'

const RESET_CONTEXTS = 'RESET_CONTEXTS'
const LOAD_CONTEXTS = 'LOAD_CONTEXTS'
const CREATE_CONTEXT = 'CREATE_CONTEXT'
const DELETE_CONTEXT = 'DELETE_CONTEXT'

const CREATE_DATA_SERVER = 'CREATE_DATA_SERVER'
const UPDATE_DATA_SERVER = 'UPDATE_DATA_SERVER'
const DELETE_DATA_SERVER = 'DELETE_DATA_SERVER'

const state = {
  technologies: [],
  agents: {
    logical: [],
    physical: []
  },
  contexts: []
}

const getters = {
  contexts: state => state.contexts,
  physicalAgents: state => state.agents.physical,
  logicalAgents: state => state.agents.logical,
  technologies: state => state.technologies,
  dataServers: state => technologyId => _.find(state.technologies, {internalId: parseInt(technologyId)}).dataServers,
  physicalSchema: state => (technologyId, dataServerId, physicalSchemaId) => {
    const dataServers = _.find(state.technologies, {internalId: parseInt(technologyId)}).dataServers
    const ds = _.find(dataServers, {internalId: parseInt(dataServerId)})
    return _.find(ds.physicalSchemas, {internalId: parseInt(physicalSchemaId)})
  },
  logicalSchemas: state => technologyId => _.find(state.technologies, {internalId: parseInt(technologyId)}).logicalSchemas,
  allLogicalSchemas: state => {
    return _.chain(state.technologies).map(tech => tech.logicalSchemas).flatten().value()
  },
  allPhysicalSchemas: state => {
    return _.chain(state.technologies)
      .map(tech => tech.dataServers)
      .flatten()
      .map(ds => ds.physicalSchemas)
      .flatten()
      .value()
  }
}

// actions
const actions = {
  deleteContext ({commit}, context) {
    const connectionId = store.state.connectionId
    api.deleteContext(connectionId, context.internalId).then(response => {
      commit(DELETE_CONTEXT, response.data.internalId)
      notifySuccess(`Deleted context ${context.name}`)
    },
    error => {
      console.log(error)
      notifyError(`Failed to delete context ${context.name}`)
    })
  },
  createContext ({commit}, payload) {
    const connectionId = store.state.connectionId
    api.createContext(connectionId, payload).then(response => {
      commit(CREATE_CONTEXT, response.data)
      notifySuccess(`Created context`)
    },
    error => {
      console.log(error)
      notifyError(`Failed to create context`)
    })
  },
  createLogicalAgent ({commit}, payload) {
    const connectionId = store.state.connectionId
    api.createLogicalAgent(connectionId, payload).then(response => {
      commit(CREATE_LOGICAL_AGENT, response.data)
      notifySuccess(`Created agent`)
    },
    error => {
      console.log(error)
      notifyError(`Failed to create logical agent`)
    })
  },
  updateLogicalAgent ({commit}, payload) {
    const connectionId = store.state.connectionId
    api.updateLogicalAgent(connectionId, payload).then(response => {
      commit(UPDATE_LOGICAL_AGENT, response.data)
      notifySuccess(`Updated logical agent`)
    },
    error => {
      console.log(error)
      notifyError(`Failed to update logical agent`)
    })
  },
  deleteDataServer ({commit}, dataServerId) {
    const connectionId = store.state.connectionId
    const dataServer = _.chain(state.technologies)
      .map(t => t.dataServers)
      .flatten()
      .find({internalId: parseInt(dataServerId)})
      .value()
    api.deleteDataServer(connectionId, dataServerId).then(response => {
      commit(DELETE_DATA_SERVER, dataServerId)
      notifySuccess(`Deleted data server ${dataServer.name}`)
    },
    error => {
      console.log(error)
      notifyError(`Failed to delete data server ${dataServer.name}`)
    })
  },
  updateDataServer ({commit}, payload) {
    const connectionId = store.state.connectionId
    api.updateDataServer(connectionId, payload.technologyId, payload.dataServer).then(response => {
      payload.data = response.data
      commit(UPDATE_DATA_SERVER, payload)
      notifySuccess('Data server updated')
    },
    error => {
      console.log(error)
      notifyError('Failed to update data server')
    })
  },
  createDataServer ({commit}, payload) {
    const connectionId = store.state.connectionId
    api.createDataServer(connectionId, payload.technologyId, payload.dataServer).then(response => {
      payload.data = response.data
      commit(CREATE_DATA_SERVER, payload)
      notifySuccess('Data server created')
    },
    error => {
      console.log(error)
      notifyError('Failed to create data server')
    })
  },
  createPhysicalSchema ({commit}, payload) {
    const connectionId = store.state.connectionId
    api.createPhysicalSchema(connectionId, payload.dataServerId, payload.data).then(response => {
      commit(CREATE_PHYSICAL_SCHEMA, response.data)
      notifySuccess('Physical schema created')
    },
    error => {
      console.log(error)
      notifyError('Unable create physical schema')
    })
  },
  createLogicalSchema ({commit}, payload) {
    const connectionId = store.state.connectionId
    api.createLogicalSchema(connectionId, payload.technologyId, payload.logicalSchema).then(response => {
      commit(CREATE_LOGICAL_SCHEMA, response.data)
      notifySuccess('Created logical schema')
    },
    error => {
      console.log(error)
      notifyError('Unable create logical schema')
    })
  },
  findAllContexts ({commit}) {
    const connectionId = store.state.connectionId
    api.findAllContexts(connectionId).then(response => {
      commit(LOAD_CONTEXTS, response.data)
    },
    error => {
      console.log(error)
      commit(RESET_CONTEXTS)
      notifyError('Unable to get contexts!')
    })
  },
  testDataServer ({commit}, payload) {
    const connectionId = store.state.connectionId
    api.testDataServer(connectionId, payload.dataServerId, payload.agentId).then(response => {
      notifySuccess('Connection works')
    },
    error => {
      console.log(error)
      notifyError('Connection not working')
    })
  },
  findTechnologies ({ commit }) {
    const connectionId = store.state.connectionId
    api.findTechnologies(connectionId).then(response => {
      commit(LOAD_TECHNOLOGIES, response.data)
    },
    error => {
      console.log(error)
      commit(RESET_TECHNOLOGIES)
      notifyError('Unable get technology list')
    })
  },
  deleteTechnology ({commit}, technologyId) {
    const connectionId = store.state.connectionId
    const technology = _.find(state.physical.technologies.all, {internalId: technologyId})
    api.deleteTechnology(connectionId, technologyId).then(response => {
      commit(DELETE_TECHNOLOGY, response.data)
      notifySuccess(`Technology ${technology.name} deleted`)
    },
    error => {
      console.log(error)
      notifyError(`Unable delete technology ${technology.name}`)
    })
  },
  findPhysicalAgents ({ commit }) {
    const connectionId = store.state.connectionId
    api.findPhysicalAgents(connectionId).then(response => {
      commit(LOAD_PHYSICAL_AGENTS, response.data)
    },
    error => {
      console.log(error)
      commit(RESET_PHYSICAL_AGENTS)
      notifyError('Unable get physical agents')
    })
  },
  findLogicalAgents ({ commit }) {
    const connectionId = store.state.connectionId
    api.findLogicalAgents(connectionId).then(response => {
      commit(LOAD_LOGICAL_AGENTS, response.data)
    },
    error => {
      console.log(error)
      commit(RESET_LOGICAL_AGENTS)
      notifyError('Unable get logical agents')
    })
  },
  createPhysicalAgent ({commit}, payload) {
    const connectionId = store.state.connectionId
    return api.createPhysicalAgent(connectionId, payload).then(response => {
      commit(CREATE_PHYSICAL_AGENT, response.data)
      notifySuccess(`Agent ${response.data.name} created`)
    },
    error => {
      console.log(error)
      notifyError(`${error.data.error.message}`)
    })
  },
  updatePhysicalAgent ({commit}, payload) {
    const connectionId = store.state.connectionId
    console.log(payload)
    return api.updatePhysicalAgent(connectionId, payload).then(response => {
      commit(UPDATE_PHYSICAL_AGENT, response.data)
      notifySuccess(`Agent ${response.data.name} updated`)
    },
    error => {
      console.log(error)
      notifyError(`Unable to update agent`)
    })
  },
  testPhysicalAgent ({ commit }, agentId) {
    const agent = _.find(state.physical.agents.all, {agentId: agentId})
    const connectionId = store.state.connectionId
    api.testPhysicalAgent(connectionId, agentId).then(response => {
      notifySuccess(`Agent ${agent.name} works`)
    },
    error => {
      console.log(error.response.data.message)
      notifyError(`Agent ${agent.name} not working`)
    })
  },
  deletePhysicalAgent ({ commit }, agentId) {
    const agent = _.find(state.agents.physical, {agentId: agentId})
    const connectionId = store.state.connectionId
    api.deletePhysicalAgent(connectionId, agentId).then(response => {
      commit(DELETE_PHYSICAL_AGENT, agentId)
      notifySuccess(`Agent ${agent.name} removed`)
    },
    error => {
      console.log(error)
      notifyError(`Failed to remove ${agent.name}`)
    })
  },
  deleteLogicalAgent ({ commit }, agentId) {
    const agent = _.find(state.agents.logical, {agentId: agentId})
    const connectionId = store.state.connectionId
    api.deleteLogicalAgent(connectionId, agentId).then(response => {
      commit(DELETE_LOGICAL_AGENT, agentId)
      notifySuccess(`Agent ${agent.name} removed`)
    },
    error => {
      console.log(error)
      notifyError(`Failed to remove ${agent.name}`)
    })
  }
}

// mutations
const mutations = {
  [RESET_PHYSICAL_AGENTS] (state) {
    state.agents.physical = []
  },
  [LOAD_PHYSICAL_AGENTS] (state, records) {
    state.agents.physical = records
  },
  [RESET_LOGICAL_AGENTS] (state) {
    state.agents.logical = []
  },
  [LOAD_LOGICAL_AGENTS] (state, records) {
    state.agents.logical = records
  },
  [CREATE_LOGICAL_AGENT] (state, record) {
    state.agents.logical.push(record)
  },
  [UPDATE_LOGICAL_AGENT] (state, record) {
    const i = _.findIndex(state.agents.logical, {agentId: record.agentId})
    state.agents.logical.splice(i, 1)
    state.agents.logical.push(record)
  },
  [DELETE_LOGICAL_AGENT] (state, agentId) {
    const i = _.findIndex(state.agents.logical, {agentId: agentId})
    state.agents.logical.splice(i, 1)
  },
  [DELETE_PHYSICAL_AGENT] (state, agentId) {
    const i = _.findIndex(state.agents.physical, {agentId: agentId})
    state.agents.physical.splice(i, 1)
  },
  [RESET_TECHNOLOGIES] (state, records) {
    state.technologies = []
  },
  [LOAD_TECHNOLOGIES] (state, records) {
    state.technologies = records
  },
  [DELETE_TECHNOLOGY] (state, record) {
    const i = _.findIndex(state.technologies, {internalId: record.internalId})
    state.technologies.splice(i, 1)
  },
  [CREATE_PHYSICAL_AGENT] (state, record) {
    state.agents.physical.push(record)
  },
  [UPDATE_PHYSICAL_AGENT] (state, record) {
    let agent = _.find(state.agents.physical, {agentId: record.agentId})
    _.assign(agent, record)
  },
  [CREATE_PHYSICAL_SCHEMA] (state, record) {
    const dataServerId = record.dataServer.internalId
    const dataServer = _.chain(state.technologies)
      .map(t => t.dataServers)
      .flatten()
      .find({internalId: dataServerId})
      .value()
    dataServer.physicalSchemas.push(record)
  },
  [CREATE_LOGICAL_SCHEMA] (state, record) {
    const technologyId = record.technology.internalId
    _.find(state.technologies, {internalId: technologyId}).logicalSchemas.push(record)
  },
  [RESET_CONTEXTS] (state) {
    state.contexts = []
  },
  [LOAD_CONTEXTS] (state, records) {
    state.contexts = records
  },
  [CREATE_CONTEXT] (state, context) {
    state.contexts.push(context)
  },
  [DELETE_CONTEXT] (state, contextId) {
    const i = _.findIndex(state.contexts, {internalId: contextId})
    state.contexts.splice(i, 1)
  },
  [CREATE_DATA_SERVER] (state, payload) {
    const technology = _.find(state.technologies, {internalId: parseInt(payload.technologyId)})
    technology.dataServers.push(payload.data)
  },
  [UPDATE_DATA_SERVER] (state, payload) {
    const dataServers = _.find(state.technologies, {internalId: parseInt(payload.technologyId)}).dataServers
    const i = _.findIndex(dataServers, {internalId: payload.data.internalId})
    dataServers.splice(i, 1)
    dataServers.push(payload.data)
  },
  [DELETE_DATA_SERVER] (state, dataServerId) {
    dataServerId = parseInt(dataServerId)
    let technology = _.find(state.technologies, t => {
      return t.dataServers.map(d => d.internalId).indexOf(dataServerId) > -1
    })
    const i = _.findIndex(technology.dataServers, {internalId: dataServerId})
    technology.dataServers.splice(i, 1)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
