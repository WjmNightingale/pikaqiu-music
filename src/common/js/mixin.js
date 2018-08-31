import {
  mapGetters
} from 'vuex'

const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      // 引用mixin的组件如果没有提供`handlePlayList`方法
      // 那么就会抛出以下异常
      throw new Error('component must implement handlePlayList method')
    }
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  }
}

export {
  playListMixin
}
