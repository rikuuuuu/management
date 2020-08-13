<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'出品者詳細'">
      <div class="home-container">
        <div class="talents-contents main-contents">
          <div class="talents-title">
            <h2>出品者</h2>
          </div>
          <div v-if="fetch" class="talent-info-contents box-shadow">
            <div class="flex info-contents">
              <div class="left-contetns">
                <div class="flex detail-top-contens">
                  <img :src='talent.info.profileLink' alt="">
                  <div class="talent-name">
                    <p>{{ talent.info.nickName }}</p>
                    <p>{{ talent.info.userid }}</p>
                  </div>
                </div>
                <div class="talents-info">
                  <form class="" name="form">
                    <div class="flex infocontainer">
                      <p class="p-gray">姓名：　</p>
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="talent.info.familyName" placeholder="姓">
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="talent.info.givenName" placeholder="名">
                    </div>
                    <div class="flex infocontainer">
                      <p class="p-gray">カナ：　</p>
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="talent.info.familyKana" placeholder="セイ">
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="talent.info.givenKana" placeholder="メイ">
                    </div>
                    <div class="flex infocontainer">
                      <p class="p-gray">性別：　</p>
                      <p>{{ gender }}</p>
                    </div>
                    <div class="flex infocontainer">
                      <p class="p-gray">年齢：　</p>
                      <p>{{ birthday }}</p>
                    </div>
                    <div class="flex infocontainer emailcontent">
                      <p class="p-gray">Email：　</p>
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="talent.info.email" placeholder="email">
                    </div>
                    <div class="flex infocontainer rewardcontent">
                      <p class="p-gray">報酬割合：　</p>
                      <p v-show="!isActive">{{ rewardRatio }}</p>
                      <select v-show="isActive" class="" v-model="talent.info.rewardRatio" name="">
                        <option value=0.5>0.5</option>
                        <option value=0.6>0.6</option>
                        <option value=0.7>0.7</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
              <div class="right-contetns">
                <div class="talents-info-right">
                  <div class="flex">
                    <p class="p-gray right-content-key">ステータス：</p>
                    <p>{{ status }}</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">作成日時：</p>
                    <p>{{ join }}</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">売上金額：</p>
                    <p>{{ sales }}円</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">総レッスン数：</p>
                    <p>{{ count }}回</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">総レッスン数(0円)：</p>
                    <p>{{ testcount }}回</p>
                  </div>
                </div>
                <div v-if="!adminpartner" class="buttons">
                  <button class="button-b" @click="edit" type="button" name="button" v-if=!isActive>編集する</button>
                  <button @click="save" type="button" name="button" v-if=isActive>保存する</button>
                  <button class="d-button" @click="deleteaccount" type="button" name="button" v-if="!isActive && adminpartner === null">アカウント削除</button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex">
            <h2>レッスンルーム</h2>
            <div class="search flex">
              <div class="sort">
                <button @click="sortBy('created')" :class="sortedClass('created')" type="button" name="button">新着順</button>
              </div>
            </div>
          </div>
          <div class="flex listslabel">
            <p>出品者名</p>
            <p>ルーム名</p>
            <p class="right countlabel">完了レッスン数</p>
            <p class="right countlabel">予約済みレッスン数</p>
          </div>
          <div v-show="loading" class="loader"></div>
          <div v-show="!loading">
            <ul v-show="rooms.length !== 0" class="lists list-box-shadow">
              <All-Talkrooms v-bind:talks="talks" v-for="(room, index) in rooms" :key="index" :room="room" />
            </ul>
            <p class="no-talks" v-show="rooms.length === 0">ルームが存在しません</p>
          </div>
        </div>
      </div>
    </menu-head>
  </div>
</template>

<script>
import MenuHead from '~/components/MenuHead'
import AllTalkrooms from '~/components/AllTalkrooms'

