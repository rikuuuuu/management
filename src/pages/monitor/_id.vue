<template id="">
  <div class="">
    <script src="https://cdn.agora.io/sdk/release/AgoraRTCSDK-3.0.0.js"></script>

    <div v-if="fetch" class="">

      <div class="monitor-top-contents">
        <div class="">
          <h1>トーク監視</h1>
        </div>
        <div class="">
          <div class="flex monitor-time">
            <p class="" v-if="talk.chat.startTime">{{ talk.chat.startTime | timestamp }}</p>
            <p>　〜　</p>
            <p class="" v-if="talk.chat.endTime">{{ talk.chat.endTime | timestamp }}</p>
          </div>
          <div class="">
            <p>{{ remainingtime }} / {{ talktime }}</p>
          </div>
        </div>
      </div>

      <div class="panel panel-default" style="width:846px;height:560px;">
        <div class="panel-heading flex">
          <p>タレント: {{ talent.info.nickName }}</p>
          <p v-if="fan">ファン: {{ fan.info.nickName }}</p>
        </div>
        <div class="flex" id="video" style="background:#eee;">
          <div class="remote-panel" id="talent_remote" style="width:422px;height:517px;margin: 0 auto;"></div>
          <div class="remote-panel" id="fan_remote" style="width:422px;height:517px;margin: 0 auto;"></div>
        </div>
      </div>

      <div id="div_join" class="panel panel-default">
        <div class="panel-body">
          <button v-show="!joined" id="publish" class="" @click="join">入室</button>
          <button v-show="!joined" id="publish" class="button-b" @click="goback">戻る</button>
          <button v-show="joined" id="publish" class="button-b" @click="leave">退室</button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)

