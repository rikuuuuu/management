export const strict = false

export const state = () => ({
  talks: []
})

export const getters = {
  talks: state => state.talks
}

export const mutations = {
  fleshTalks(state){
    if (state.talks) {
      state.talks = []
    }
  },
  addTalks(state, { talk }) {

    if (state.talks.find(p => p.chat.tid === talk.chat.tid)) {
      return
    }
    state.talks = [...state.talks, talk]
  }
}

export const actions = {
  async fetchPartnersTalks({ commit, state, dispatch }, { talents }) {
    try {
      // 他にいいやり方が見つからずこうなってます
      let talks = []
      const talksSnapshot = await this.$firestore
        .collection('talks')
        .get()
      talksSnapshot.forEach(talkSnapshot => {
        let snapshot = talents.find(p => p.info.userid === talkSnapshot.data().talentId)
        if (snapshot) {
          const talk = {}
          const chat = talkSnapshot.data()
          talk.chat = chat
          talks.push(talk)
        }
      })
      talks.forEach(talk => {
        commit('addTalks', { talk })
      })
      // await talents.forEach(talent => {
      //   this.$firestore
      //     .collection('talks')
      //     .where('talentId', '==', talent.info.userid)
      //     .get()
      //     .then(function(querySnapshot) {
      //       querySnapshot.forEach(function(doc) {
      //         const talk = {}
      //         const chat = doc.data()
      //         talk.chat = chat
      //         talks.push(talk)
      //         commit('addTalks', { talk })
      //     })
      //   })
      // })
      dispatch('payment/fetchPartnersPayments', { talks }, { root: true })
      return talks
    } catch (e) {
    } finally {

    }
  },
  async fetchTalks({ commit, state }) {
    try {
      let talks = []
      const talksSnapshot = await this.$firestore
        .collection('talks')
        .get()
      talksSnapshot.forEach(talkSnapshot => {
        const talk = {}
        const chat = talkSnapshot.data()
        talk.chat = chat
        talks.push(talk)
      })
      talks.forEach(talk => {
        commit('addTalks', { talk })
      })
      return talks
    } catch (e) {
    } finally {

    }
  }
}
