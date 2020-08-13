export const strict = false

export const state = () => ({
  partners: []
})

export const getters = {
  partners: state => state.partners
}

export const mutations = {
  fleshPartners(state){
    if (state.partners) {
      state.partners = []
    }
  },
  addPartners(state, { partner }) {
    if (state.partners.find(p => p.pal.id === partner.pal.id)) {
      return
    }

    state.partners = [...state.partners, partner]
  }
}

export const actions = {
  async fetchPartners({ commit, state }) {
    try {
      let partners = []
      const partnersSnapshot = await this.$firestore
        .collection('partners')
        .get()
      partnersSnapshot.forEach(partnerSnapshot => {
        const partner = {}
        const pal = partnerSnapshot.data()
        partner.pal = pal
        partners.push(partner)
      })
      partners.forEach(partner => {
        commit('addPartners', { partner })
      })
      return partner
    } catch (e) {
    } finally {

    }
  }
}