export default {
  data() {
    return {
      fetch: false,
      loading: true,
      pageloading: true,
      adminpartner: null,
      isActive: false,
      tid: '',
      payment: [],
      sort: {
        key: '',
        isAsc: false
      }
    }
  },
  components: {
    MenuHead,
    AllTalkrooms
  },
  created() {
  },
  async mounted() {
    this.adminpartner = this.$store.state.adminpartner
    this.tid = this.$route.params.id

    if (this.adminpartner) {
      var partnerid = this.adminpartner
      await this.$store.dispatch('talent/fetchPartnersTalents', { partnerid })

      this.fetch = true

    } else {
      await this.$store.dispatch('room/fetchRooms')

      if (this.$store.getters['talent/talents'].find(p => p.info.userid === this.$route.params.id)) {
        this.fetch = true
      } else {
        this.$store.dispatch('talent/fetchTalents')
        this.$store.dispatch('talk/fetchTalks')
        await this.$store.dispatch('payment/fetchPayments')
        this.fetch = true
      }
    }

    this.pageloading = false
    this.loading = false
  },
  computed: {
    rewardRatio() {
      if (this.talent.info.rewardRatio) {
        return this.talent.info.rewardRatio
      } else {
        return 0.5
      }
    },
    status() {
      var status
      if (!this.talent.info.authStatus) {
        status = 'データなし'
      } else {
        switch (this.talent.info.authStatus) {
          case 0:
            status = '未提出'
            break;
          case 1:
            status = '提出済み'
            break;
          case 2:
            status = '不通過'
            break;
          case 3:
            status = '通過'
            break;
          default:
        }
      }
      return status
    },
    payments() {
      return this.$store.getters['payment/payments']
    },
    gender() {
      switch ( this.talent.info.gender ) {
        case 0:
          return '男性'
          break;
        case 1:
          return '女性'
          break;
        case 2:
          return 'その他'
          break;
        default:
      }
      return '性別'
    },
    talent() {
      return this.$store.getters['talent/talents'].find(p => p.info.userid === this.$route.params.id)
    },
    talks() {
      var talks = this.$store.getters['talk/talks']
      var talenttalks = []
      for ( var n in talks ) {
        if ( talks[n].chat.talentId === this.talent.info.userid ) {
          talenttalks.push(talks[n])
        }
      }
      return talenttalks
    },
    birthday() {
      var birthday = this.talent.info.birthday
      var str = String(birthday)
      var result = str.replace('_', '/');

      while(result !== str) {
        str = str.replace('_', '/');
        result = result.replace('_', '/');
      }

      var date = new Date(str)

      var now = new Date

      var Now = this.$dayjs(now).format('x')

      var birth = this.$dayjs(date).format('x')

      var diff = this.$dayjs(Now * 1).diff(birth * 1, 'years')

      return diff + '歳'
    },
    join() {
      var create = ''
      var joined = this.talent.info.joined * 1000
      create = this.$dayjs(joined).format('YYYY/M/D')
      return create
    },
    testcount() {
      var count = 0
      if (this.payments) {
        for ( var n in this.payments ) {
          if (!this.payments[n].pay.price) {
            if (this.payments[n].pay.talentId === this.talent.info.userid ) {
              count += 1
            }
          }
        }
      }
      return count
    },
    count() {
      var count = 0
      if (this.payments) {
        for ( var n in this.payments ) {
          if (this.payments[n].pay.price) {
            if (this.payments[n].pay.talentId === this.talent.info.userid ) {
              count += 1
            }
          }
        }
      }
      return count
    },
    sales() {
      var count = 0
      if (this.payments) {
        for ( var n in this.payments ) {
          if (this.payments[n].pay.price) {
            if (this.payments[n].pay.talentId === this.talent.info.userid ) {
              count += this.payments[n].pay.price
            }
          }
        }
      }
      return count
    },
    rooms() {
      var items = this.$store.getters['room/rooms']

      var list = items.slice();

      if (!!this.sort.key) {
        list.sort((a, b) => {
          a = a.talkroom[this.sort.key]
          b = b.talkroom[this.sort.key]

          return (a === b ? 0 : a > b ? 1 : -1) * (this.sort.isAsc ? 1 : -1)
        });
      }

      if (this.$route.params.id) {
        list = list.filter(element => {
          if ( this.$route.params.id === element.talkroom.talentId ) {
            return element
          }
        })
      }

      return list;
    }
  },
  methods: {
    showRetention() {
      if (this.showretention === true) {
        this.showretention = false
      } else {
        this.showretention = true
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
      this.isActive = true;
    },
    save() {

      if (
        !this.talent.info.email ||
        !this.talent.info.familyKana ||
        !this.talent.info.familyName ||
        !this.talent.info.givenKana ||
        !this.talent.info.givenName
      ) {
        this.$toast.error('空白の欄があります')
        return
      }

      this.isActive = false;

      if (!this.talent.info.rewardRatio) {
        this.talent.info.rewardRatio = 0.5
      }

      this.$firestore.collection('users').doc(this.tid).update({
        email: this.talent.info.email,
        familyKana: this.talent.info.familyKana,
        familyName: this.talent.info.familyName,
        givenKana: this.talent.info.givenKana,
        givenName: this.talent.info.givenName,
        rewardRatio: Number(this.talent.info.rewardRatio)
      });

      this.$toast.success('保存されました。')

    },
    deleteaccount() {

      if(confirm('本当にアカウントを削除してよろしいですか？')){

        var deleteaccount = this.$firefunctions.httpsCallable('deleteaccount');
        deleteaccount({userid: this.tid}).then(function(result) {
          console.log('成功')
        }).catch(function(error) {
          console.log(error)
          this.$toast.error('削除に失敗しました。');
        });

        this.deleteusers();

        this.$toast.success('削除しました。');

        this.$router.push({ path: '/talents/all' })

        // this.deletestore();
      }
    },
    deletestore() {
      const aptalent = this.talent
      this.$store.commit('talent/apTalent', { aptalent })
    },
    deleteusers() {
      this.$firestore.collection('users').doc(this.tid).delete().then(function() {
          console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
    }
  }
}
</script>

<style>

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
  pointer-events: all;
}

.talent-info-contents {
  width: 100%;
  height: fit-content;
  padding: 20px;
  margin-bottom: 60px;
}

.left-contetns {
  width: 50%;
}

.detail-top-contens {
  margin-bottom: 40px;
}

.detail-top-contens img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.talent-name p {
  line-height: 40px;
  margin-left: 20px;
  margin-top: 7px;
}

.right-contetns {
  width: 50%;
}

.talents-info p {
  margin-top: 25px;
}

.talents-info-right p {
  margin-bottom: 25px;
  line-height: 40px;
}

.right-content-key {
  width: 100px;
}

.buttons {
  margin-top: 20px;
}

.buttons .d-button {
  width: 150px;
  margin-left: 20px;
}
.infocontainer input {
  width: 120px;
  margin-top: 0px;
  margin-bottom: 40px;
}

.infocontainer p {
  margin-top: 0px;
  margin-bottom: 40px;
  width: 90px;
}

.emailcontent input {
  width: 300px;
}

.rewardcontent p {

}

@media (max-width: 769px) {

  .talent-info-contents p {
    font-size: 13px;
  }

  .info-contents {
    display: block;
  }

  .talent-name p {
    font-size: 13px;
    margin-left: 10px;
  }

  .infocontainer input {
    font-size: 13px;
  }

  .emailcontent input {
    width: 260px;
  }

  .buttons .d-button {
    margin: 15px 0
  }

  .right-contetns {
    margin-top: 15px;
  }

}
</style>
