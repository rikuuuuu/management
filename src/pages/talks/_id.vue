<template>
  <div class="">
    <script src="https://cdn.agora.io/sdk/release/AgoraRTCSDK-3.0.0.js"></script>
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'レッスン詳細'">
      <div class="home-container">
        <div v-if="fetch" class="talks-contents main-contents">
          <div class="talks-title flex">
            <h2>レッスン</h2>
            <div class="talk-detail flex">
              <p class="" v-if="talk.chat.startTime">{{ talk.chat.startTime | timestamp }}</p>
              <p>　〜　</p>
              <p class="" v-if="talk.chat.endTime">{{ talk.chat.endTime | timestamp }}</p>
            </div>
          </div>
          <div class="talk-info-contents box-shadow">
            <div class="flex info-contents">
              <div class="left-contetns">
                <div class="talks-info">
                  <div class="flex">
                    <p class="p-gray left-content-key">ステータス：</p>
                    <p>{{ talkstatus }}</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray left-content-key">レッスンID：</p>
                    <p>{{ talk.chat.tid }}</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray left-content-key">ルーム名：</p>
                    <p>{{ roomName | truncate(15, '...') }}</p>
                  </div>
                </div>
              </div>
              <div class="right-contetns">
                <div class="talks-info-right">
                  <div class="flex">
                    <p class="p-gray left-content-key">ポイント：</p>
                    <p>{{ talk.chat.price / 2 }}P</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray left-content-key">値段：</p>
                    <p>{{ talk.chat.price }}円</p>
                  </div>
                </div>
                <div class="talks-buttons flex">
                  <div v-if="!recordfetch" class="reocrdfetchlabel">
                    <p class="maincolor">録画取得中...</p>
                  </div>
                  <div v-if="recordfetch" class="">
                    <button class="deletebutton button-b" type="button" name="button" v-if='record === false'>録画がありません</button>
                    <button class="deletebutton button-b" @click="video" type="button" name="button" v-else-if=(!watch)>録画を見る</button>
                    <button class="deletebutton button-b" @click="video" type="button" name="button" v-if=(watch)>録画を閉じる</button>
                  </div>
                  <button class="deletebutton" @click="monitorbtn" type="button" name="button">監視する</button>
                  <!-- v-if="talkstatus !== '終了'" -->
                </div>
              </div>
            </div>
          </div>
          <div class="flex talk-bottom-content">
            <div class="talents-box">
              <div class="">
                <h2>出品者</h2>
              </div>
              <div class="box-shadow flex t-box-content">
                <div class="t-img">
                  <img :src="talent.info.profileLink" alt="">
                </div>
                <div class="t-info">
                  <p>{{ talent.info.nickName }}</p>
                  <p>{{ talent.info.userid }}</p>
                </div>
              </div>
              <ul v-show="watch" class="flex recordlabel-container">
                <li class="recordlabel" v-for="(trecord, index) in trecords" :key="index" type="button" name="button">
                  <button @click="changetrecord(index)" v-bind:class="{ currentnumber: tcurrentnumber === index }" type="button" name="button">{{ index }}</button>
                </li>
              </ul>
              <div v-show="watch" class="video-container">
                <video-player ref="videoPlayer"
                            class="vjs-custom-skin"
                            :options="playerOptions"
                            @play="onPlayerPlay($event)"
                            @ready="onPlayerReady($event)">
                </video-player>
              </div>
            </div>
            <div class="fans-box">
              <div class="">
                <h2>購入者</h2>
              </div>
              <div class="box-shadow flex f-box-content">
                <div v-if="fan" class="flex">
                  <div class="t-img">
                    <img :src="fan.info.profileLink" alt="">
                  </div>
                  <div class="t-info">
                    <p>{{ fan.info.nickName }}</p>
                    <p>{{ fan.info.userid }}</p>
                  </div>
                </div>
                <div v-else class="">
                  <p>未購入</p>
                </div>
              </div>
              <ul v-show="watch" class="flex recordlabel-container">
                <li class="recordlabel" v-for="(frecord, index) in frecords" :key="index" type="button" name="button">
                  <button @click="changefrecord(index)" v-bind:class="{ currentnumber: fcurrentnumber === index }" type="button" name="button">{{ index }}</button>
                </li>
              </ul>
              <div v-show="watch" class="video-container">
                <video-player ref="secvideoPlayer"
                            class="vjs-custom-skin"
                            :options="playerOptions"
                            @play="onPlayerPlay($event)"
                            @ready="onPlayerReady($event)">
                </video-player>
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
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
import VideoPlayer from '~/components/VideoPlayer.vue'

