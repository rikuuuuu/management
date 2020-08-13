<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'レッスンルーム一覧'">
      <div class="home-container">
        <div class="fans-contents main-contents">
          <div class="fans-title flex">
            <h2>レッスンルーム</h2>
            <div class="reflesh">
              <button @click="reflesh" class="nbutton" type="button" name="button">
                <img src="/reload.png" alt="">
              </button>
            </div>
            <div class="search flex">
              <input v-model="selectName" type="text" name="" value="" placeholder="タレント名 検索">
              <div class="sort">
                <button @click="sortBy('created')" :class="sortedClass('created')" type="button" name="button">新着順</button>
                <button @click="sortBy('primaryNumber')" :class="sortedClass('primaryNumber')" type="button" name="button">評価点順</button>
              </div>
            </div>
          </div>
          <div class="flex listslabel">
            <p>出品者名</p>
            <p>ルーム名</p>
            <p class="right countlabel">評価点</p>
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
      loading: true,
      pageloading: true,
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
    AllTalkrooms
  },
  created() {
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
  mounted() {
  },
  methods: {
    reflesh() {
      this.$store.commit('room/fleshRooms')

      if (this.adminpartner !== null) {

        var partnerid = this.adminpartner
        this.$store.dispatch('talent/fetchPartnersTalents', { partnerid })
      } else {

        this.$store.dispatch('talent/fetchTalents')
        this.$store.dispatch('room/fetchRooms')
        this.$store.dispatch('talk/fetchTalks')

      }
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
      return this.$store.getters['talk/talks']
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

      if (this.selectName) {
        list = list.filter(element => {
          var talent = this.$store.getters['talent/talents'].find(p => p.info.userid === element.talkroom.talentId)
          if ( talent.info.nickName.indexOf(this.selectName) != -1) {
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

.listslabel .countlabel {
  width: 20%;
}

@media (max-width: 769px) {

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
    font-size: 12px;
    margin: auto;
  }

  .listslabel .sales-label {
    width: 15%;
  }

  .t-list .approval {
    width: 15%;
  }

}
</style>
