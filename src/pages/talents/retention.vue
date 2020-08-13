<template>
  <div class="">
    <menu-head v-bind:title="'出品リテンション'">
      <div class="home-container">
        <div class="main-contents">
          <div class="">
            <h2>出品者の平均出品リテンション</h2>
            <p>N週目のリテンションは登録してからN-1週〜N週までにチケットを出品した出品者の割合表しています。</p>
          </div>
          <div class="graphbox">
            <p class="graphlabel">1週目〜8週目</p>
            <div v-if="talents" class="small">
              <line-chart :chart-data="firstgraph"></line-chart>
            </div>
          </div>
          <div class="graphbox">
            <p class="graphlabel">9週目〜16週目</p>
            <div v-if="talents" class="small">
              <line-chart :chart-data="secondgraph"></line-chart>
            </div>
          </div>
          <div class="graphbox">
            <p class="graphlabel">17週目〜24週目</p>
            <div v-if="talents" class="small">
              <line-chart :chart-data="thirdgraph"></line-chart>
            </div>
          </div>
        </div>
      </div>
    </menu-head>
  </div>
</template>

<script>
import MenuHead from '~/components/MenuHead'
import LineChart from '~/components/LineChart'

export default {
  components: {
    MenuHead,
    LineChart
  },
  data() {
    return {
      firstgraph: null,
      secondgraph: null,
      thirdgraph: null,
    };
  },
  created() {

  },
  mounted() {
    this.$store.dispatch('talent/fetchTalents')
    this.$store.dispatch('talk/fetchTalks')
    this.fillData()
  },
  computed: {
    talents() {
      return this.$store.getters['talent/talents']
    },
    talks() {
      return this.$store.getters['talk/talks']
    }
  },
  methods: {
    fillData () {
      this.firstgraph = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        labels: ['1週目', '2週目', '3週目', '4週目', '5週目', '6週目', '7週目', '8週目'],
        datasets: [
          {
            label: '出品者の平均リテンション(%)',
            // borderCapStyle: 'square',
            borderDashOffset: 'miter',
            tension: 0,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: '#3E52FF',
            data: [this.weeks(1), this.weeks(2), this.weeks(3), this.weeks(4), this.weeks(5), this.weeks(6), this.weeks(7), this.weeks(8)]
          }
        ]
        // options: [
        //   {
        //     responsive: true,
        //     maintainAspectRatio: true,
        //     aspectRatio: 2,
        //   }
        // ]
      },
      this.secondgraph = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        labels: ['9週目', '10週目', '11週目', '12週目', '13週目', '14週目', '15週目', '16週目'],
        datasets: [
          {
            label: '出品者の平均リテンション(%)',
            // borderCapStyle: 'square',
            borderDashOffset: 'miter',
            tension: 0,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: '#3E52FF',
            data: [this.weeks(9), this.weeks(10), this.weeks(11), this.weeks(12), this.weeks(13), this.weeks(14), this.weeks(15), this.weeks(16)]
          }
        ]
      },
      this.thirdgraph = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        labels: ['17週目', '18週目', '19週目', '20週目', '21週目', '22週目', '23週目', '24週目'],
        datasets: [
          {
            label: '出品者の平均リテンション(%)',
            // borderCapStyle: 'square',
            borderDashOffset: 'miter',
            tension: 0,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: '#3E52FF',
            data: [this.weeks(17), this.weeks(18), this.weeks(19), this.weeks(20), this.weeks(21), this.weeks(22), this.weeks(23), this.weeks(24)]
          }
        ]
      }
    },
    weeks(val) {

      var retalent = 0
      var talent = 0

      for (var n in this.talents) {
        var after = this.$dayjs(this.talents[n].info.joined * 1000).add(val * 6, 'day').format('YYYY/MM/DD')
        var before = this.$dayjs(after).add(-6, 'day').format('YYYY/MM/DD')
        var now = this.$dayjs().format('YYYY/MM/DD')

        // その週のタレントの数
        if (after <= now) {
          talent += 1
        }

        // その週にそのタレントが出品したかどうか
        for (var i in this.talks) {
          var talk = 0
          var createdat = this.$dayjs(this.talks[i].chat.createdAt * 1000).format('YYYY/MM/DD')
          if (this.talks[i].chat.talentId === this.talents[n].info.userid && before <= createdat && createdat <= after) {
            talk += 1
            retalent += 1
          }
          if (talk === 1) {
            break;
          }
        }

      }

      var retention = Math.round((retalent / talent) * 100)
      return retention
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

<style>
.small {
  max-width: 600px;
  /* max-height: 600px; */
  margin:  50px auto;
}

.graphbox {
  margin-top: 60px;
}

.graphlabel {
  text-align: center;
}
</style>
