<template>
  <li class="flex talk-list">
    <p v-if="talkstatus === 'istalkking'" class="talkinglabel">トーク中</p>
    <p v-if="talkstatus === 'isfuture'" class="isFuturelabel">{{ talktime }}</p>
    <p v-if="talkstatus === 'isfinished'" class="isFinishedlabel">終了</p>
    <nuxt-link :to="{ name: 'talks-id', params: { id: talk.chat.tid }}" class="links list-a flex" v-bind:class="{ isFinished: talkstatus === 'isfinished', isFuture: talkstatus === 'isfuture', isTalking: talkstatus === 'istalkking'}">
      <p class="talentsname" v-if="talk">{{ talentName | truncate(6, '...') }}</p>
      <p class="talentsname" v-else>未記入</p>
      <p class="roomname" v-if="talk">{{ roomName | truncate(6, '...') }}</p>
      <p class="roomname" v-else>未記入</p>
      <p class="roomname" v-if="talk">{{ fanName | truncate(15, '...') }}</p>
      <p class="roomname" v-else>未記入</p>
      <p class="starttime">{{ talk.chat.startTime | timestamp }}</p>
      <p class="texts">〜</p>
      <p class="endtime">{{ talk.chat.endTime | timestamp }}</p>
    </nuxt-link>
  </li>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)

export default {
  data() {
    return {
      nows: ''
    }
  },
  components: {
  },
  props: {
    talk: Object
  },
  mounted() {
    setInterval(() => { this.nows = new Date(); }, 30000)
  },
  methods: {
  },
  computed: {
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
        const nowtime = dayjs().format('X')
        const isTalkStart = dayjs(talkStartTime).format('X')
        const isTalkEnd = dayjs(talkEndTime).format('X')

        if (nowtime > isTalkEnd) {
          status = 'isfinished'
        } else if (nowtime > isTalkStart && nowtime < isTalkEnd) {
          status = 'istalkking'
        } else if (nowtime < isTalkStart) {
          status = 'isfuture'
        }

      }

      return status
    },
    talktime() {

      var counttime = ''

      var now = ''

      if (!this.nows) {
        now = new Date();
      } else {
        now = this.nows
      }
      const talkstarttime = this.talk.chat.startTime * 1000
      const remainingTime = dayjs(talkstarttime).diff(now, 'hours')

      if (remainingTime <= 1) {
        counttime = dayjs(talkstarttime).diff(now, 'minutes') + '分'
      } else if (remainingTime <= 24) {
        counttime = dayjs(talkstarttime).diff(now, 'hours') + '時間'
      } else if (remainingTime > 24) {
        counttime = dayjs(talkstarttime).diff(now, 'days') + '日'
      }

      return 'あと' + counttime
    }
  },
  filters: {
    timestamp(timestamp) {
      if (!timestamp) { return timestamp = '未記入' }
      var day
      // 24時59分までは当日扱い
      if (dayjs(timestamp * 1000).hour() === 0) {
        day = dayjs(timestamp * 1000).add(-1, 'day')
      } else {
        day = dayjs(timestamp * 1000)
      }
      return dayjs(day).format('YYYY/MM/DD kk:mm')
    },
    truncate(value, length, omission) {
      if (!value) {
        value = '未記入'
        return value;
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
.lists li:last-child {
  border: none;
}

.talk-list {
  border-bottom: 2px solid #eee;
  line-height: 55px;
  width: 95%;
  margin: 0 auto;
}

.talk-list p {
  margin-left: 20px;
  width: 20%;
}

.talk-list .texts {
  width: 5%;
}

.isFinished p {
  color: #bbb;
}

.isFuture p {

}

.isTalking p {
  color: #3E52FF;
}

.isFinished:hover {
  filter:brightness(70%);
}

.isTalking:hover {
  /* filter:brightness(70%); */
  opacity: 0.7;
}

/* .遅刻中 p {
  color: #E02020;
} */

.talk-list .talkinglabel {
  color: #3E52FF;
  width: 110px;
  margin-left: -110px;
}

.talk-list .isFuturelabel {
  width: 110px;
  margin-left: -110px;
}

.talk-list .isFinishedlabel {
  color: #bbb;
  width: 110px;
  margin-left: -110px;
}

@media (max-width: 769px) {

  .talk-list {
    display: block;
  }

  .talk-list p {
    margin-left: 20px;
    width: 100%;
    font-size: 10px;
    margin: auto;
  }

  h2 {
    margin-bottom: 15px;
  }

  .fans-title {
    display: block;
  }

  .lengthlabel {
    margin-left: 0;
    margin-bottom: 15px;
    padding-left: 7px;
  }

  .search {
    display: block!important;
  }

  .search input {
    margin-bottom: 10px;
  }

  .sort {
    margin-bottom: 15px;
  }

  .sales-title {
    padding: 0;
  }

  .listslabel p {
    font-size: 10px;
    margin: auto;
  }

  .listslabel .image {
    margin: auto 0 auto 10px;
    width: 30px;
  }

  .listslabel .sales-label {
    width: 15%;
  }

  .t-list .approval {
    width: 15%;
  }

  .talkinglabel {
    display: none;
  }

  .isFuturelabel {
    display: none;
  }

  .isFinishedlabel {
    display: none;
  }

  .starttime {
    line-height: 28px;
  }

  .endtime {
    line-height: 28px;
  }

}
</style>
