export const strict = false

export const state = () => ({
  records: []
})

export const getters = {
  records: state => state.records
}

export const mutations = {
  fleshRecords(state){
    if (state.records) {
      state.records = []
    }
  },
  addRecords(state, { record }) {
    if (state.records.find(p => p.info.sId === record.info.sId)) {
      return
    }

    state.records = [...state.records, record]
  }
}

export const actions = {
  // 本番用　タレントレコードを配列の0に入れる
  // async fetchRecords({ commit, state }, { talkId }) {
  //   try {
  //     let records = []
  //     const recordsSnapshot = await this.$firestore
  //       .collection('records')
  //       .where('talkId', '==', talkId)
  //       .get()
  //     recordsSnapshot.forEach(recordSnapshot => {
  //       const record = {}
  //       const info = recordSnapshot.data()
  //       record.info = info
  //       if (record.info.talent === true) {
  //         records[0] = record
  //         console.log('records true', records)
  //       } else {
  //         records[1] = record
  //         console.log('records false', records)
  //       }
  //     })
  //     records.forEach(record => {
  //       commit('addRecords', { record })
  //     })
  //     return records
  //   } catch (e) {
  //   } finally {
  //
  //   }
  // }
  async fetchRecords({ commit, state }, { talkId }) {
    try {
      let records = []
      const recordsSnapshot = await this.$firestore
        .collection('records')
        .where('talkId', '==', talkId)
        .get()
      recordsSnapshot.forEach(recordSnapshot => {
        const record = {}
        const info = recordSnapshot.data()
        record.info = info
        records.push(record)
      })
      records.forEach(record => {
        commit('addRecords', { record })
      })
      return records
    } catch (e) {
    } finally {

    }
  }
}
