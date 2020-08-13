<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!loading" v-bind:title="'入出金詳細'">
      <div class="home-container">
        <div class="fans-contents main-contents">
          <div class="fans-title flex">
            <h2>入出金</h2>
          </div>
          <div v-if="pfetch" class="payment-info-contents box-shadow">
            <div class="flex">
              <div class="left-contetns">
                <div class="detail-top-contens">
                  <div class="fan-name">
                    <div class="flex">
                      <p class="p-gray left-content-key">支払日：</p>
                      <p>{{ payday }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">支払額：</p>
                      <p>{{ payout.pay.balance }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">出品者名：</p>
                      <p>{{ talent.info.nickName }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">本名：</p>
                      <p>{{ talent.info.familyName + talent.info.givenName }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">出品者ID：</p>
                      <p>{{ talent.info.userid }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">申請時刻：</p>
                      <p>{{ requesttime }}</p>
                    </div>
                  </div>
                </div>
                <div class="rooms-info">
                </div>
              </div>
              <div class="right-contetns">
                <div class="fans-info-right">
                  <form class="" name="form">
                    <p class="pay-info">支払い情報</p>
                    <div class="flex">
                      <p class="p-gray left-content-key">銀行名：</p>
                      <p>{{ payout.pay.bankName }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">支店名：</p>
                      <p>{{ payout.pay.bankBranch }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">口座番号：</p>
                      <p>{{ payout.pay.accountNumber }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">口座名義：</p>
                      <p>{{ payout.pay.holderName }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">ステータス：</p>
                      <p>{{ status }}</p>
                    </div>
                  </form>
                </div>
                <div class="buttons">
                  <button class="button-b" @click="pay" type="button" name="button" v-if="!paystate">入金済み</button>
                  <button class="paybutton" @click="pay" type="button" name="button" v-if="paystate">入金前に戻す</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </menu-head>
  </div>
</template>

<script>
import MenuHead from '~/components/MenuHead'

export default {
  data() {
    return {
      pfetch: false,
      loading: true,
      pageloading: true,
      talentId: '',
      // payment: Object,
      paystate: false
    }
  },
  components: {
    MenuHead
  },
  created() {
    if (this.payout) {
      if ( this.payout.pay.status === 1) {
        this.paystate = true
      } else {
        this.paystate = false
      }
      this.loading = false
      return
    }
  },
  async mounted() {
    // this.fetch(0)
    if (this.$store.getters['payout/payouts'].find(p => p.pay.wid === this.$route.params.id)) {
      this.pfetch = true
    } else {
      await this.$store.dispatch('payout/fetchPayouts')
      this.pfetch = true
    }

    this.pageloading = false
    this.loading = false
  },
  methods: {
    pay() {
      if (this.paystate === false) {
        this.$firestore.collection('withdraw').doc(this.payout.pay.wid).update({
          status: 1
        })
        this.paystate = true
        this.$toast.success('入金済みに変更されました')
      } else {
        this.$firestore.collection('withdraw').doc(this.payout.pay.wid).update({
          status: 0
        })
        this.paystate = false
        this.$toast.success('入金前に変更されました')
      }
    },
    fetch(month) {

      var id = this.$nuxt.$route.params.id
      this.talentId = id

      this.$firestore.collection('users').where('userid', '==', this.talentId).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

          const talent = doc.data()

          const payment = {
            talent: {},
            payout: {},
            pay: []
          }

          this.$set(payment, 'talent', talent)

          this.$firestore.collection('payouts').where('talentId', '==', this.talentId).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

              const payout = doc.data()

              if ( payout.payoutStatus === '入金済み') {
                this.paystate = true
              } else {
                this.paystate = false
              }

              this.$set(payment, 'payout', payout)

            })
          })

          this.$firestore.collection('payments').where('talentId', '==', talent.userid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

              const pay = doc.data()

              const createdat = this.$dayjs(pay.createdAt.seconds * 1000).format('YYYY/MM')
              const now = new Date
              const nowmonth = this.$dayjs(now).add(-month, 'month').format('YYYY/MM')

              if ( createdat === nowmonth ) {
                payment.pay.push(pay)
              }

              this.loading = false

            })
          }).then(() => {
            this.payment = payment

          })

        })
      })
    }
  },
  computed: {
    status() {
      if (this.payout.pay.status === 0) {
        return '入金前'
      } else {
        return '入金済み'
      }
    },
    talent() {
      return this.$store.getters['talent/talents'].find(p => p.info.userid === this.payout.pay.userId)
    },
    paycount() {
      var count = 0

      for ( var n in this.payment.pay ) {
        count += 1
      }

      return count
    },
    requesttime() {
      return this.$dayjs(this.payout.pay.requestTime * 1000).format('YYYY/MM/DD')
    },
    payday() {
      var payday
      var requesttime = this.payout.pay.withdrawDate * 1000
      payday = this.$dayjs(requesttime).format('YYYY/MM/DD')
      return payday
      // var payday = ''
      // for ( var n in this.payment.pay ) {
      //   var monthlater = dayjs(this.payment.pay[n].createdAt.seconds * 1000).add(2, 'month').format('YYYY/MM/1')
      //   payday = dayjs(monthlater).add(-1, 'days').format('M/D')
      //   if (payday) {
      //     break
      //   }
      // }
      // return payday
    },
    paymentprice() {
      var price = 0

      for ( var n in this.payment.pay ) {
        price += this.payment.pay[n].price * 0.5
      }

      return price
    },
    payout() {
      return this.$store.getters['payout/payouts'].find(p => p.pay.wid === this.$route.params.id)
    }
  }
}
</script>

<style>

.paybutton {
  width: 130px;
}

.payment-info-contents {
  width: 100%;
  height: 60vh;
  padding: 20px;
  min-height: 500px;
  margin-bottom: 50px;
}

form {
  display: grid;
}

form input {
  border: none;
  padding: 0;
  font-size: 16px;
  margin-top: 35px;
  border-radius: 0;
  pointer-events: none;
}

.active {
  border-bottom: 1px solid #ccc;
  border-radius: 0;
  padding: 5px;
  margin: 25px 24px 0 0;
  /* width: 50%; */
  pointer-events: all;
}

.room-info-contents {
  width: 100%;
  height: 60vh;
  padding: 20px;
  min-height: 500px;
  margin-bottom: 50px;
}

.left-contetns {
  width: 50%;
}

.left-content-key {
  width: 100px;
}

.detail-top-contens img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.fan-name p {
  line-height: 40px;
  margin-bottom: 25px;
}

.right-contetns {
  width: 50%;
}

.rooms-info p {
  line-height: 40px;
  margin: 0 0 25px 0;
}

.fans-info-right p {
  margin-bottom: 25px;
  line-height: 40px;
}

.buttons .deletebutton {
  width: 150px;
  margin-top: 50px;
}

.listslabel {
  margin-bottom: 20px;
}

.listslabel p {
  margin-left: 20px;
  width: 20%;
  color: #999;
}

.listslabel .texts {
  width: 5%;
}

</style>
