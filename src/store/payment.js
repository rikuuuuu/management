export const strict = false

export const state = () => ({
  payments: []
})

export const getters = {
  payments: state => state.payments
}

export const mutations = {
  fleshPayments(state){
    if (state.payments) {
      state.payments = []
    }
  },
  addPayments(state, { payment }) {
    if (state.payments.find(p => p.pay.pid === payment.pay.pid)) {
      return
    }

    state.payments = [...state.payments, payment]
  }
}

export const actions = {
  async fetchPartnersPayments({ commit, state }, { talks }) {
    try {
      let payments = []
      let paymentsSnapshot
      let fetchPayment = this.$firefunctions.httpsCallable('fetchPayment');
      await fetchPayment().then(function(result) {
        paymentsSnapshot = result.data.payments;
      }).catch(function(error) {
        console.log(error)
      });
      paymentsSnapshot.forEach(paymentSnapshot => {
        let snapshot = talks.find(p => p.chat.tid === paymentSnapshot.talkId)
        if (snapshot) {
          const payment = {}
          const pay = paymentSnapshot
          payment.pay = pay
          payments.push(payment)
        }
      })
      payments.forEach(payment => {
        commit('addPayments', { payment })
      })
      return payments
    } catch (e) {
    } finally {

    }
  },
  async fetchPayments({ commit, state }) {
    try {
      let payments = []
      let paymentsSnapshot
      let fetchPayment = this.$firefunctions.httpsCallable('fetchPayment');
      await fetchPayment().then(function(result) {
        paymentsSnapshot = result.data.payments;
      }).catch(function(error) {
        console.log(error)
      });
      paymentsSnapshot.forEach(paymentSnapshot => {
        const payment = {}
        const pay = paymentSnapshot
        payment.pay = pay
        payments.push(payment)
      })
      payments.forEach(payment => {
        commit('addPayments', { payment })
      })
      return payments
    } catch (e) {
    } finally {

    }
  }
}
