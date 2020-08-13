<template id="">
  <div class="sp-contents">
    <div class="top-content flex">
      <button type="button" name="button" @click="deletec">クッキー</button>
      <button type="button" name="button" @click="deleteadminp">アドミンパートナー</button>
      <button type="button" name="button" @click="aws">awsチェック</button>
      <button type="button" name="button" @click="purchase">purchaseチェック</button>
      <button type="button" name="button" @click="sendemail">Emailチェック</button>
      <button type="button" name="button" @click="pushNotification">プッシュ通知</button>
    </div>
    <div class="center-content">
      <p>フレッシュボタン</p>
      <button @click="flesh('ファン')" type="button" name="button">ファン</button>
      <button @click="flesh('タレント')" type="button" name="button">タレント</button>
      <button @click="flesh('承認ファン')" type="button" name="button">承認ファン</button>
      <button @click="flesh('承認タレント')" type="button" name="button">承認タレント</button>
      <button @click="flesh('パートナー')" type="button" name="button">パートナー</button>
      <button @click="flesh('トーク')" type="button" name="button">トーク</button>
      <button @click="flesh('トークルーム')" type="button" name="button">トークルーム</button>
      <button @click="flesh('ペイメント')" type="button" name="button">ペイメント</button>
      <button @click="flesh('ペイアウト')" type="button" name="button">ペイアウト</button>
    </div>
    <div class="">
      <p>仮ログインです</p>
      <input type="text" v-model="email" name="" value="" placeholder="メールアドレス">
      <input type="password" v-model="password" name="" value="" placeholder="パスワード">
      <button type="button" name="button" @click="login">ログイン（仮）</button>
      <button @click="logout" type="button" name="button">ログアウト</button>
    </div>
    <div class="videoplayer">
      <p>{{ sample }}</p>
      <!-- <video-player ref="videoPlayer"
                  class="vjs-custom-skin"
                  :options="playerOptions"
                  @play="onPlayerPlay($event)"
                  @ready="onPlayerReady($event)">
      </video-player> -->

      <!-- <video-player ref="secvideoPlayer"
                  class="vjs-custom-skin"
                  :options="playerOptions"
                  @play="onPlayerPlay($event)"
                  @ready="onPlayerReady($event)">
      </video-player> -->

    </div>
  </div>
</template>

<script>
import Cookies from 'universal-cookie'
// import VideoPlayer from '~/components/VideoPlayer.vue'

