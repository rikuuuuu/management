export const strict = false

export const state = () => ({
  purchases: []
})

export const getters = {
  purchases: state => state.purchases
}

export const mutations = {
  fleshPurchases(state){
    if (state.purchases) {
      state.purchases = []
    }
  },
  addPurchases(state, { purchase }) {
    if (state.purchases.find(p => p.info.pid === purchase.info.pid)) {
      return
    }

    state.purchases = [...state.purchases, purchase]
  }
}

export const actions = {
  async fetchPartnersPurchases({ commit, state }, { talks }) {
    try {
      let purchases = []
      let purchasesSnapshot
      let fetchPurchase = this.$firefunctions.httpsCallable('fetchPurchase');
      await fetchPurchase().then(function(result) {
        purchasesSnapshot = result.data.purchases;
      }).catch(function(error) {
        console.log(error)
      });
      purchasesSnapshot.forEach(purchaseSnapshot => {
        let snapshot = talks.find(p => p.chat.tid === purchaseSnapshot.talkId)
        if (snapshot) {
          const purchase = {}
          const info = purchaseSnapshot
          purchase.pay = pay
          purchases.push(purchase)
        }
      })
      purchases.forEach(purchase => {
        commit('addPurchases', { purchase })
      })
      // await talks.forEach(talk => {
      //   // console.log(talk)
      //   this.$firestore
      //     .collection('purchase')
      //     .where('talkId', '==', talk.chat.tid)
      //     .get()
      //     .then(function(querySnapshot) {
      //       querySnapshot.forEach(function(doc) {
      //         const payment = {}
      //         const pay = doc.data()
      //         payment.pay = pay
      //         // talks.push(talk)
      //         commit('addPayments', { payment })
      //     })
      //   })
      // })
      return purchases
    } catch (e) {
    } finally {

    }
  },
  async fetchPurchases({ commit, state }) {
    try {
      let purchases = []
      let purchasesSnapshot
      let fetchPurchase = this.$firefunctions.httpsCallable('fetchPurchase');
      await fetchPurchase().then(function(result) {
        purchasesSnapshot = result.data.purchases;
      }).catch(function(error) {
        console.log(error)
      });
      purchasesSnapshot.forEach(purchaseSnapshot => {
        const purchase = {}
        const info = purchaseSnapshot
        purchase.pay = pay
        purchases.push(purchase)
      })
      purchases.forEach(purchase => {
        commit('addPurchases', { purchase })
      })
      return purchases
    } catch (e) {
    } finally {

    }
  }
}
