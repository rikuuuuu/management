<template>
  <li class="flex fan-list">
    <nuxt-link v-if="partner" :to="{ name: 'partners-id', params: { id: partner.pal.id }}" class="links list-a flex">
      <p class="fansname" v-if="partner.pal.name">{{ partner.pal.name }}</p>
      <p class="fansname" v-else>未記入</p>
      <!-- <p class="realname" v-if="partner.talent">{{ partner.talent.nickName }}</p>
      <p class="realname" v-else>未記入</p> -->
      <p class="realname" v-if="talents">{{ talentscount }}人</p>
      <!-- <p class="realname" v-if="talents.length === 0">0</p> -->
      <p class="realname">{{ partner.pal.id }}</p>
    </nuxt-link>
  </li>
</template>

<script>

export default {
  data() {
    return {
      none: false
    }
  },
  components: {
  },
  props: [
    'partner',
    'talents'
  ],
  mounted() {
  },
  methods: {
  },
  computed: {
    talentscount() {
      var count = 0

      for ( var n in this.talents ) {
        if (this.partner.pal.id === this.talents[n].info.partnerId) {
          count += 1
        }
      }

      return count
    }
  }
}
</script>

<style>
.lists li:last-child {
  border: none;
}

.fan-list {
  border-bottom: 2px solid #eee;
  line-height: 55px;
  width: 95%;
  margin: 0 auto;
}

.fan-list img {
  width: 40px;
  height: 40px;
  margin: auto 0 auto 20px;
  border-radius: 50%;
}

.fan-list p {
  margin-left: 20px;
  width: 20%;
}

.fan-list .approval {
  width: 10%;
}

@media (max-width: 769px) {

  .fan-list img {
    width: 30px;
    height: 30px;
    margin: auto 0 auto 10px;
  }

  .fan-list p {
    font-size: 14px;
    width: 25%;
  }

  .fan-list .userid {
    display: none;
  }

}

</style>