export default {
  data() {
    return {
      recordfetch: false,
      tcurrentnumber: null,
      fcurrentnumber: null,
      fileUrls: [],
      tfileUrls: [],
      ffileUrls: [],
      fetch: false,
      loading: true,
      pageloading: true,
      adminpartner: null,
      isActive: false,
      talkid: '',
      watch: false,
      record: false,
      playerOptions: {
        autoplay: true,
        controls: true,
        controlBar: {
          timeDivider: false,
          durationDisplay: false
        }
      }
    }
  },
  components: {
    MenuHead,
    VideoPlayer
  },
  created() {
  },
  async mounted() {
    this.adminpartner = this.$store.state.adminpartner

    if (this.$store.getters['talk/talks'].find(p => p.chat.tid === this.$route.params.id)) {
      this.fetch = true
    } else {
      await this.$store.dispatch('talk/fetchTalks')
      this.fetch = true
    }

    this.pageloading = false
    this.loading = false

    this.recordsfetch()
  },
  methods: {
    changetrecord(val) {
      this.tcurrentnumber = Number(val)

      if (this.tfileUrls[val]) {
        const src = this.tfileUrls[val]
        this.playVideo(src)
      }
    },
    changefrecord(val) {
      this.fcurrentnumber = Number(val)

      if (this.ffileUrls[val]) {
        const secsrc = this.ffileUrls[val]
        this.playsecVideo(secsrc)
      }
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
      this.player.play()
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
      this.secplayer.play()
    },
    async recordsfetch() {

      var talkId = this.talk.chat.tid

      await this.$store.dispatch('record/fetchRecords', { talkId })

      if (this.trecords) {

        for ( var n in this.trecords ) {
          var tfilekey = this.talk.chat.tid + '/' + this.trecords[n].info.userId + '/' + this.trecords[n].info.sId + '_' + this.talk.chat.tid + '.m3u8'

          var tFileurl

          var awslist = this.$firefunctions.httpsCallable('awslist');
          await awslist({filekey: tfilekey}).then(await function(result) {
            tFileurl = result.data.rootfileurl
          }).catch(function(error) {
            console.log(error)
          });

          this.tfileUrls.push(tFileurl)
        }

      }

      if (this.frecords) {

        for ( var n in this.frecords ) {
          var ffilekey = this.talk.chat.tid + '/' + this.frecords[n].info.userId + '/' + this.frecords[n].info.sId + '_' + this.talk.chat.tid + '.m3u8'

          var fFileurl

          var awslist = this.$firefunctions.httpsCallable('awslist');
          await awslist({filekey: ffilekey}).then(await function(result) {
            fFileurl = result.data.rootfileurl
          }).catch(function(error) {
            console.log(error)
          });

          this.ffileUrls.push(fFileurl)
        }

      }

      this.recordfetch = true

      if (this.tfileUrls[0] || this.ffileUrls[0]) {
        this.record = true
      }

    },
    monitorbtn() {
      this.$router.push('/monitor/' + this.$route.params.id)
    },
    video() {
      if (this.watch === true) {
        this.watch = false
      } else {
        this.watch = true
        this.putsrc()
      }
    },
    putsrc() {
      if (this.tfileUrls[0]) {
        const src = this.tfileUrls[0]
        this.tcurrentnumber = 0
        this.playVideo(src)
      }

      if (this.ffileUrls[0]) {
        const secsrc = this.ffileUrls[0]
        this.fcurrentnumber = 0
        this.playsecVideo(secsrc)
      }
    },
    edit() {
      this.isActive = true;
    },
    save() {

      if (
        !this.talk.id
      ) {
        alert('空白の欄があります')
        return
      }

      this.$firestore.collection('talks').doc(this.talkid).update({
        // id: this.talk.id
      });

      this.isActive = false;
      alert('保存されました')
    },
    deleteaccount() {

      if(confirm('本当にレッスンを削除してよろしいですか？')){

        this.deletetalks();

        alert('削除しました。');

        this.$router.push({ path: '/talks/all' })
      }
    },
    deletetalks() {
      this.$firestore.collection('talks').doc(this.talkid).delete().then(function() {
          console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
    secplayer() {
      return this.$refs.secvideoPlayer.player
    },
    roomName() {
      if (this.rooms) {
        for (var n in this.rooms) {
          var roomname = this.rooms[n].talkroom.name
          if (roomname) {
            return roomname + '(' + this.rooms.length + ')'
            break;
          }
        }
      } else {
        return '未記入'
      }
      return '未'
    },
    fanName() {
      if (this.fan) {
        return this.fan.info.nickName
      } else {
        return '未購入'
      }
    },
    talentName() {
      return this.talent.info.nickName
    },
    // records() {
    //   // １つのレッスンに多くのレコードがあるため２つに絞ってます。（本番ではないため）
    //   var items = this.$store.getters['record/records']
    //
    //   var records = []
    //
    //   for ( var n in items ) {
    //     if (this.talk.chat.tid === items[n].info.talkId) {
    //       records.push(items[n])
    //       if (records.length === 2) {
    //         break
    //       }
    //     }
    //   }
    //
    //   return records
    // },
    trecords() {
      var items = this.$store.getters['record/records']
      var records = []

      for ( var n in items ) {
        if (this.talk.chat.tid === items[n].info.talkId && items[n].info.talent === true) {
          records.push(items[n])
        }
      }

      return records
    },
    frecords() {
      var items = this.$store.getters['record/records']
      var records = []

      for ( var n in items ) {
        if (this.talk.chat.tid === items[n].info.talkId && items[n].info.talent === false) {
          records.push(items[n])
        }
      }

      return records
    },
    talk() {
      return this.$store.getters['talk/talks'].find(p => p.chat.tid === this.$route.params.id)
    },
    fan() {
      return this.$store.getters['fan/fans'].find(p => p.info.userid === this.talk.chat.userId)
    },
    talent() {
      return this.$store.getters['talent/talents'].find(p => p.info.userid === this.talk.chat.talentId)
    },
    rooms() {
      var talkrooms = []
      var rooms = this.$store.getters['room/rooms']
      for ( var n in this.talk.chat.roomIds) {
        var room = rooms.find(p => p.talkroom.rid === this.talk.chat.roomIds[n])
        talkrooms.push(room)
      }
      return talkrooms
    },
    talkstatus() {

      var status = ''

      if (this.talk.chat.startTime && this.talk.chat.endTime) {

        var talkStartTime = this.talk.chat.startTime * 1000
        var talkEndTime = this.talk.chat.endTime * 1000
        const nowtime = dayjs().format('YYYY/MM/DD kk:mm')
        const isTalkStart = dayjs(talkStartTime).format('YYYY/MM/DD kk:mm')
        const isTalkEnd = dayjs(talkEndTime).format('YYYY/MM/DD kk:mm')

        console.log('nowtime', nowtime, 'isTalkStart', isTalkStart, 'isTalkEnd', isTalkEnd)

        if (nowtime > isTalkEnd) {
          status = '終了'
        } else if (nowtime > isTalkStart && nowtime < isTalkEnd) {
          status = 'レッスン中'
        } else if (nowtime < isTalkStart) {
          status = '未レッスン'
        }

      }

      return status
    }
  },
  filters: {
    timestamp(timestamp) {
      if (!timestamp) { return timestamp = '未記入' }
      var day
      if (dayjs(timestamp * 1000).hour() === 0) {
        day = dayjs(timestamp * 1000).add(-1, 'day')
      } else {
        day = dayjs(timestamp * 1000)
      }
      return dayjs(day).format('YYYY/MM/DD kk:mm')
    },
    truncate(value, length, omission) {
      if (value === 1) {
        value = '未購入'
        return value;
      } else if (!value) {
        return value = '未購入'
      }
      var length = length ? parseInt(length, 10) : 20;
      var ommision = omission ? omission.toString() : '...';

      if (value.length <= length) {
        return value;
      }

      return value.substring(0, length) + ommision;
    }
  },
}
</script>

<style>

.player {
    position: absolute !important;
    width: 100%;
    height: 60%;
}
.vjs-custom-skin {
  height: 60% !important;
}

.talk-info-contents {
  width: 100%;
  height: fit-content;
  padding: 20px;
}

.left-contetns {
  width: 50%;
}

.talk-detail {
  margin: 0 90px 0 auto;
}

.talk-detail p {
  line-height: 30px;
  font-size: 20px;
}

.left-content-key {
  width: 100px;
}

.talk-status {
  line-height: 30px;
}

.right-contetns {
  width: 50%;
}

.talks-info p {
  margin-top: 0px;
  margin-bottom: 25px;
  line-height: 40px;
}

.talks-info-right p {
  margin-bottom: 25px;
  line-height: 40px;
}

.talks-buttons {
  margin-bottom: 20px;
}

.talks-buttons .deletebutton {
  width: 150px;
  margin-right: 20px;
  margin-top: 20px;
}

.talkvideo {
  width: 200px;
}

.talk-bottom-content {
  margin-top: 50px;
}

.talents-box {
  width: 48%;
  margin-right: 4%;
}

.fans-box {
  width: 48%;
}

.t-box-content {
  padding: 10px;
  height: fit-content;
}

.f-box-content {
  margin: 0;
  padding: 10px;
  height: fit-content;
}

.t-img img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-left: 10px;
}

.t-info {
  margin-left: 20px;
}

.t-info p {
  line-height: 40px;
}

.video-container {
  margin-top: 40px;
}

.recordlabel-container {
  margin-top: 20px;
}

.recordlabel button {
  background-color: #fff;
  box-shadow: none;
  border-radius: 0px;
  color: #666;
  width: 50px;
}

.recordlabel .currentnumber {
  color: #3E52FF;
}

.reocrdfetchlabel {
  line-height: 30px;
  margin: 20px 30px 0 0;
}

@media (max-width: 769px) {

  .info-contents {
    display: block!important;
  }

  .info-contents p {
    font-size: 12px;
  }

  .info-contents .left-contetns {
    width: 100%;
  }

  .info-contents .right-contetns {
    width: 100%;
  }
}


</style>
