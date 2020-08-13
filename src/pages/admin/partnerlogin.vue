<template>
  <div class="login-container">
    <div v-show="loading" class="loader center-loader"></div>
    <div v-show="!loading" class="login-contents box-shadow">
      <div class="login-items">
        <div class="login-img">
          <img src="/O2_fix.png" alt="">
          <p>O2パートナー事務所ログイン</p>
        </div>
        <div class="login-inputs-contents">
          <div class="login-inputs">
            <input type="" name="" value="" v-model="id" placeholder="事務所ID">
            <input type="password" name="" value="" v-model="password" placeholder="パスワード">
            <div v-show="bloading" class="loader"></div>
            <button v-show="!bloading" class="button-b" type="button" name="button" @click="login">ログイン</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loading: true,
      bloading: false,
      id: '',
      password: '',
      pass: ''
    }
  },
  components: {
  },
  computed: {
  },
  created() {
    this.localstorageClear()
  },
  mounted() {
    this.loading = false
  },
  methods: {
    fetch() {
      this.$firestore.collection('partners').where('id', '==', this.id).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.pass = doc.data()

          this.path()
          this.bloading = false

        })
        if (!this.pass) {
          this.$toast.error('IDが違います')
        }
        this.bloading = false
      })
    },
    path() {
      if (this.password === this.pass.pass) {
        const adminpartner = this.id
        this.$toast.success('ログインしました')
        this.$store.commit("partnerAuth", adminpartner);

        this.$router.push('/')
      } else {
        this.$toast.error('パスワードが違います')
      }

    },
    login() {

      this.bloading = true
      this.fetch()

    },
    localstorageClear() {
      this.$store.commit('fan/fleshFans')
      this.$store.commit('talent/fleshTalents')
      this.$store.commit('fan/fleshapFans')
      this.$store.commit('talent/fleshapTalents')
      this.$store.commit('partner/fleshPartners')
      this.$store.commit('talk/fleshTalks')
      this.$store.commit('room/fleshRooms')
      this.$store.commit('payment/fleshPayments')
      this.$store.commit('payout/fleshPayouts')
    }
  }
}
</script>

<style>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-contents {
  width: 50vw;
  max-width: 620px;
  height: fit-content;
  margin: 0;
}

.login-items {
margin: 60px 0 80px;
}

.login-img {
  text-align: center;
  margin-bottom: 10px;
}

.login-img img {
  width: 150px;
  height: 150px;
}

.login-inputs-contents {

}

.login-inputs {
  width: 50%;
  margin: 0 auto;
  text-align: center;
}

.login-inputs input {
  margin-top: 50px;
  width: 100%;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
}

.login-inputs button {
  margin: 50px 10px 20px;
  width: 40%;
  height: 40px;
  border-radius: 20px;
}

@media (max-width: 769px) {

  .login-contents {
    width: 80vw;
    height: fit-content;
    margin: 0;
  }

  .login-items {
  margin: 30px 0 70px;
  }

  .login-img {
    text-align: center;
    margin-bottom: 10px;
  }

  .login-img img {
    width: 100px;
    height: 100px;
  }

  .login-inputs-contents {

  }

  .login-inputs {
    width: 70%;
    margin: 0 auto;
    text-align: center;
  }

  .login-inputs input {
    margin-top: 30px;
    width: 100%;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #ccc;
    font-size: 14px;
  }

  .login-inputs button {
    margin: 30px 0 0 0;
    width: 100%;
    height: 40px;
    border-radius: 20px;
  }

}


</style>
