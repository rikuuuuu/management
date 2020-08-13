<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'入出金一覧'">
      <div class="home-container">
        <div class="fans-contents main-contents">
          <div class="fans-title flex">
            <h2>入出金</h2>
            <div class="search flex sort">
              <button v-bind:class="{ selectedday: payt }" @click="changeState" type="button" name="button">出品者</button>
              <button v-bind:class="{ selectedday: !payt }" @click="changeState" type="button" name="button">パートナー</button>
              <input v-show="payt" v-model="selectName" type="text" name="" value="" placeholder="出品者名 検索">
              <input v-show="!payt" v-model="selectpName" type="text" name="" value="" placeholder="パートナー名 検索">
            </div>
          </div>
          <div class="sales-title flex">
            <button @click="beforemonth" class="leftb" type="button" name="button">＜</button>
            <h3 class="currentm">{{ currentMonth }}月</h3>
            <button @click="nextmonth" class="rightb" type="button" name="button">＞</button>
          </div>
          <div class="">
            <h3 v-show="payt">出品者</h3>
            <h3 v-show="!payt">パートナー</h3>
          </div>
          <div class="flex listslabel">
            <p>振込日</p>
            <p v-show="payt">出品者名</p>
            <p v-show="!payt">パートナー名</p>
            <p v-show="payt">本名</p>
            <p v-show="!payt"></p>
            <p>金額</p>
            <p>ステータス</p>
          </div>
          <div v-show="payt" class="">
            <ul v-show="payouts.length !== 0 && talents.length !== 0" class="lists list-box-shadow">
              <All-Payments v-bind:currentMonth="currentMonth" v-for="(payout, index) in payouts" :key="index" :payout="payout" />
            </ul>
            <p class="no-talks" v-show="payouts.length === 0">入出金の予定はありません</p>
          </div>
          <div v-show="!payt" class="">
            <ul v-show="partners.length !== 0 && talents.length !== 0 && payments.length !== 0" class="lists list-box-shadow">
              <All-Payments v-bind:currentMonth="currentMonth" v-for="(partner, index) in partners" :key="index" :partner="partner" />
            </ul>
            <p class="no-talks" v-show="partners.length === 0">入出金の予定はありません</p>
          </div>
        </div>
      </div>
    </menu-head>
  </div>
</template>

<script>
import MenuHead from '~/components/MenuHead'
import AllPayments from '~/components/AllPayments'

