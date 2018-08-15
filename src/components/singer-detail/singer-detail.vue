<template>
  <transition name="slide">
    <div class="singer-detail">
      <p>这里是歌手详情页</p>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import { getSingerDetail } from 'api/singer'
export default {
  data() {
    return {}
  },
  computed: {
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
          console.log(res)
        }
      })
    }
  },
  components: {},
  created() {
    console.log('vuex 数据分发')
    console.log(this.singer)
    this._getSingerDetail()
  }
}
</script>

<style scoped lang="stylus">
.singer-detail
  position fixed
  height 100%
  width 100%
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave
  transform translated3d(100%, 0, 0)
</style>
