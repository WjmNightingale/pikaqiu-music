<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { getSongUrl } from 'api/song'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs[0]) {
        return this.songs[0].img
      } else {
        return this.topList.picUrl
      }
    },
    ...mapGetters(['topList'])
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
          if (this.songs) {
            getSongUrl(this.songs)
          }
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        const musicData = item.data
        if (musicData) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created() {
    this._getMusicList()
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave
  transform translated3d(100%, 0, 0)
</style>
