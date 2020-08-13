<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'レッスン監視'">
      <div class="home-container">
        <div class="fans-contents main-contents">
          <div class="fans-title flex">
            <h2>レッスン</h2>
            <div class="search flex">
              <input v-model="selectName" type="text" name="" value="" placeholder="出品者名 検索">
              <div class="sort">
                <button @click="sortBy('createdAt')" :class="sortedClass('createdAt')" type="button" name="button">新着順</button>
                <button @click="sortBy('talkStartTime')" :class="sortedClass('talkStartTime')" type="button" name="button">開始時刻順</button>
              </div>
            </div>
          </div>
          <div class="flex listslabel">
            <p v-show="talks">出品者名</p>
            <p>ルーム名</p>
            <p>購入者名</p>
            <p>開始時刻</p>
            <p class="texts">〜</p>
            <p>終了時刻</p>
          </div>
          <div v-show="loading" class="loader"></div>
          <div v-show="!loading">
            <ul v-show="talks.length !== 0" class="lists list-box-shadow">
              <All-Talks v-for="(talk, index) in talks" :key="index" :talk="talk" />
            </ul>
            <p class="no-talks" v-show="talks.length === 0">現在進行中のレッスンはありません</p>
          </div>
        </div>
      </div>
    </menu-head>
  </div>
</template>

<script>
import MenuHead from '~/components/MenuHead'
import AllTalks from '~/components/AllTalks'

export default {
  data() {
    return {
      loading: true,
      // adminpartner: null,
      selectName: '',
      sort: {
        key: '',
        isAsc: false
      }
    }
  },
  components: {
    MenuHead,
    AllTalks
  },
  // async asyncData({ store }) {
  //   if (store.state.adminpartner) {
  //     return
  //   } else {
  //     await store.dispatch('fan/fetchFans')
  //     await store.dispatch('talent/fetchTalents')
  //     await store.dispatch('room/fetchRooms')
  //     await store.dispatch('talk/fetchTalks')
  //     // await store.dispatch('payment/fetchPayments')
  //   }
  // },
  mounted() {
  },
  created() {
    this.adminpartner

    if (this.adminpartner !== null) {

      var partnerid = this.adminpartner
      this.$store.dispatch('talent/fetchPartnersTalents', { partnerid })
    } else {

      this.$store.dispatch('talent/fetchTalents')
      this.$store.dispatch('room/fetchRooms')
      this.$store.dispatch('talk/fetchTalks')

    }

    this.pageloading = false
    this.loading = false
  },
  methods: {
    sortBy: function(key) {
      this.sort.isAsc = this.sort.key === key ? !this.sort.isAsc : false;
      this.sort.key = key;
    },
    sortedClass: function(key) {
      return this.sort.key === key ? `sorted ${this.sort.isAsc ? 'asc' : 'desc' }` : '';
    }
  },
  computed: {
    adminpartner() {
      return this.$store.getters['adminpartner']
    },
    talks() {

      var items = this.$store.getters['talk/talks']
      var list = items.slice();

      if (!!this.sort.key) {
        list.sort((a, b) => {
          a = a.chat[this.sort.key]
          b = b.chat[this.sort.key]

          return (a === b ? 0 : a > b ? 1 : -1) * (this.sort.isAsc ? 1 : -1)
        });
      }

      if (this.selectName) {
        list = list.filter(element => {
          if ( element.talent.nickName.indexOf(this.selectName) != -1) {
            return element.talent.nickName
          }
        });
      }

      if (list) {
        list = list.filter(element => {
          const start = element.chat.startTime * 1000
          const end = element.chat.endTime * 1000
          const Start = this.$dayjs(start).format('YYYY/MM/DD hh:mm:ss')
          const End = this.$dayjs(end).format('YYYY/MM/DD hh:mm:ss')
          const now = this.$dayjs().format('YYYY/MM/DD hh:mm:ss')
          if ( Start <= now && now < End ) {
            return element
          }
        });
      }

      return list;
    }
  }
}
</script>

<style>
.listslabel {
  margin: 0 auto 20px;
  width: 95%;
}

.listslabel p {
  margin-left: 20px;
  width: 20%;
  color: #999;
}

.listslabel .texts {
  width: 5%;
}
</style>
