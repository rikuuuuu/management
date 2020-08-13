export const strict = false

export const state = () => ({
  talents: [],
  aptalents: []
})

export const getters = {
  talents: state => state.talents,
  aptalents: state => state.aptalents
}

export const mutations = {
  fleshTalents(state){
    if (state.talents) {
      state.talents = []
    }
  },
  partnerTalnet(state, { ptalent }) {
    for ( var talent in state.aptalents ) {
      if (state.aptalents[talent].info.userid === ptalent.info.userid ) {
        state.aptalents.splice(talent, 1)
      }
    }
    for ( var talent in state.talents ) {
      if (state.talents[talent].info.userid === ptalent.info.userid ) {
        state.talents.splice(talent, 1)
      }
    }
  },
  addTalents(state, { talent }) {
    if (state.talents.find(p => p.info.userid === talent.info.userid)) {
      return
    }

    state.talents = [...state.talents, talent]
  },
  apTalent(state, { aptalent }) {
    for ( var talent in state.aptalents ) {
      if (state.aptalents[talent].info.userid === aptalent.info.userid ) {
        state.aptalents.splice(talent, 1)
      }
    }
    for ( var talent in state.talents ) {
      if (state.talents[talent].info.userid === aptalent.info.userid ) {
        state.talents.splice(talent, 1)
      }
    }
  },
  fleshapTalents(state){
    if (state.aptalents) {
      state.aptalents = []
    }
  },
  addAptalents(state, { aptalent }) {
    if (state.aptalents.find(p => p.info.userid === aptalent.info.userid)) {
      return
    }

    state.aptalents = [...state.aptalents, aptalent]
  }
}

export const actions = {
  async fetchPartnersTalents({ commit, state, dispatch }, { partnerid }) {
    try {
      let talents = []
      const talentsSnapshot = await this.$firestore
        .collection('users')
        .where('partnerId', '==', partnerid )
        .get()
      talentsSnapshot.forEach(talentSnapshot => {
        const talent = {}
        const info = talentSnapshot.data()
        talent.info = info
        talents.push(talent)
      })
      talents.forEach(talent => {
        commit('addTalents', { talent })
        if (talent.info.authStatus === 1) {
          let aptalent = talent
          commit('addAptalents', { aptalent })
        }
      })
      dispatch('talk/fetchPartnersTalks', { talents }, { root: true })
      dispatch('room/fetchPartnersRooms', { talents }, { root: true })
      return talents
    } catch (e) {
    } finally {

    }
  },
  async fetchTalents({ commit, state }) {
    try {
      let talents = []
      const talentsSnapshot = await this.$firestore
        .collection('users')
        .where('talent', '==', true)
        .get()
      talentsSnapshot.forEach(talentSnapshot => {
        const talent = {}
        const info = talentSnapshot.data()
        talent.info = info
        talents.push(talent)
      })
      talents.forEach(talent => {
        commit('addTalents', { talent })
        if (talent.info.authStatus === 1) {
          let aptalent = talent
          commit('addAptalents', { aptalent })
        }
      })
      return talents
    } catch (e) {
    } finally {

    }
  }
}
