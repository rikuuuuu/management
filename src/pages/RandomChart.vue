<template>
  <div class="small">
    <line-chart :chart-data="datacollection"></line-chart>
    <button @click="fillData()">Randomize</button>
  </div>
</template>

<script>
import LineChart from '~/components/LineChart'

  export default {
    components: {
      LineChart
    },
    data () {
      return {
        datacollection: null
      }
    },
    mounted () {
      this.fillData()
    },
    methods: {
      fillData () {
        this.datacollection = {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 2,
          labels: [0, 1, 2, 3, 4],
          datasets: [
            {
              label: 'Data One',
              // borderCapStyle: 'square',
              borderDashOffset: 'miter',
              tension: 0,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderColor: '#3E52FF',
              data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
            }
            // {
            //   label: 'Data two',
            //   backgroundColor: '#f87979',
            //   data: [this.getRandomInt(), this.getRandomInt()]
            // }
          ]
        }
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
</style>
