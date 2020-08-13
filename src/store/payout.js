export const strict = false

export const state = () => ({
  payouts: []
})

export const getters = {
  payouts: state => state.payouts
}

export const mutations = {
  fleshPayouts(state){
    if (state.payouts) {
      state.payouts = []
    }
  },
  addPayouts(state, { payout }) {
    if (state.payouts.find(p => p.pay.wid === payout.pay.wid)) {
      return
    }

    state.payouts = [...state.payouts, payout]
  }
}

export const actions = {
  async fetchPayouts({ commit, state }) {
    try {
      let payouts = []
      let payoutsSnapshot
      let fetchWithdraw = this.$firefunctions.httpsCallable('fetchWithdraw');
      await fetchWithdraw().then(function(result) {
        payoutsSnapshot = result.data.withdraw;
      }).catch(function(error) {
        console.log(error)
      });
      payoutsSnapshot.forEach(payoutSnapshot => {
        const payout = {}
        const pay = payoutSnapshot
        payout.pay = pay
        payouts.push(payout)
      })
      payouts.forEach(payout => {
        commit('addPayouts', { payout })
      })
      return payouts

      // let payouts = []
      // const payoutsSnapshot = await this.$firestore
      //   .collection('withdraw')
      //   .get()
      // payoutsSnapshot.forEach(payoutSnapshot => {
      //   const payout = {}
      //   const pay = payoutSnapshot.data()
      //   payout.pay = pay
      //   payouts.push(payout)
      // })
      // payouts.forEach(payout => {
      //   commit('addPayouts', { payout })
      // })
      // return payouts
    } catch (e) {
    } finally {

    }
  }
}
