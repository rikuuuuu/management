export const strict = false

export const state = () => ({
  refunds: []
})

export const getters = {
  refunds: state => state.refunds
}

export const mutations = {
  fleshRefunds(state){
    if (state.refunds) {
      state.refunds = []
    }
  },
  addRefunds(state, { refund }) {
    if (state.refunds.find(p => p.info.rid === refund.info.rid)) {
      return
    }

    state.refunds = [...state.refunds, refund]
  }
}

export const actions = {
  async fetchRefunds({ commit, state }) {
    try {
      let refunds = []
      let refundsSnapshot
      let fetchRefund = this.$firefunctions.httpsCallable('fetchRefund');
      await fetchRefund().then(function(result) {
        refundsSnapshot = result.data.refunds;
      }).catch(function(error) {
        console.log(error)
      });
      refundsSnapshot.forEach(refundSnapshot => {
        const refund = {}
        const info = refundSnapshot
        refund.info = info
        refunds.push(refund)
      })
      refunds.forEach(refund => {
        commit('addRefunds', { refund })
      })
      return refunds
    } catch (e) {
    } finally {

    }
  }
}
