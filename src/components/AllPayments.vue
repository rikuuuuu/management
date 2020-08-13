<template>
  <li class="flex fan-list">

    <!-- パートナーの入出金を月ごとで表せないので（遷移したページで）、Modalでひょうじしてます -->
    <ap-modal @close="closeModal" v-if="modal">
      <div class="payment-info-contents box-shadow">
        <div class="flex">
          <div class="left-contetns">
            <div class="detail-top-contens">
              <div class="withdraw-info">
                <div class="flex">
                  <p class="p-gray left-content-key">支払日：</p>
                  <p v-if="!partner">{{ payday }}</p>
                  <p v-else>{{ palpayday }}</p>
                </div>
                <div class="flex">
                  <p class="p-gray left-content-key">支払額：</p>
                  <p v-if="!partner">{{ (payout.pay.balance - 500).toLocaleString() }}円</p>
                  <p v-else>{{ palpayout.toLocaleString() }}円</p>
                </div>
                <div class="flex">
                  <p class="p-gray left-content-key">手数料：</p>
                  <p>500円</p>
                </div>
                <div class="flex">
                  <p v-if="!partner" class="p-gray left-content-key">出品者名：</p>
                  <p v-else class="p-gray left-content-key">パートナー名：</p>
                  <p v-if="!partner">{{ talent.info.nickName }}</p>
                  <p v-else>{{ partner.pal.name }}</p>
                </div>
                <div v-if="!partner" class="flex">
                  <p class="p-gray left-content-key">本名：</p>
                  <p>{{ talent.info.familyName + talent.info.givenName }}</p>
                </div>
                <div class="flex">
                  <p v-if="!partner" class="p-gray left-content-key">出品者ID：</p>
                  <p v-else class="p-gray left-content-key">パートナーID：</p>
                  <p v-if="!partner">{{ talent.info.userid | truncate(15, '...') }}</p>
                  <p v-else>{{ partner.pal.id | truncate(15, '...') }}</p>
                </div>
                <div v-if="!partner" class="flex">
                  <p class="p-gray left-content-key">申請時刻：</p>
                  <p>{{ requesttime }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="right-contetns">
            <div class="withdraw-info-right">
              <form class="" name="form">
                <p class="pay-info">支払い情報</p>
                <div class="flex">
                  <p class="p-gray left-content-key">銀行名：</p>
                  <p v-if="!partner">{{ payout.pay.bankName }}</p>
                  <p v-if="partner && partner.pal.bankName">{{ partner.pal.bankName }}</p>
                  <p v-if="partner && !partner.pal.bankName">未入力</p>
                </div>
                <div class="flex">
                  <p class="p-gray left-content-key">支店名：</p>
                  <p v-if="!partner">{{ payout.pay.bankBranch }}</p>
                  <p v-if="partner && partner.pal.bankBranch">{{ partner.pal.bankBranch }}</p>
                  <p v-if="partner && !partner.pal.bankBranch">未入力</p>
                </div>
                <div class="flex">
                  <p class="p-gray left-content-key">口座番号：</p>
                  <p v-if="!partner">{{ payout.pay.accountNumber }}</p>
                  <p v-if="partner && partner.pal.accountNumber">{{ partner.pal.accountNumber }}</p>
                  <p v-if="partner && !partner.pal.accountNumber">未入力</p>
                </div>
                <div class="flex">
                  <p class="p-gray left-content-key">口座名義：</p>
                  <p v-if="!partner">{{ payout.pay.holderName }}</p>
                  <p v-if="partner && partner.pal.holderName">{{ partner.pal.holderName }}</p>
                  <p v-if="partner && !partner.pal.holderName">未入力</p>
                </div>
                <div class="flex">
                  <p class="p-gray left-content-key">ステータス：</p>
                  <p v-if="!partner">{{ status }}</p>
                  <p v-if="partner">入金前</p>
                </div>
              </form>
            </div>
            <div class="pay-buttons">
              <button class="button-b" @click="pay" type="button" name="button" v-show="!state">入金済み</button>
              <!-- <button class="paybutton" @click="pay" type="button" name="button" v-show="state">入金前に戻す</button> -->
            </div>
          </div>
        </div>
      </div>
    </ap-modal>

    <button @click="openModal"
            v-if="payout && talent"
            class="links list-a flex list-button nbutton"
            v-bind:class="{ isFinished: payout.pay.status === 1,
                            yetpay: payout.pay.status === 0 && yetpayment === true,
                            todaypay: payout.pay.status === 0 && todaypayment === true
                           }">

      <p class="fansname">{{ payday }}</p>
      <p class="fansname">{{ talent.info.nickName }}</p>
      <p class="fansname">{{ talent.info.familyName + talent.info.givenName}}</p>
      <p class="realname">{{ (payout.pay.balance - 500).toLocaleString() }}円</p>
      <p class="realname">{{ status }}</p>
    </button>

    <button @click="openModal" v-if="partner && payments && talents" class="links list-a flex list-button nbutton">
      <p class="fansname">{{ palpayday }}</p>
      <p class="fansname">{{ partner.pal.name }}</p>
      <p class="fansname"></p>
      <p class="realname">{{ palpayout.toLocaleString() }}円</p>
      <p class="realname">入金前</p>
    </button>
  </li>
</template>

<script>
import ApModal from '~/components/ApModal'

