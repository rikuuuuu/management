<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'レッスン一覧'">
      <div class="home-container">
        <div class="fans-contents main-contents">
          <div class="fans-title flex">
            <h2>レッスン</h2>
            <div class="reflesh">
              <button @click="reflesh" class="nbutton" type="button" name="button">
                <img src="/reload.png" alt="">
              </button>
            </div>
            <div class="search flex">
              <input v-model="selectName" type="text" name="" value="" placeholder="出品者名 検索">
              <input v-model="selectId" type="text" name="" value="" placeholder="ID 検索">
              <div class="sort">
                <button @click="sortBy('createdAt')" :class="sortedClass('createdAt')" type="button" name="button">新着順</button>
                <button @click="sortBy('startTime')" :class="sortedClass('startTime')" type="button" name="button">開始時刻順</button>
              </div>
            </div>
          </div>
          <div class="flex listslabel">
            <p>出品者名</p>
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
            <p class="no-talks" v-show="talks.length === 0">レッスンが存在しません</p>
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
      isFinished: false,
      isFuture: false,
      isTalking: false,
      loading: true,
      // adminpartner: null,
      selectName: '',
      selectId: '',
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
  mounted() {
  },
  created() {
    // this.$store.commit('talk/fleshTalks')

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
    reflesh() {
      this.$store.commit('talk/fleshTalks')
      this.loading = true

      if (this.adminpartner !== null) {

        var partnerid = this.adminpartner
        this.$store.dispatch('talent/fetchPartnersTalents', { partnerid })
      } else {

        this.$store.dispatch('talent/fetchTalents')
        this.$store.dispatch('room/fetchRooms')
        this.$store.dispatch('talk/fetchTalks')

      }

      this.loading = false
    },
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
      var talents = this.$store.getters['talent/talents']
      var list = items.slice();
      var now = Number(this.$dayjs().format('X'))

      if (list) {
        list.sort((a, b) => {
          a = a.chat.startTime
          b = b.chat.startTime

          return (a === b ? 0 : a > b ? 1 : -1) * (this.sort.isAsc ? 1 : -1)
        });


        list.sort((a, b) => {
          if (a.chat.endTime > now && b.chat.endTime > now ) {
            a = a.chat.startTime
            b = b.chat.startTime

            return (a === b ? 0 : a < b ? 1 : -1) * (this.sort.isAsc ? 1 : -1)
          }
        });

      }

      if (!!this.sort.key) {
        list.sort((a, b) => {
          a = a.chat[this.sort.key]
          b = b.chat[this.sort.key]

          return (a === b ? 0 : a > b ? 1 : -1) * (this.sort.isAsc ? 1 : -1)
        });
      }

      if (this.selectName) {
        list = list.filter(element => {
          var talent = talents.find(p => p.info.userid === element.chat.talentId)
          if ( talent.info.nickName.indexOf(this.selectName) != -1) {
            return element
          }
        });
      }

      if (this.selectId) {
        list = list.filter(element => {
          if ( element.chat.tid.indexOf(this.selectId) != -1) {
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

@media (max-width: 769px) {

  .listslabel p {
    margin: auto;
  }
}
</style>