export default {
  data() {
    return {
      loading: true,
      pageloading: true,
      currentMonth: '',
      payt: true,
      selectName: '',
      selectpName: '',
      sort: {
        key: '',
        isAsc: false
      }
    }
  },
  components: {
    MenuHead,
    AllPayments
  },
  created() {
    this.pageloading = false
    // 仮
    // this.$store.commit('fleshPayouts')
    // this.fetch(0)
    // this.fetch(1)
    // this.fetch(2)
  },
  async mounted() {
    this.$store.commit('payout/fleshPayouts')
    this.currentmonth()
    this.$store.dispatch('payout/fetchPayouts')
    this.$store.dispatch('talent/fetchTalents')
    this.$store.dispatch('payment/fetchPayments')
    this.$store.dispatch('partner/fetchPartners')
    this.loading = false
  },
  methods: {
    changeState() {
      if (this.payt) {
        this.payt = false
      } else {
        this.payt = true
      }
      this.currentmonth()
    },
    currentmonth() {
      var now = new Date;
      var month = this.$dayjs(now).format('YYYY / M')
      this.currentMonth = month
    },
    beforemonth() {
      this.currentMonth = this.$dayjs(this.currentMonth).add(-1, 'month').format('YYYY / M')
    },
    nextmonth() {
      this.currentMonth = this.$dayjs(this.currentMonth).add(1, 'month').format('YYYY / M')
    },
    sortBy: function(key) {
      this.sort.isAsc = this.sort.key === key ? !this.sort.isAsc : false;
      this.sort.key = key;
    },
    sortedClass: function(key) {
      return this.sort.key === key ? `sorted ${this.sort.isAsc ? 'asc' : 'desc' }` : '';
    },
    fetch(month) {
      this.$firestore.collection('users').where('talent', '==', true).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

          const talent = doc.data()

          var pays = false

          const payment = {
            talent: {},
            payout: {},
            pay: []
          }

          this.$set(payment, 'talent', talent)

          this.$firestore.collection('payouts').where('talentId', '==', talent.userid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

              const payout = doc.data()

              const payoutat = this.$dayjs(payout.payoutAt.seconds * 1000).format('YYYY/MM')
              const now = new Date
              const Nowmonth = this.$dayjs(now).add(-month+1, 'month').format('YYYY/MM')

              if ( payoutat === Nowmonth ) {
                this.$set(payment, 'payout', payout)
              }

            })
          }).catch(function(error) {

          })

          this.$firestore.collection('payments').where('talentId', '==', talent.userid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

              const pay = doc.data()

              const createdat = this.$dayjs(pay.createdAt.seconds * 1000).format('YYYY/MM')
              const now = new Date
              const nowmonth = this.$dayjs(now).add(-month, 'month').format('YYYY/MM')

              if ( createdat === nowmonth ) {
                payment.pay.push(pay)
                pays = true
              }

              this.loading = false

            })
          }).then(() => {

            if ( pays === true ) {
              this.$store.commit('addPayouts', { payment })
            }

          }).catch(function(error) {

          })

        })
      }).catch(function(error) {

      })

      // 仮
      this.loading = false

    }
  },
  computed: {
    partners() {
      var items = this.$store.getters['partner/partners']
      var list = items.slice();

      // 0円非表示
      if (list) {
        list = list.filter(element => {

          var payout = 0

          var ptalents = []
          var lastmonthpay = []
          var lastmonth = this.$dayjs(this.currentMonth).add(-1, 'month').format('YYYY / M')

          for ( var n in this.talents ) {
            if ( element.pal.id === this.talents[n].info.partnerId ) {
              ptalents.push(this.talents[n])
            }
          }

          for ( var n in this.payments ) {
            var ptime = this.$dayjs(this.payments[n].pay.purchaseTime * 1000).format('YYYY / M')
            if (lastmonth === ptime) {
              lastmonthpay.push(this.payments[n])
            }
          }

          for ( var p in lastmonthpay ) {
            for ( var t in ptalents ) {
              if ( lastmonthpay[p].pay.talentId === ptalents[t].info.userid ) {
                payout += lastmonthpay[p].pay.price
              }
            }
          }

          if ( payout > 0 ) {
            return element
          }

        })
      }


      if (this.selectpName) {
        list = list.filter(element => {
          if (element.pal.name.indexOf(this.selectpName) != -1) {
            return element
          }
        })
      }

      return list
    },
    payments() {
      return this.$store.getters['payment/payments']
    },
    talents() {
      return this.$store.getters['talent/talents']
    },
    payouts() {

      var items = this.$store.getters['payout/payouts']
      var talents = this.talents

      var list = items.slice();

      if (list) {

        list.sort((a, b) => {

            var createa = ''
            for ( var n in a.pay ) {
              createa = a.pay[n].withdrawDate
              if (createa) {
                break
              }
            }

            var createb = ''
            for ( var n in b.pay ) {
              createb = b.pay[n].withdrawDate
              if (createb) {
                break
              }
            }

            a = createa
            b = createb

            return (a < b) ? -1 : (a > b) ? 1 : 0;
          });
      }

      if (list) {
        list = list.filter(element => {
          var balance = 0
          var currentm = this.$dayjs(this.currentMonth).format('YYYY/M')
          var withdrawdate = this.$dayjs(element.pay.withdrawDate * 1000).format('YYYY/M')
          if ( currentm === withdrawdate ) {
            return element
          }
        })
      }

      if (this.selectName) {
        list = list.filter(element => {
          for ( var n in talents ) {
            if ( element.pay.userId === talents[n].info.userid ) {
              if (talents[n].info.nickName.indexOf(this.selectName) != -1) {
                return element
              }
            }
          }
        });
      }

      return list;
    }
  }
}
</script>

<style>
h3 {

}

.listslabel {
  margin: 0 auto 20px;
  width: 95%;
}

.listslabel p {
  margin-left: 20px;
  width: 20%;
  color: #999;
}

.listslabel .image {
  width: 40px;
  margin: auto 0 auto 20px;
}

.listslabel .app {
  width: 10%;
}

.sales-title {
  /* padding-right: 40px; */
}

.sales-title button {
  background-color: #fff;
  border-radius: 0px;
  color: #666;
  box-shadow: none;
}

.leftb {
  margin: 0 auto 0 0;
}

.rightb {
  margin: 0 0 0 auto;
}

.currentm {
  padding: 0;
}

@media (max-width: 769px) {

  .listslabel p {
    margin: 0px!important;
  }

}
</style>
