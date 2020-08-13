<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'パートナー一覧'">
      <div class="home-container">
        <div class="fans-contents main-contents">
          <div class="fans-title flex">
            <h2>パートナー</h2>
            <div class="search flex">
              <a class="p-link" href="/partners/create">パートナー新規登録</a>
              <input v-model="selectName" type="text" name="" value="" placeholder="パートナー名 検索">
              <div class="sort">
                <button @click="sortBy('createdAt')" :class="sortedClass('createdAt')" type="button" name="button">新着順</button>
              </div>
            </div>
          </div>
          <div class="flex listslabel">
            <p>パートナー名</p>
            <p>所属出品数</p>
            <p>パートナーID</p>
          </div>
          <div v-show="loading" class="loader"></div>
          <div v-show="!loading">
            <ul v-show="partners.length !== 0" class="lists list-box-shadow">
              <All-Partners v-bind:talents="talents" v-for="(partner, index) in partners" :key="index" :partner="partner" />
            </ul>
            <p class="no-talks" v-show="partners.length === 0">パートナーが存在しません</p>
          </div>
        </div>
      </div>
    </menu-head>
  </div>
</template>

<script>
import MenuHead from '~/components/MenuHead'
import AllPartners from '~/components/AllPartners'

export default {
  data() {
    return {
      loading: true,
      pageloading: true,
      selectName: '',
      sort: {
        key: '',
        isAsc: false
      }
    }
  },
  components: {
    MenuHead,
    AllPartners
  },
  created() {
    this.$store.dispatch('partner/fetchPartners')
    this.$store.dispatch('talent/fetchTalents')
    this.pageloading = false
    this.loading = false
  },
  mounted() {
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
    talents() {
      return this.$store.getters['talent/talents']
    },
    partners() {

      var items = this.$store.getters['partner/partners']

      var list = items.slice();

      if (!!this.sort.key) {
        list.sort((a, b) => {
          a = a.pal[this.sort.key]
          b = b.pal[this.sort.key]

          return (a === b ? 0 : a > b ? 1 : -1) * (this.sort.isAsc ? 1 : -1)
        });
      }

      if (this.selectName) {
        list = list.filter(element => {
          if ( element.pal.name.indexOf(this.selectName) != -1) {
            return element.pal.name
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

.listslabel .image {
  width: 40px;
  margin: auto 0 auto 20px;
}

.listslabel .app {
  width: 10%;
}

.p-link {
  margin-right: 50px;
  line-height: 35px;
}

@media (max-width: 769px) {

}
</style>
