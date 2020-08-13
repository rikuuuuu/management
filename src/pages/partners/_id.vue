<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'パートナー詳細'">
      <div class="home-container">
        <div class="pal-contents main-contents">
          <div class="pal-title">
            <h2>パートナー</h2>
          </div>

          <div v-if="fetch" class="partner-info-contents box-shadow">
            <div class="flex">
              <div class="left-contents">
                <div class="flex">
                  <div class="">
                    <div class="flex">
                      <p class="p-gray left-content-key">パートナー名：</p>
                      <input v-bind:class="{ active: isActive }" v-model="partner.pal.name" type="text" name="" value="" placeholder="パートナー名">
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">パートナーID：</p>
                      <p>{{ partner.pal.id }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">パートナー数：</p>
                      <p>{{ talents.length }}人</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="right-contetns">
                <div class="withdraw-info-right">
                  <form class="" name="form">
                    <p class="pay-info">口座情報</p>
                    <div class="flex">
                      <p class="p-gray right-content-key">銀行名：</p>
                      <input v-bind:class="{ active: isActive }" v-model="partner.pal.bankName" type="text" name="" value="" placeholder="銀行名">
                    </div>
                    <div class="flex">
                      <p class="p-gray right-content-key">支店名：</p>
                      <input v-bind:class="{ active: isActive }" v-model="partner.pal.bankBranch" type="text" name="" value="" placeholder="支店名">
                    </div>
                    <div class="flex">
                      <p class="p-gray right-content-key">口座番号：</p>
                      <input v-bind:class="{ active: isActive }" v-model="partner.pal.accountNumber" type="text" name="" value="" placeholder="口座番号">
                    </div>
                    <div class="flex">
                      <p class="p-gray right-content-key">口座名義：</p>
                      <input v-bind:class="{ active: isActive }" v-model="partner.pal.holderName" type="text" name="" value="" placeholder="口座名義">
                    </div>
                  </form>
                </div>
                <div class="buttons">
                  <button v-show="!isActive" class="button-b" @click="edit" type="button" name="button">編集する</button>
                  <button v-show="isActive" class="" @click="save" type="button" name="button">保存する</button>
                </div>
              </div>

            </div>
          </div>
          <div class="pal-title flex">
            <h2>所属出品者</h2>
            <div class="">
              <button v-show="!regist" @click="btnRegist" class="regist-talent nbutton maincolor" type="button" name="button">所属出品者登録</button>
              <button v-show="regist" @click="btnRegist" class="regist-talent nbutton maincolor" type="button" name="button">完了</button>
            </div>
            <div class="search flex">
              <input v-model="selectName" type="text" name="" value="" placeholder="出品者名 検索">
              <div class="sort">
                <button @click="sortBy('joined')" :class="sortedClass('joined')" type="button" name="button">新着順</button>
              </div>
            </div>
          </div>
          <div class="flex listslabel">
            <p class="image">画像</p>
            <p>出品者名</p>
            <p>本名</p>
            <p class="app">承認</p>
            <p>出品者ID</p>
          </div>
          <div class="">
            <ul v-show="talents.length !== 0" class="lists list-box-shadow">
              <All-Talents v-bind:pid="pid" v-bind:regist="regist" v-for="(talent, index) in talents" v-bind:paymentstate="paymentstate" v-bind:talentssale="talentssale" :key="index" :talent="talent" />
            </ul>
            <p class="no-talks" v-show="talents.length === 0">出品者が存在しません</p>
          </div>
        </div>
      </div>
    </menu-head>
  </div>
</template>

<script>
import MenuHead from '~/components/MenuHead'
import AllTalents from '~/components/AllTalents'

export default {
  data() {
    return {
      selectName: '',
      regist: false,
      fetch: false,
      paymentstate: 'all',
      talentssale: false,
      loading: true,
      pageloading: true,
      isActive: false,
      pid: '',
      sort: {
        key: '',
        isAsc: false
      }
    }
  },
  components: {
    MenuHead,
    AllTalents
  },
  created() {
  },
  async mounted() {
    this.pid = this.$route.params.id

    if (this.$store.getters['partner/partners'].find(p => p.pal.id === this.$route.params.id)) {
      this.fetch = true
    } else {
      await this.$store.dispatch('partner/fetchPartners')
      this.fetch = true
    }

    this.pageloading = false
    this.loading = false
  },
  computed: {
    partner() {
      return this.$store.getters['partner/partners'].find(p => p.pal.id === this.$route.params.id)
    },
    talents() {

      var items = this.$store.getters['talent/talents']

      var list = items.slice();

      if (!!this.sort.key) {
        list.sort((a, b) => {
          a = a.info[this.sort.key]
          b = b.info[this.sort.key]

          return (a === b ? 0 : a > b ? 1 : -1) * (this.sort.isAsc ? 1 : -1)
        });
      }

      if (!this.regist) {
        list = list.filter(element => {
          if ( element.info.partnerId ) {
            if ( this.$route.params.id === element.info.partnerId ) {
              return element
            }
          }
        })
      } else {
        list = list.filter(element => {
          if ( this.$route.params.id !== element.info.partnerId || !element.info.partnerId ) {
            return element
          }
        })
      }

      if (this.selectName) {
        list = list.filter(element => {
          if ( element.info.nickName ) {
            if ( element.info.nickName.indexOf(this.selectName) != -1) {
              return element.info.nickName
            }
          }
        });
      }

      return list
    }
  },
  methods: {
    btnRegist() {
      if (this.regist === true) {
        this.regist = false
      } else {
        this.regist = true
      }
    },
    sortBy: function(key) {
      this.sort.isAsc = this.sort.key === key ? !this.sort.isAsc : false;
      this.sort.key = key;
    },
    sortedClass: function(key) {
      return this.sort.key === key ? `sorted ${this.sort.isAsc ? 'asc' : 'desc' }` : '';
    },
    edit() {
      this.isActive = true
    },
    save() {
      if (!this.partner.pal.name) {
        this.$toast.error('パートナー名が入力されていません。')
        return
      }

      if (!this.partner.pal.bankName) {
        this.partner.pal.bankName = ''
      }
      if (!this.partner.pal.bankBranch) {
        this.partner.pal.bankBranch = ''
      }
      if (!this.partner.pal.accountNumber) {
        this.partner.pal.accountNumber = ''
      }
      if (!this.partner.pal.holderName) {
        this.partner.pal.holderName = ''
      }

      this.$firestore.collection('partners').doc(this.partner.pal.id).update({
        name: this.partner.pal.name,
        bankName: this.partner.pal.bankName,
        bankBranch: this.partner.pal.bankBranch,
        accountNumber: this.partner.pal.accountNumber,
        holderName: this.partner.pal.holderName
      }).then(() => {
        this.isActive = false
        this.$toast.success('保存が完了しました')
      }).catch(error => {
        this.$toast.success('保存に失敗しました')
      })

    }
  }
}
</script>

<style>

.partner-info-contents {
  width: 100%;
  height: fit-content;
  padding: 20px;
  max-height: 700px;
  margin-bottom: 50px;
}

.partner-info-contents p {
  line-height: 55px;
}

.partner-info-contents input {
  border: none;
  padding: 0;
  font-size: 16px;
  border-radius: 0;
  pointer-events: none;
  line-height: 55px;
  margin: 0;
}

.partner-info-contents .active {
  border-bottom: 1px solid #ccc;
  border-radius: 0;
  padding: 5px;
  margin: 0 0 10px 0;
  line-height: 40px;
  pointer-events: all;
}

.left-contents {
  width: 50%;
}

.left-content-key {
  width: 120px;
}

.right-contetns {
  width: 50%;
}

.right-content-key {
  width: 100px;
}

.buttons .deletebutton {
  width: 150px;
  margin-left: 20px;
}

.buttons button {
  margin-bottom: 30px;
}

.listslabel {
  width: 95%;
  margin: 0 auto 20px;
}

.listslabel p {
  margin-left: 20px;
  width: 20%;
  color: #999;
}

.listslabel .image {
  width: 40px;
  margin: auto 0 auto 20px;
  text-align: center;
}

.listslabel .app {
  width: 10%;
}

.regist-talent {
  line-height: 30px;
  margin-left: 40px;
}

</style>
