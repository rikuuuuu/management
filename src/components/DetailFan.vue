<template>
  <div class="fan-info-contents box-shadow">
    <div class="flex">
      <div class="left-contetns">
        <div class="flex detail-top-contens">
          <img src="/O2_fix.png" alt="">
          <div class="fan-name">
            <p>ファン名</p>
            <p>UserId</p>
          </div>
        </div>
        <div class="fans-info">
          <p>承認済み</p>
          <p>本名（漢字）</p>
          <p>本名（カナ）</p>
          <p>性別</p>
          <p>年齢</p>
          <p>email@address.com</p>
          <p>作成日時</p>
          <p>更新日時</p>
          <p>職業</p>
          <p>住所</p>
          <p>学校</p>
        </div>
      </div>
      <div class="right-contetns">
        <div class="fans-info-right">
          <p>保有ポイント：　3000</p>
          <p>使用金額：　3000円</p>
          <p>総トーク数：　30</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      none: false
    }
  },
  props: {
    fan: Object
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style>
.fan-info-contents {
  width: 100%;
  height: 70vh;
  padding: 20px;
}

.left-contetns {
  width: 50%;
}

.detail-top-contens img {
  width: 80px;
  height: 80px;
  border-radius: 40px;
}

.fan-name p {
  line-height: 40px;
  margin-left: 20px;
}

.right-contetns {
  width: 50%;
}

.fans-info p {
  margin-top: 25px;
}

.fans-info-right p {
  margin-bottom: 25px;
  line-height: 40px;
}
</style>
