// export const strict = false
//
// export const state = () => ({
//   charges: []
// })
//
// export const getters = {
//   charges: state => state.charges
// }
//
// export const mutations = {
//   fleshCharges(state){
//     if (state.charges) {
//       state.charges = []
//     }
//   },
//   addCharges(state, { charge }) {
//     if (state.charges.find(p => p.info.cid === charge.info.cid)) {
//       return
//     }
//
//     state.charges = [...state.charges, charge]
//   }
// }
//
// export const actions = {
//   async fetchCharges({ commit, state }) {
//     try {
//       let charges = []
//       let chargesSnapshot
//       let fetchCharge = this.$firefunctions.httpsCallable('fetchCharge');
//       await fetchCharge().then(function(result) {
//         chargesSnapshot = result.data.charges;
//       }).catch(function(error) {
//         console.log(error)
//       });
//       chargesSnapshot.forEach(chargeSnapshot => {
//         const charge = {}
//         const info = chargeSnapshot
//         charge.info = info
//         charges.push(charge)
//       })
//       charges.forEach(charge => {
//         commit('addCharges', { charge })
//       })
//       return charges
//     } catch (e) {
//     } finally {
//
//     }
//   }
// }
