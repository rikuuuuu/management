<template>
  <div class="">
    <div v-show="loading" class="loader center-loader"></div>
    <menu-head v-show="!loading" v-bind:title="'パートナー登録'">
      <div class="home-container">
        <div class="news-contents main-contents">
          <div class="partner-title">
            <h2>パートナー登録</h2>
          </div>
          <div class="partner-title">
            <h3>パートナー名</h3>
            <input type="text" name="" value="" v-model="name">
          </div>
          <div class="partner-title">
            <h3>パスワード</h3>
            <input type="password" name="" value="" v-model="pass">
          </div>
          <div v-show="createloading" class="loader"></div>
          <div v-show="!createloading">
            <div class="news-create-button">
              <button v-on:click="btnSubmit" type="button" name="button">作成</button>
            </div>
          </div>
        </div>
      </div>
    </menu-head>
  </div>
</template>

<script>
import MenuHead from '~/components/MenuHead'

export default {
  components: {
    MenuHead
  },
  data() {
    return {
      loading: true,
      createloading: false,
      name: '',
      pass: ''
    };
  },
  created() {

  },
  mounted() {
    this.loading = false
  },
  methods: {
    btnSubmit() {

      if (!this.name || !this.pass) {
        this.$toast.error('空欄があります')
        return
      }

      this.createloading = true

      const p_ref = this.$firestore.collection('partners')

      p_ref.add({
        name: this.name,
        pass: this.pass,
        registTime: new Date()
      }).then(doc => {
        p_ref.doc(doc.id).update({
          id: doc.id
        });
        this.name = ''
        this.pass = ''
        this.createloading = false
        this.$toast.success('登録が完了しました')
      }).catch(error => {
        this.$toast.error('登録に失敗しました')
      });

    }
  }
}
</script>

<style>
.partner-title {
  margin-bottom: 20px;
}

.partner-title input {
  height: 40px;
  width: 100%;
}

.news-create-button {
  text-align: center;
  margin: 50px 0;
}

</style>