export default {
  data() {
    return {
      joined: false,
      appId: 'd0fab44b99a34037906739aa132cd6cd',
      talkId: '',
      channel: '',
      client: {},
      localStream: {},
      camera: '',
      microphone: '',
      clientUID: 3000,
      audioSelect: '',
      videoSelect: '',
      rtmClient: '',
      rtmChannel: '',
      clientName: '',
      displayMode: "tile",
      readyState: false,
      streamList: [],
      transcode: "interop",
      attendeeMode: "audience",
      videoProfile: "480p_4",
      userId: '',
      fetch: false,
      nows: '',
      usercount: 0
    }
  },
  created() {

  },
  async mounted() {
    // 30秒
    setInterval(() => { this.nows = new Date(); }, 30000)

    const auth = this.$store.state.auth
    const adminpartner = this.$store.state.adminpartner

    if (adminpartner !== null) {
      this.isAdminPartner = true
      return
    }

    if (auth !== true) {
      return this.$router.push('/admin/login')
    }

    this.adminpartner = this.$store.state.adminpartner

    if (this.$store.getters['talk/talks'].find(p => p.chat.tid === this.$route.params.id)) {
      this.fetch = true
    } else {
      await this.$store.dispatch('talk/fetchTalks')
      this.fetch = true
    }

    this.talkId = this.talk.chat.tid

    if (!AgoraRTC.checkSystemRequirements()) {
      alert("Your browser does not support WebRTC!");
    }

    this.appId = "d0fab44b99a34037906739aa132cd6cd";
    this.channel = this.talkId;
    this.clientUID = 3000;
    this.audioSelect = document.querySelector('select#audioSource');
    this.videoSelect = document.querySelector('select#videoSource');
    this.clientName = "manager";

  },

  methods: {

    subscribeStreamEvents() {
      let rt = this;
      let tcanvas = document.querySelector("#talent_remote");
      let fcanvas = document.querySelector("#fan_remote");
      // let canvas = document.querySelector("#agora_remote");

      rt.client.on("stream-added", function(evt) {
        let stream = evt.stream;
        var id = stream.getId();
        if (id !== rt.clientUID) {
          console.log("New stream added: " + stream.getId());
          console.log("Subscribe ", stream);
          rt.client.subscribe(stream, function(err) {
            console.log("Subscribe stream failed", err);
          });
        }
      });

      rt.client.on("peer-leave", function(evt) {
        console.log("Peer has left: " + evt.uid);
        console.log(new Date().toLocaleTimeString());
        console.log(evt);
        rt.removeStream(evt.uid);
      });

      rt.client.on("stream-subscribed", function(evt) {
        let stream = evt.stream;
        var id = stream.getId();
        console.log("Got stream-subscribed event");
        console.log(new Date().toLocaleTimeString());
        console.log("Subscribe remote stream successfully: " + stream.getId());
        console.log(evt);

        rt.usercount += 1

        if (rt.usercount === 1) {
        // タレントとファンの振り分け　uidがわからないので、一旦順番で。
        // if (id === rt.talent.info.userid) {
          let dom = document.querySelector("#ag-item-" + id);
          if (!dom) {
            dom = document.createElement("section");
            dom.setAttribute("id", "ag-item-" + id);
            dom.setAttribute("class", "ag-item");
            tcanvas.appendChild(dom);
            stream.play("ag-item-" + id);
          }
        // }
        }

        if (rt.usercount === 2) {
      //   // if (rt.fan) {
      //   //   if (id === rt.fan.info.userid) {
            let dom = document.querySelector("#ag-item-" + id);
            if (!dom) {
              dom = document.createElement("section");
              dom.setAttribute("id", "ag-item-" + id);
              dom.setAttribute("class", "ag-item");
              fcanvas.appendChild(dom);
              stream.play("ag-item-" + id);
            }
      //   //   }
      //   // }
        }
      });

      rt.client.on("stream-removed", function(evt) {
        let stream = evt.stream;
        console.log("Stream removed: " + stream.getId());
        console.log(new Date().toLocaleTimeString());
        console.log(evt);
        rt.removeStream(stream.getId());
      });
    },

    goback() {
      this.$router.push('/talks/' + this.$route.params.id)
    },

    leave() {
      var rtc = this
      rtc.joined = false
      rtc.client.leave(function () {
        while (rtc.streamList.length > 0) {
          var stream = rtc.streamList.shift();
          var id = stream.getId();
          stream.stop();
          removeView(id);
        }
        console.log("client leaves channel success");
      }, function (err) {
        console.log("channel leave failed");
        console.error(err);
      })
      this.reload()
    },

    reload() {
        this.$router.go({path: this.$router.currentRoute.path, force: true});
    },

    join() {
      let $ = this;
      $.joined = true
      $.client = AgoraRTC.createClient({ mode: $.transcode });
      $.client.init($.appId, () => {
        console.log("AgoraRTC client initialized");
        $.subscribeStreamEvents();
        $.client.join($.appId, $.channel, $.clientUID, uid => {
          console.log("User " + uid + " join channel successfully");
          console.log("At " + new Date().toLocaleTimeString());
        });
      });
    }
  },
  computed: {
    talktime() {
      var time

      time = dayjs(this.talk.chat.endTime * 1000).diff(this.talk.chat.startTime * 1000, 'minutes')

      return time + '分'
    },
    remainingtime() {
      console.log('現在の時刻', this.nows)
      var time
      var now

      if (!this.nows) {
        now = new Date();
      } else {
        now = this.nows
      }

      var retime = Number(dayjs(this.talk.chat.endTime * 1000).diff(now, 'minutes'))

      if (retime < 0) {
        time = '終了'
      } else {
        time = '残り' + retime + '分'
      }

      return time
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
  }
}
</script>

<style>

.monitor-time {
  margin: 20px 0;
}

.monitor-top-contents {
  width: 844px;
  margin: 30px auto;
}

.video-panel {
}

.remote-panel {
  border: 1px solid #ccc;
}

.panel-heading p {
  width: 50%;
  font-size: 16px;
  font-weight: 500;
}

.panel {
  float: none!important;
  margin: 30px auto;
}

.panel-body {
  text-align: center;
}

.ag-item :first-child {
  border-radius: 6px;
}
.ag-item {
  border-radius: 6px;
  border: 2px #00b6ed solid;
  /* background: url("../assets/images/avatar.png") center no-repeat; */
  height: 100%;
  width: 100%;
}

</style>
