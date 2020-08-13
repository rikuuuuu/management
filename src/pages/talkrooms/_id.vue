<template>
  <div class="">
    <div v-show="pageloading" class="loader center-loader"></div>
    <menu-head v-show="!pageloading" v-bind:title="'レッスン詳細'">
      <div class="home-container">
        <div v-if="fetch" class="main-contents">
          <div class="flex talkroom-title">
            <h2>レッスンルーム</h2>
            <p class="cautions">*仮売上：　購入され、レッスンが済んでいない分の売り上げ</p>
          </div>
          <div class="room-info-contents box-shadow">
            <div class="flex info-contents">
              <div class="left-contetns">
                <div class="">
                  <div class="room-images">
                    <img :src="room.talkroom.imageLink1" alt="">
                    <img :src="room.talkroom.imageLink2" alt="">
                    <img :src="room.talkroom.imageLink3" alt="">
                  </div>
                  <div class="room-detail">
                    <div class="flex">
                      <p class="p-gray left-content-key">ルーム名：</p>
                      <p>{{ room.talkroom.name | truncate(15, '...') }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">ルームID：</p>
                      <p>{{ room.talkroom.rid }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">出品者名：</p>
                      <p>{{ talent.info.nickName }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">出品者ID：</p>
                      <p>{{ room.talkroom.talentId }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">ジャンル：</p>
                      <p>{{ genre }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">タグ：</p>
                      <p>{{ tag }}</p>
                    </div>
                    <div class="flex">
                      <p class="p-gray left-content-key">詳細画面：</p>
                      <p>{{ room.talkroom.detail | truncate(15, '...') }}</p>
                    </div>
                    <div class="">
                      <div v-if="this.room.talkroom.hasVideo" class="roomvideo">
                        <video v-show="watchVideo" :src="this.room.talkroom.imageLink3" controls>

                        </video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="right-contetns">
                <div class="rooms-info-right">
                  <div class="flex">
                    <p class="p-gray right-content-key">仮売り上げ金額*：</p>
                    <p class="right-content-value">{{ provisionalsales }}円</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">仮売り上げポイント：</p>
                    <p class="right-content-value">{{ provisionalsales / 2 }}P</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">売り上げ金額：</p>
                    <p class="right-content-value">{{ roomsales }}円</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">売り上げポイント：</p>
                    <p class="right-content-value">{{ roomsales / 2 }}P</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">総出品レッスン数：</p>
                    <p class="right-content-value">{{ alltalkscount }}回</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">購入されたレッスン数：</p>
                    <p class="right-content-value">{{ talkscount }}回</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">これからのレッスン数：</p>
                    <p class="right-content-value">{{ futuretalkcount }}回</p>
                  </div>
                  <div class="flex">
                    <p class="p-gray right-content-key">完遂したレッスン数：　</p>
                    <p class="right-content-value">{{ finishedtalkcount }}回</p>
                  </div>
                </div>
                <div v-if="this.room.talkroom.hasVideo" class="videobuttons">
                  <button v-show="!watchVideo" @click="showVideo" class="button-b" type="button" name="button">詳細動画を表示</button>
                  <button v-show="watchVideo" @click="showVideo" class="button-b" type="button" name="button">詳細動画を非表示</button>
                  <!-- <button class="button-b" @click="edit" type="button" name="button" v-if=isActive>編集する</button>
                  <button @click="save" type="button" name="button" v-if=isActive>保存する</button>
                  <button class="deletebutton" @click="deleteaccount" type="button" name="button" v-show="isActive && adminpartner === null">レッスンルーム削除</button> -->
                </div>
                <div v-if="!this.room.talkroom.hasVideo" class="videobuttons">
                  <button class="button-b" type="button" name="button">詳細動画はありません</button>
                </div>
              </div>
            </div>
          </div>
          <div class="box-shadow primary-contents flex">
            <div class="primarynumber-box flex">
              <p class="p-gray primarykey">primaryNumber:　</p>
              <input v-bind:class="{ active: isActive }" type="text" name="app" v-model="room.talkroom.primaryNumber" placeholder="primaryNumber">
            </div>
            <div v-if="!adminpartner" class="p-buttons">
              <button class="button-b" @click="edit" type="button" name="button" v-if=!isActive>編集する</button>
              <button @click="save" type="button" name="button" v-if=isActive>保存する</button>
            </div>
          </div>
          <div class="flex">
            <h2>レッスン</h2>
            <div class="search flex">
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
          <div v-show="talks" class="">
            <ul v-show="talks.length !== 0" class="lists list-box-shadow">
              <All-Talks v-for="(talk, index) in talks" :key="index" :talk="talk" />
            </ul>
            <p class="no-talks" v-show="talks.length === 0">このレッスンルームにはレッスンがありません</p>
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
      fetch: false,
      loading: true,
      pageloading: true,
      adminpartner: null,
      isActive: false,
      watchVideo: false,
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
  created() {
  },
  async mounted() {
    this.adminpartner = this.$store.state.adminpartner

    if (this.$store.getters['room/rooms'].find(p => p.talkroom.rid === this.$route.params.id)) {
      this.fetch = true
    } else {
      await this.$store.dispatch('room/fetchRooms')
      await this.$store.dispatch('talk/fetchTalks')
      this.fetch = true
    }

    this.pageloading = false
    this.loading = false
  },
  methods: {
    showVideo() {
      if (this.watchVideo === true) {
        this.watchVideo = false
      } else {
        this.watchVideo = true
      }
    },
    sortBy: function(key) {
      this.sort.isAsc = this.sort.key === key ? !this.sort.isAsc : false;
      this.sort.key = key;
    },
    sortedClass: function(key) {
      return this.sort.key === key ? `sorted ${this.sort.isAsc ? 'asc' : 'desc' }` : '';
    },
    edit() {
      this.isActive = true;
    },
    save() {

      var primarynumber = Number(this.room.talkroom.primaryNumber)

      if (primarynumber === 0) {

      } else if (!primarynumber) {
        this.$toast.success('数字で入力してください')
        return
      }

      this.$firestore.collection('rooms').doc(this.room.talkroom.rid).update({
        primaryNumber: primarynumber
      });

      this.isActive = false;
      this.$toast.success('保存されました')
    },
    deleteaccount() {

      if(confirm('本当にレッスンを削除してよろしいですか？')){

        this.deletetalks();

        this.$toast.error('削除しました。');

        this.$router.push({ path: '/talks/all' })
      }
    },
    deletetalks() {
      this.$firestore.collection('talks').doc(this.talkid).delete().then(function() {
          console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
    }
  },
  computed: {
    provisionalsales() {
      var sales = 0

      var now = this.$dayjs().format('YYYY/MM/DD')

      for ( var n in this.talks ) {
        var starttime = this.$dayjs(this.talks[n].chat.startTime * 1000).format('YYYY/MM/DD')
        if ( now < starttime && this.talks[n].chat.userId ) {
          sales += this.talks[n].chat.price
        }
      }

      return sales
    },
    finishedtalkcount() {
      var count = 0

      var now = this.$dayjs().format('YYYY/MM/DD')

      for ( var n in this.talks ) {
        var endtime = this.$dayjs(this.talks[n].chat.endTime * 1000).format('YYYY/MM/DD')
        if ( now > endtime && this.talks[n].chat.userId ) {
          count += 1
        }
      }

      return count
    },
    futuretalkcount() {
      var count = 0

      var now = this.$dayjs().format('YYYY/MM/DD')

      for ( var n in this.talks ) {
        var starttime = this.$dayjs(this.talks[n].chat.startTime * 1000).format('YYYY/MM/DD')
        if ( now < starttime && this.talks[n].chat.userId ) {
          count += 1
        }
      }

      return count
    },
    talkscount() {
      var count = 0

      for ( var n in this.talks ) {
        if ( this.talks[n].chat.userId ) {
          count += 1
        }
      }

      return count
    },
    alltalkscount() {
      var count = 0

      for ( var n in this.talks ) {
        count += 1
      }

      return count
    },
    roomsales() {
      var sales = 0

      var now = this.$dayjs().format('YYYY/MM/DD')

      for ( var n in this.talks ) {
        var endtime = this.$dayjs(this.talks[n].chat.endTime * 1000).format('YYYY/MM/DD')
        if ( now > endtime && this.talks[n].chat.userId ) {
          sales += this.talks[n].chat.price
        }
      }

      return sales
    },
    talent() {
      return this.$store.getters['talent/talents'].find(p => p.info.userid === this.room.talkroom.talentId)
    },
    room() {
      return this.$store.getters['room/rooms'].find(p => p.talkroom.rid === this.$route.params.id)
    },
    talks() {
      var items = this.$store.getters['talk/talks']
      var now = Number(this.$dayjs().format('X'))

      var list = items.slice();

      if (list) {
        list.sort((a, b) => {
          a = a.chat.startTime
          b = b.chat.startTime

          return (a === b ? 0 : a > b ? 1 : -1) * (this.sort.isAsc ? 1 : -1)
        });


        list.sort((a, b) => {
          if (a.chat.endTime > now && b.chat.endTime > now ) {
            a = a.chat.endTime
            b = b.chat.endTime

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

      if (this.$route.params.id) {
        list = list.filter(element => {
          if ( element.chat.roomIds ) {
            for ( var id in element.chat.roomIds ) {
              if ( this.$route.params.id === element.chat.roomIds[id] ) {
                return element
              }
            }
          }
        })
      }

      return list;
    },
    tag() {
      var tag
      if (this.room.talkroom.genreId === 0) {
        tag = '美容'
      } else if (this.room.talkroom.genreId === 1) {
        tag = 'ファッション'
      } else if (this.room.talkroom.genreId === 2) {

        switch (this.room.talkroom.tagId) {
          case 0:
            tag = 'ダイエット'
          case 1:
            tag = 'ヨガ'
            break;
          default:
        }

      } else if (this.room.talkroom.genreId === 3) {

        switch (this.room.talkroom.tagId) {
          case 0:
            tag = '写真'
          case 1:
            tag = 'アート'
            break;
          case 2:
            tag = 'ユーチューバー'
            break;
          case 3:
            tag = 'Tiktoker'
            break;
          default:
        }

      } else if (this.room.talkroom.genreId === 4) {

        switch (this.room.talkroom.tagId) {
          case 0:
            tag = '芸人'
          case 1:
            tag = 'モデル'
            break;
          case 2:
            tag = '美容整形'
            break;
          case 3:
            tag = '育児'
            break;
          case 4:
            tag = '料理'
            break;
          case 5:
            tag = 'アイドル'
            break;
          case 6:
            tag = 'コスプレ'
            break;
          case 7:
            tag = '占い'
            break;
          case 8:
            tag = 'ビジネス'
            break;
          case 9:
            tag = '自己啓発'
            break;
          case 10:
            tag = '声優'
            break;
          case 11:
            tag = 'インスタ映え'
            break;
          case 12:
            tag = 'コーチング'
            break;
          case 13:
            tag = '旅'
            break;
          case 14:
            tag = 'メンタルヘルスケア'
            break;
          default:
        }

      }

      return tag
    },
    genre() {
      var genre
      switch (this.room.talkroom.genreId) {
        case 0:
          genre = 'コスメ・メイク'
          break;
        case 1:
          genre = 'ファッション'
          break;
        case 2:
          genre = 'ダイエット・ヨガ'
          break;
        case 3:
          genre = 'クリエイター'
          break;
        case 4:
          genre = 'その他'
          break;
        default:

      }
      return genre
    },
  },
  filters: {
    timestamp(timestamp) {
      var day
      if (dayjs(timestamp.seconds * 1000).hour() === 0) {
        day = dayjs(timestamp.seconds * 1000).add(-1, 'day')
      } else {
        day = dayjs(timestamp.seconds * 1000)
      }
      return dayjs(day).format('YYYY/MM/DD kk:mm')
    },
    truncate(value, length, omission) {
      if (value === 1) {
        value = '未記入'
        return value;
      } else if (!value) {
        return value = '未記入'
      }
      var length = length ? parseInt(length, 10) : 20;
      var ommision = omission ? omission.toString() : '...';

      if (value.length <= length) {
        return value;
      }

      return value.substring(0, length) + ommision;
    }
  }
}
</script>

<style>
.roomvideo video {

}

.primary-contents {
  margin: 0 0 50px 0;
  height: fit-content;
}

.primarynumber-box {

}

.primarykey {
  width: 170px;
  line-height: 40px;
  padding: 20px;
}

.p-buttons {
  /* text-align: center; */
  width: 100%;
}

.p-buttons button {
  margin: 20px 0 20px 220px;
}

.primarynumber-box input {
  border: none;
  padding: 0;
  font-size: 16px;
  height: 40px;
  width: 80px;
  margin: 20px 0;
  border-radius: 0;
  pointer-events: none;
}

.primarynumber-box .active {
  border-bottom: 1px solid #ccc;
  border-radius: 0;
  padding: 5px;
  /* margin: 25px 24px 0 0; */
  pointer-events: all;
}

.room-info-contents {
  width: 100%;
  height: fit-content;
  padding: 20px;
  margin-bottom: 50px;
}

.left-contetns {
  width: 50%;
}

.room-images {
  margin-bottom: 24px;
}

.room-images img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.left-content-key {
  width: 90px;
}

.room-detail p {
  line-height: 40px;
  margin-bottom: 25px;
}

.right-contetns {
  width: 50%;
}

.right-content-key {
  width: 170px;
}

.rooms-info p {
  line-height: 40px;
  margin: 0 0 25px 0;
}

.rooms-info-right p {
  margin-bottom: 25px;
  line-height: 40px;
}

.videobuttons {
  margin: 10px 0;
}

.videobuttons button {
  width: auto;
  padding: 0 15px;
}

.listslabel {
  margin-bottom: 20px;
}

.listslabel p {
  margin-left: 20px;
  width: 20%;
  color: #999;
}

.listslabel .texts {
  width: 5%;
}

.cautions {
  font-size: 14px;
  margin-left: auto;
  line-height: 30px;
}

.right-content-value {
  width: 80px;
  text-align: right;
}

@media (max-width: 769px) {

  .info-contents {
    display: block!important;
  }

  .info-contents p {
    font-size: 12px;
  }

  .info-contents .left-contetns {
    width: 100%;
  }

  .info-contents .right-contetns {
    width: 100%;
  }

  .listslabel p {
    margin: auto;
  }

  .talk-list .texts {
    display: none;
  }

  .room-images img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .talkroom-title {
    display: block;
  }

  .cautions {
    margin-bottom: 15px;
  }

}
</style>
