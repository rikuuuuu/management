<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'管理画面'">
      <div class="home-container">
        <div class="sales-contents main-contents">
          <div class="sales-title flex">
            <h2>売り上げ</h2>
            <p v-show="adminpartner !== null">（所属出品者のみでの値）</p>
          </div>
          <All-sales v-bind:adminpartner='adminpartner' v-bind:toppage='toppage' v-bind:allsales='allsales' />
          <div class="flex bottom-contents">
            <div class="approval-contents" v-show="adminpartner === null">
              <div class="approval-title">
                <h2>申請承認待ち</h2>
              </div>
              <div class="approval-contents-boxes flex">
                <a href="/approval/all" class="links fansbox">
                  <div class="approval-contents-box box-shadow">
                    <div class="box-title">
                      <h3>購入者</h3>
                    </div>
                    <div class="box-value maincolor">
                      <div v-show="loading" class="loader"></div>
                      <div v-show="!loading">
                        <p>{{ apfans.length }}<span> 人</span></p>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="/approval/all" class="links fansbox">
                  <div class="approval-contents-box box-shadow">
                    <div class="box-title">
                      <h3>出品者</h3>
                    </div>
                    <div class="box-value maincolor">
                      <div v-show="loading" class="loader"></div>
                      <div v-show="!loading">
                        <p>{{ aptalents.length }}<span> 人</span></p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div class="users-count-contents">
              <div class="users-count-title">
                <h2 v-if="adminpartner === null">総ユーザー数</h2>
                <h2 v-else>所属出品者数</h2>
              </div>
              <div class="users-count-contents-boxes flex">
                <a href="/fans/all" class="links fansbox" v-show="adminpartner === null">
                  <div class="users-count-contents-box box-shadow">
                    <div class="box-title">
                      <h3>購入者</h3>
                    </div>
                    <div class="box-value maincolor">
                      <div v-show="loading" class="loader"></div>
                      <div v-show="!loading">
                        <p v-show="fans">{{ fans.length }}<span> 人</span></p>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="/talents/all" class="links fansbox">
                  <div class="users-count-contents-box box-shadow">
                    <div class="box-title">
                      <h3>出品者</h3>
                    </div>
                    <div class="box-value maincolor">
                      <div v-show="loading" class="loader"></div>
                      <div v-show="!loading">
                        <p>{{ talents.length }}<span> 人</span></p>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="/partners/all" class="links fansbox" v-show="adminpartner === null">
                  <div class="users-count-contents-box box-shadow">
                    <div class="box-title">
                      <h3>パートナー</h3>
                    </div>
                    <div class="box-value maincolor">
                      <div v-show="loading" class="loader"></div>
                      <div v-show="!loading">
                        <p>{{ partners.length }}<span> 社</span></p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </menu-head>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import MenuHead from '~/components/MenuHead'
import AllSales from '~/components/AllSales'

Vue.use(Vuex);

export default {
  data() {
    return {
      loading: true,
      pageloading: true,
      toppage: true
    }
  },
  components: {
    MenuHead,
    AllSales
  },
  created() {

    if (this.adminpartner !== null) {

      var partnerid = this.adminpartner
      this.$store.dispatch('talent/fetchPartnersTalents', { partnerid }) //順番でフェッチしないとその事務所以外のデータもとってしまう

    } else {

      if (this.$store.state.auth !== true) {
        return
      }

      // this.$store.commit('payout/fleshPayouts') // 出金の変更対応
      // this.$store.dispatch('payout/fetchPayouts')
      // this.$store.dispatch('fan/fetchFans')
      // this.$store.dispatch('talent/fetchTalents')
      // this.$store.dispatch('partner/fetchPartners')
      // this.$store.dispatch('payment/fetchPayments')
      // this.$store.dispatch('refund/fetchRefunds')

    }
  },
  mounted() {
    this.pageloading = false
    this.loading = false
  },
  methods: {
  },
  computed: {
    allsales() {
      var items = this.$store.getters['payment/payments']
      var list = items.slice();
      return list
    },
    sale() {
      var items = this.payments

      var sales = 0

      for ( var n in items ) {
        if (items[n].pay.point) {
          sales += Math.round(items[n].pay.point * 2 * 0.2)
        }
      }

      return sales.toLocaleString()
    },
    distribution() {
      var items = this.$store.getters['payment/payments']

      var distributions = 0

      for ( var n in items ) {
        if (items[n].pay.point) {
          distributions += items[n].pay.point * 2
        }
      }

      return distributions.toLocaleString()
    },
    adminpartner() {
      return this.$store.getters['adminpartner']
    },
    fans() {
      return this.$store.getters['fan/fans']
    },
    talents() {
      return this.$store.getters['talent/talents']
    },
    partners() {
      return this.$store.getters['partner/partners']
    },
    apfans() {
      return this.$store.getters['fan/apfans']
    },
    aptalents() {
      return this.$store.getters['talent/aptalents']
    },
    payments() {
      return this.$store.getters['payment/payments']
    }
  }
}
</script>

<style>

.home-container {

}

.sales-contents {
  max-width: 1200px;
}

.sales-title p {
  font-size: 14px;
  line-height: 35px;
}

.sales-contents-boxes {
}

.sales-contents-box {
}

.salesbox {
  width: 30%;
  margin-right: 40px;
}

.box-title {
  text-align: center;
}

.box-value {
  text-align: center;
  font-size: 32px;
}

.box-value p span {
  color: #666;
  font-size: 18px;
}

.bottom-contents {
  margin: 50px auto 50px;
}

.approval-contents {
  width: 40%;
  /* margin: 0 auto 50px; */
}

.approval-title {

}

.approval-contents-boxes {

}

.approval-contents-box {
  width: 100%;
}

.users-count-contents {
  width: 60%
}

.users-count-contents-box {
  width: 100%;
}

.fansbox {
  width: 35%;
  margin-right: 40px;
}

@media (max-width: 769px) {

  .sales-contents-boxes {
    display: block;
  }

  .sales-contents-box {
    width: 60%;
    margin: 30px auto 0;
  }

  .bottom-contents {
    display: block;
  }

  .approval-contents-boxes {

  }

  .approval-contents {
    width: 100%;
  }

  .fansbox {
    margin: 0 auto;
  }

  .users-count-contents-boxes {
    display: block;
  }

  .users-count-contents {
    width: 100%;
    margin-top: 40px;
  }

  .users-count-contents-box {
    width: 60%;
    margin: 30px auto 0;
  }
}



</style>
