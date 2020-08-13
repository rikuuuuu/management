<template>
  <li class="flex talk-list">
    <nuxt-link v-if="room && talks" :to="{ name: 'talkrooms-id', params: { id: room.talkroom.rid }}" class="links list-a flex">
      <p class="talentsname" v-if="room.talkroom">{{ talentName | truncate(8, '...') }}</p>
      <p class="roomname" v-if="room.talkroom">{{ room.talkroom.name | truncate(8, '...') }}</p>
      <p class="roomname right countlabel" v-if="room.talkroom">{{ room.talkroom.primaryNumber }}</p>
      <p class="roomname right countlabel">{{ finishedtalkcount }}</p>
      <p class="roomname right countlabel">{{ buytalkcount }}</p>
      <!-- <p class="roomname right countlabel">{{ buytalkcount }}</p> -->
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
    }
  },
  components: {
  },
  props: [
    'room',
    'talks'
  ],
  mounted() {
  },
  methods: {
  },
  computed: {
    talentName() {
      const tid = this.room.talkroom.talentId
      const talent = this.$store.getters['talent/talents'].find(p => p.info.userid === tid)
      return talent.info.nickName
    },
    finishedtalkcount() {

      const now = dayjs().format('YYYY/MM/DD hh:mm:ss')

      var talks = this.talks

      var buytalk = 0
      var finishedtalk = 0

      const roomId = this.room.talkroom.rid

      for ( var n in this.talks ) {
        for ( var id in this.talks[n].chat.roomIds ) {
          if ( roomId === this.talks[n].chat.roomIds[id] ) {
            if ( this.talks[n].chat.userId ) {
              buytalk += 1
              const talkendtime = dayjs(this.talks[n].chat.startTime * 1000).format('YYYY/MM/DD hh:mm:ss')
              if ( now >= talkendtime ) {
                finishedtalk += 1
              }
            }
          }
        }
      }

      return finishedtalk + ' ' + '/' + ' ' + buytalk

    },
    buytalkcount() {

      var talks = this.talks

      var alltalk = 0
      var buytalk = 0

      const roomId = this.room.talkroom.rid

      for ( var n in this.talks ) {
        for ( var id in this.talks[n].chat.roomIds ) {
          if (roomId === this.talks[n].chat.roomIds[id]) {
            alltalk += 1
            if (this.talks[n].chat.userId) {
              buytalk += 1
            }
          }
        }
      }

      return buytalk + ' ' + '/' + ' ' + alltalk
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
  width: 6%;
}

.talk-list .countlabel {
  width: 20%;
}

@media (max-width: 769px) {

  .talk-list {
    display: block;
  }

  .talk-list p {
    margin-left: 10px;
    width: 100%;
    font-size: 12px;
    margin: auto;
  }

  .talk-list .countlabel {
    width: 45%;
  }

}


</style>
