<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import { getSingerDetail } from 'api/singer'
import { getSongUrl } from 'api/song'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters(['singer'])
  },
  methods: {
    _getSingerDetail() {
      const singerId = this.singer.id
      if (!singerId) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(singerId).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
          if (this.songs) {
            // 获取音乐url
            this._getSongUrl()
          }
        }
      })
    },
    _getSongUrl() {
      getSongUrl(this.songs)
      console.log(new Date())
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  },
  mounted() {},
  created() {
    console.log(new Date())
    this._getSingerDetail()
    console.log(new Date())
    console.log(this.songs)
  }
}
</script>

<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave
  transform translated3d(100%, 0, 0)
</style>
