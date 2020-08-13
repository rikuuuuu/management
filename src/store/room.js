export const strict = false

export const state = () => ({
  rooms: []
})

export const getters = {
  rooms: state => state.rooms
}

export const mutations = {
  fleshRooms(state){
    if (state.rooms) {
      state.rooms = []
    }
  },
  addRooms(state, { room }) {
    if (state.rooms.find(p => p.talkroom.rid === room.talkroom.rid)) {
      return
    }

    state.rooms = [...state.rooms, room]
  }
}

export const actions = {
  async fetchPartnersRooms({ commit, state }, { talents }) {
    try {
      // 他にいいやり方が見つからずこうなってます
      await talents.forEach(talent => {
        this.$firestore
          .collection('rooms')
          .where('talentId', '==', talent.info.userid)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              const room = {}
              const talkroom = doc.data()
              room.talkroom = talkroom
              commit('addRooms', { room })
          })
        })
      })
      return rooms
    } catch (e) {
    } finally {

    }
  },
  async fetchRooms({ commit, state }) {
    try {
      let rooms = []
      const roomsSnapshot = await this.$firestore
        .collection('rooms')
        .get()
      roomsSnapshot.forEach(roomSnapshot => {
        const room = {}
        const talkroom = roomSnapshot.data()
        room.talkroom = talkroom
        rooms.push(room)
      })
      rooms.forEach(room => {
        commit('addRooms', { room })
      })
      return rooms
    } catch (e) {
    } finally {

    }
  }
}
