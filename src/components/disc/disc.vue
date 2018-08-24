<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { mapGetters } from 'vuex'
import { getSongUrl } from 'api/song'
import MusicList from 'components/music-list/music-list'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters(['disc'])
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push('/')
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          if (this.songs) {
            getSongUrl(this.songs)
          }
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created() {
    this._getSongList()
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