export default {
  data() {
    return {
      none: false,
      modal: false,
      state: false
    }
  },
  components: {
    ApModal
  },
  props: [
    'partner',
    'payout',
    'currentMonth'
  ],
  created() {
  },
  mounted() {
    if (this.payout) {
      if (this.payout.pay.status === 1) {
        this.state = true
      } else {
        this.state = false
      }
    }
  },
  methods: {
    reload() {
        this.$router.go({path: this.$router.currentRoute.path, force: true});
    },
    pay() {
      var self = this
      if (this.state === false) {

        var withdrawStatusChange = this.$firefunctions.httpsCallable('withdrawStatusChange')
        withdrawStatusChange({wid: this.payout.pay.wid}).then(function (result) {
          self.reload()
        })

        this.state = true
        this.$toast.success('入金済みに変更されました')
      } else {
        this.state = false
        this.$toast.success('入金前に変更されました')
      }
    },
    openModal() {
      this.modal = true
    },
    closeModal() {
      this.modal = false
    },
  },
  computed: {
    requesttime() {
      return this.$dayjs(this.payout.pay.requestTime * 1000).format('YYYY/MM/DD')
    },
    palpayday() {
      // currentMonthの月末を表示
      var lastmonth = this.$dayjs(this.currentMonth).add(1, 'month').format('YYYY/MM/01')
      return this.$dayjs(lastmonth).add(-1, 'day').format('MM/DD')
    },
    palpayout() {
      var payout = 0
      var ptalents = new Array()
      var lastmonth = this.$dayjs(this.currentMonth).add(-1, 'month').format('YYYY / M')
      var lastmonthpay = new Array()

      for ( var n in this.talents ) {
        if ( this.partner.pal.id === this.talents[n].info.partnerId ) {
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

      return payout
    },
    payments() {
      return this.$store.getters['payment/payments']
    },
    talents() {
      return this.$store.getters['talent/talents']
    },
    talent() {
      return this.$store.getters['talent/talents'].find(p => p.info.userid === this.payout.pay.userId)
    },
    status() {
      // if (this.payout.pay.status === 0) {
      if (this.state === false) {
        return '入金前'
      } else {
        return '入金済み'
      }
    },
    // 今日支払い
    todaypayment() {
      var status = false

      const now = new Date
      const Now = this.$dayjs(now).format('YYYY/MM/DD')
      const payoutat = this.payout.pay.withdrawDate * 1000
      const payoutmonth = this.$dayjs(payoutat).format('YYYY/MM/DD')

      if (Now === payoutmonth) {
        status = true
      }

      return status
    },
    // 支払い遅れ
    yetpayment() {

      var status = false

      const now = new Date
      const Now = this.$dayjs(now).format('YYYY/MM')
      const payoutat = this.payout.pay.withdrawDate * 1000
      const payoutmonth = this.$dayjs(payoutat).format('YYYY/MM')

      if (Now > payoutmonth) {
        status = true
      }

      return status
    },
    payday() {
      var payday
      // for ( var n in this.payout.pay ) {
      //   var monthlater = this.$dayjs(this.payout.pay[n].withdrawDate.seconds * 1000).add(2, 'month').format('YYYY/MM/1')
      //   payday = this.$dayjs(monthlater).add(-1, 'days').format('M/D')
      //   if (payday) {
      //     break
      //   }
      // }
      var requesttime = this.payout.pay.withdrawDate * 1000
      payday = this.$dayjs(requesttime).format('YYYY/MM/DD')
      return payday
    },
    paymentprice() {
      var price = 0

      for ( var n in this.payout.pay ) {
        price += this.payout.pay[n].balance * 0.5
      }

      return price.toLocaleString() + '円'
    }
  },
  filters: {
    truncate(value, length, omission) {
      if (!value) { return value = 'なし' }
      var length = length ? parseInt(length, 10) : 20;
      var ommision = omission ? omission.toString() : '...';

      if (value.length <= length) {
        return value;
      }

      return value.substring(0, length) + ommision;
    }
  }
}
</script>

<style>

.pay-buttons button {
  margin-left: 20px;
}


.lists li:last-child {
  border: none;
}

.fan-list {
  border-bottom: 2px solid #eee;
  line-height: 55px;
  width: 95%;
  margin: 0 auto;
}

.fan-list img {
  width: 40px;
  height: 40px;
  margin: auto 0 auto 20px;
  border-radius: 50%;
}

.fan-list p {
  margin-left: 20px;
  width: 20%;
}

.fan-list .approval {
  width: 10%;
}

.isFinished p {
  color: #bbb;
}

.yetpay p {
  color: #E02020;
}

.todaypay p {
  color: #3E52FF;
}

.list-button {
  line-height: 55px;
  padding: 0;
  text-align: left;
}

.list-button:hover p {
  filter: brightness(60%);
}

.list-button:active {
  -webkit-transform: translateY(0px);
  transform: translateY(0px);
}

.paybutton {
  width: 130px;
  margin: 15px 20px;
}

.payment-info-contents {
  width: 100%;
  padding: 30px;
  min-height: 500px;
  background-color: #FFF;
}

.left-contetns {
  width: 50%;
}

.left-content-key {
  width: 100px!important;
}

.detail-top-contens img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.withdraw-info p {
  line-height: 40px;
  margin-bottom: 25px;
  width: fit-content;
}

.right-contetns {
  width: 50%;
}

.withdraw-info-right p {
  margin-bottom: 25px;
  line-height: 40px;
  width: fit-content;
}

.modal-content {
  width: 65vw;
}

@media (max-width: 769px) {

  .fan-list img {
    width: 30px;
    height: 30px;
    margin: auto 0 auto 10px;
  }

  .fan-list p {
    font-size: 10px;
    width: 25%;
    margin: auto;
  }

  .fan-list .userid {
    display: none;
  }

  .fansname {
    line-height: 30px;
  }

}
</style>
