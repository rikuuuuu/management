<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'購入者詳細'">
      <div class="home-container">
        <div class="fans-contents main-contents">
          <div class="fans-title">
            <h2>購入者</h2>
          </div>
          <div v-if="fetch" class="fan-info-contents box-shadow">
            <div class="flex info-contents">
              <div class="left-contetns">
                <div class="flex detail-top-contens">
                  <img :src="fan.info.profileLink" alt="">
                  <div class="fan-name">
                    <p>{{ fan.info.nickName }}</p>
                    <p>{{ fan.info.userid }}</p>
                  </div>
                </div>
                <div class="fans-info">
                  <form class="" name="form">
                    <div class="flex infocontainer">
                      <p class="p-gray">姓名：　</p>
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="fan.info.familyName" placeholder="姓">
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="fan.info.givenName" placeholder="名">
                    </div>
                    <div class="flex infocontainer">
                      <p class="p-gray">カナ：　</p>
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="fan.info.familyKana" placeholder="セイ">
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="fan.info.givenKana" placeholder="メイ">
                    </div>
                    <div class="flex infocontainer">
                      <p class="p-gray">性別：　</p>
                      <p>{{ gender }}</p>
                      <!-- <input type="text" name="app" v-model="gender" placeholder="性別"> -->
                    </div>
                    <div class="flex infocontainer">
                      <p class="p-gray">年齢：　</p>
                      <p>{{ birthday }}</p>
                    </div>
                    <div class="flex infocontainer emailcontent">
                      <p class="p-gray">Email：　</p>
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="fan.info.email" placeholder="email">
                    </div>
                    <div class="flex infocontainer">
                      <p class="p-gray"> 職業：　</p>
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="fan.info.job" placeholder="職業">
                    </div>
                    <div class="flex infocontainer">
                      <p class="p-gray">住所：　</p>
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="fan.info.address" placeholder="住所">
                    </div>
                    <div class="flex infocontainer">
                      <p class="p-gray">学校：　</p>
                      <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="fan.info.school" placeholder="学校">
                    </div>
                  </form>
                </div>
              </div>
              <div class="right-contetns">
                <div class="fans-info-right">
                  <div class="flex">
                    <p class="p-gray right-content-key">ステータス：</p>
                    <p>{{ status }}</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">作成日時：</p>
                    <p>{{ join }}</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">保有ポイント：</p>
                    <p v-if="fan.info.point">{{ fan.info.point }}P</p>
                    <p v-else>0P</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">使用金額：</p>
                    <p>{{ used }}円</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">総トーク数：　</p>
                    <p>{{ count }}回</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">総トーク数(0円)：　</p>
                    <p>{{ testcount }}回</p>
                  </div>
                </div>
                <div class="buttons">
                  <button class="button-b" @click="edit" type="button" name="button" v-if=!isActive>編集する</button>
                  <button @click="save" type="button" name="button" v-if=isActive>保存する</button>
                  <button class="deletebutton" @click="deleteaccount" type="button" name="button" v-if=!isActive>アカウント削除</button>
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
      fetch: false,
      loading: true,
      pageloading: true,
      isActive: false,
      fid: '',
      talk: []
    }
  },
  components: {
    MenuHead
  },
  created() {
  },
  async mounted() {

    this.fid = this.$route.params.id

    if (this.$store.getters['fan/fans'].find(p => p.info.userid === this.$route.params.id)) {
      this.fetch = true
    } else {
      this.$store.dispatch('fan/fetchFans')
      this.$store.dispatch('talk/fetchTalks')
      await this.$store.dispatch('payment/fetchPayments')
      this.fetch = true
    }

    this.pageloading = false
    this.loading = false

  },
  computed: {
    payments() {
      return this.$store.getters['payment/payments']
    },
    talks() {
      var talks = this.$store.getters['talk/talks']
      var fantalks = []
      for ( var n in talks ) {
        if ( talks[n].chat.userId === this.fan.info.userid ) {
          fantalks.push(talks[n])
        }
      }
      return fantalks
    },
    fan() {
      return this.$store.getters['fan/fans'].find(p => p.info.userid === this.$route.params.id)
    },
    status() {
      var status
      if (!this.fan.info.authStatus) {
        status = 'データなし'
      } else {
        switch (this.fan.info.authStatus) {
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
    testcount() {
      var count = 0
      for ( var n in this.payments ) {
        if (!this.payments[n].pay.price) {
          if (this.fan.info.userid === this.payments[n].pay.userId) {
            count += 1
          }
        }
      }
      return count
    },
    count() {
      var count = 0
      for ( var n in this.payments ) {
        if (this.payments[n].pay.price) {
          if (this.fan.info.userid === this.payments[n].pay.userId) {
            count += 1
          }
        }
      }
      return count
    },
    used() {
      var count = 0
      for ( var n in this.payments ) {
        if (this.payments[n].pay.price) {
          if (this.fan.info.userid === this.payments[n].pay.userId) {
            count += this.payments[n].pay.price
          }
        }
      }
      return count
    },
    join() {
      var create = ''
      var joined = this.fan.info.joined * 1000
      create = this.$dayjs(joined).format('YYYY/M/D')
      return create
    },
    birthday() {
      var birthday = this.fan.info.birthday
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
    gender() {
      switch ( this.fan.info.gender ) {
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
    }
  },
  methods: {
    edit() {
      this.isActive = true;
    },
    save() {

      if (
        // !this.fan.info.birthday ||
        !this.fan.info.email ||
        !this.fan.info.familyKana ||
        !this.fan.info.familyName ||
        // !this.talent.gender ||
        !this.fan.info.givenKana ||
        !this.fan.info.givenName
        // !this.fan.nickName
      ) {
        this.$toast.error('空白の欄があります')
        return
      }

      // if (!this.fan.job) {
      //   this.fan.job = 'なし'
      // }
      // if (!this.fan.address) {
      //   this.fan.address = 'なし'
      // }
      // if (!this.fan.school) {
      //   this.fan.school = 'なし'
      // }

      this.$firestore.collection('users').doc(this.fid).update({
        // address: this.fan.address,
        // birthday: this.fan.birthday,
        email: this.fan.info.email,
        familyKana: this.fan.info.familyKana,
        familyName: this.fan.info.familyName,
        // gender: this.fan.gender,
        givenKana: this.fan.info.givenKana,
        givenName: this.fan.info.givenName,
        // job: this.fan.job,
        // joined: this.fan.joined,
        // nickName: this.fan.nickName,
        // profileLink: this.fan.profileLink,
        // school: this.fan.school,
      });

      this.isActive = false;
      this.$toast.success('保存されました')
    },
    deleteaccount() {

      if(confirm('本当にアカウントを削除してよろしいですか？')){

        var deleteaccount = this.$firefunctions.httpsCallable('deleteaccount');
        deleteaccount({userid: this.fid}).then(function(result) {

        }).catch(function(error) {
          console.log(error)
          this.$toast.error('削除に失敗しました。');
        });

        this.deleteusers();

        this.$toast.success('削除しました。');

        this.$router.push({ path: '/fans/all' })
      }
    },
    deleteusers() {
      this.$firestore.collection('users').doc(this.fid).delete().then(function() {
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

.fan-info-contents {
  width: 100%;
  height: fit-content;
  padding: 20px;
  /* min-height: 700px; */
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

.fan-name p {
  line-height: 40px;
  margin-left: 20px;
  margin-top: 7px;
}

.right-contetns {
  width: 50%;
}

.right-content-key {
  width: 140px;
}

.fans-info p {
  margin-top: 25px;
}

.fans-info-right p {
  margin-bottom: 25px;
  line-height: 40px;
}

.buttons .deletebutton {
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
  width: 70px;
}

.emailcontent input {
  width: 300px;
}

.buttons {
  margin-top: 20px;
}

@media (max-width: 769px) {

  .fan-info-contents p {
    font-size: 13px;
  }

  .info-contents {
    display: block;
  }

  .fan-name p {
    font-size: 13px;
    margin-left: 10px;
  }

  .infocontainer input {
    font-size: 13px;
  }

  .emailcontent input {
    width: 260px;
  }

  .buttons .deletebutton {
    margin: 15px 0
  }

  .right-contetns {
    margin-top: 15px;
  }

}
</style>
