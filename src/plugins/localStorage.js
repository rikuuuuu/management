import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    paths: [
      'auth',
      'adminpartner',
      'fan.fans',
      'talent.talents',
      'fan.apfans',
      'talent.aptalents',
      'payment.payments',
      'payout.payouts',
      'room.rooms',
      'talk.talks',
      'partner.partners',
      // 'record.records'
    ]
  })(store)
}
