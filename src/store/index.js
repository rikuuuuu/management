export const strict = false

export const state = () => ({
  user: null,
  auth: false,
  adminpartner: null
})

export const getters = {
  auth: state => state.auth,
  adminpartner: state => state.adminpartner,
  isAuthenticated (state) {
    return !!state.user
  }
}

export const mutations = {
  changeAuth(state, auth) {
    state.auth = auth
  },
  partnerAuth(state, adminpartner) {
    state.adminpartner = adminpartner
  },
  setUser (state, payload) {
    state.user = payload
  }
}

export const actions = {
  setUser ({ commit }, payload) {
    commit('setUser', payload)
  }
}