export default {
  data() {
    return {
      email: '',
      password: '',
      video: '',
      playerOptions: {
        autoplay: false,
        controls: true,
        controlBar: {
          timeDivider: false,
          durationDisplay: false
        }
        // poster: 'https://surmon-china.github.io/vue-quill-editor/static/images/surmon-5.jpg'
      }
    }
  },
  components: {
    // VideoPlayer
  },
  mounted() {
    // this.video = '/9faa0099d24d6772003028bac5ff7406_Px3JJnWaT7iO3exG8neM.m3u8'
    // const src = 'https://o2-bucket.s3-ap-northeast-1.amazonaws.com/Px3JJnWaT7iO3exG8neM/2061677995/9faa0099d24d6772003028bac5ff7406_Px3JJnWaT7iO3exG8neM.m3u8'
    // const src = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'
    // this.playVideo(src)
    //
    // const secsrc = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'
    // this.playsecVideo(secsrc)
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    secplayer () {
      return this.$refs.secvideoPlayer.player
    },
    sample() {
      // var sample = this.$dayjs(1576754400 * 1000).format('YYYY/MM/DD kk:mm')
      // console.log('sample', sample)
      // var date = new Date(2012, 11, 21, 5, 30, 0);
      // console.log('date', date)
      // var days = new Date(1576754400 * 1000);
      // console.log('days', days)

      console.log(this.$dayjs(1576803600 * 1000).format('YYYY/MM/DD a hh:mm'))
      return 1
    }
  },
  methods: {
    async pushNotification() {
      // var userAuthKey = this.fan.info.signalId
      var userAuthKey = '仮'
      var approvalState = true
      var isTalent = false

      var approvalNotification = this.$firefunctions.httpsCallable('approvalNotification');
      await approvalNotification({userAuthKey: userAuthKey, approvalState: approvalState, isTalent: isTalent}).then(await function(result) {
        console.log('完了')
      }).catch(function(error) {
        console.log(error)
      });
    },
    onPlayerPlay (player) {
      console.log('player play!', player)
    },
    onPlayerReady (player) {
      console.log('player ready!', player)
      // this.player.play()
    },
    playVideo: function (source) {
      const video = {
        withCredentials: false,
        type: 'application/x-mpegurl',
        src: source
      }
      this.player.reset() // in IE11 (mode IE10) direct usage of src() when <src> is already set, generated errors,
      this.player.src(video)
      this.player.load()
      // this.player.play()
    },
    playsecVideo: function (source) {
      const video = {
        withCredentials: false,
        type: 'application/x-mpegurl',
        src: source
      }
      this.secplayer.reset() // in IE11 (mode IE10) direct usage of src() when <src> is already set, generated errors,
      this.secplayer.src(video)
      this.secplayer.load()
      // this.player.play()
    },
    flesh(val) {
      switch (val) {
        case 'ファン':
          this.$store.commit('fan/fleshFans')
          break;
        case 'タレント':
          this.$store.commit('talent/fleshTalents')
          break;
        case '承認ファン':
          this.$store.commit('fan/fleshapFans')
          break;
        case '承認タレント':
          this.$store.commit('talent/fleshapTalents')
          break;
        case 'パートナー':
          this.$store.commit('partner/fleshPartners')
          break;
        case 'トーク':
          this.$store.commit('talk/fleshTalks')
          break;
        case 'トークルーム':
          this.$store.commit('room/fleshRooms')
          break;
        case 'ペイメント':
          this.$store.commit('payment/fleshPayments')
          break;
        case 'ペイアウト':
          this.$store.commit('payout/fleshPayouts')
          break;
        default:

      }
      this.$toast.success(val + 'のvuexを削除しました')
    },
    deletec() {
      // const cookies = new Cookies()
      // cookies.remove('credential', 'true', { maxAge: 90 })
      const auth = false
      this.$store.commit("changeAuth", auth);
      this.$router.push('/')
    },
    deleteadminp() {
      const adminpartner = null
      this.$store.commit("partnerAuth", adminpartner);
      this.$router.push('/')
    },
    sendemail() {
      var sendMail = this.$firefunctions.httpsCallable('sendMail')
      // var parent = this
      sendMail({destination: 'silk.riku0369@gmail.com'}).then(function (result) {
        // parent.snackbar = true
        console.log('hai')
      })
    },
    async aws() {
      // var videodata
      var rootFile
      var rootFileurl
      var tsFiles
      var tsFileurls
      // var filekey = 'Px3JJnWaT7iO3exG8neM/2061677995/9faa0099d24d6772003028bac5ff7406_Px3JJnWaT7iO3exG8neM.m3u8'
      var filekey = 'Px3JJnWaT7iO3exG8neM/2061677995/'
      var awslist = this.$firefunctions.httpsCallable('awslist');
      await awslist({filekey: filekey}).then(await function(result) {
        rootFileurl = result.data.rootfileurl
        tsFileurls = result.data.tsfileurls
      }).catch(function(error) {
        console.log(error)
      });

      this.tsfiles = tsFileurls
      this.video = rootFileurl

      const src = rootFileurl
      this.playVideo(src)

    },
    purchase() {
      var fetchPurchase = this.$firefunctions.httpsCallable('fetchPurchase');
      fetchPurchase().then(function(result) {
        var purchase = result.data.payments;
      }).catch(function(error) {
        console.log(error)
      });
    },
    login() {
      this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(user => {
        this.$toast.success('ログインしました')
      }).catch((error) => {
        this.$toast.error(error)
      });
    },
    logout() {
      // this.$firebase.auth().onAuthStateChanged( (user) => {
        this.$firebase.auth().signOut().then(()=>{
          this.$toast.success("ログアウトしました");
        })
        .catch( (error)=>{
          this.$toast.error('ログアウトできませんでした')
          console.log(`ログアウト時にエラーが発生しました (${error})`);
        });
      // });
    }
  }
}
</script>

<style>

.videoplayer {
  margin-top: 50px;
}

.sp-contents {
  margin: 20px;
}

.top-content {
  margin-bottom: 40px;
}

.top-content button {
  width: 200px;
  margin-right: 20px;
}

.center-content p {
  margin-bottom: 20px;
}

.center-content button {
  margin-right: 20px;
}

.player {
  position: absolute !important;
  width: 100%;
  height: 60%;
}
.vjs-custom-skin {
  height: 60% !important;
}

/* .vjs-custom-skin /deep/ .video-js {
  height: 60%;
} */

</style>
