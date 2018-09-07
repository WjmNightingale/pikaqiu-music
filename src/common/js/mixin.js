import {
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
import {
  playMode
} from 'common/js/config'
import {
  shuffle
} from 'common/js/util'

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

const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    favoriteIcon() {
      return this.getFavoriteIcon(this.currentSong)
    },
    ...mapGetters([
      'mode',
      'currentSong',
      'playList',
      'sequenceList',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      // 播放器播放模式切换
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex(list) {
      // 重置当前索引
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    toggleFavorite(song) {
      // 切换喜欢状态
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      // 切换喜欢样式
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite(song) {
      // 检测是否喜欢
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setMode: 'SET_MODE',
      setPlaylist: 'SET_PLAY_LIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query.trim()
    },
    onInputBlur() {
      this.$refs.searchBox.blur()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}

export {
  playListMixin,
  playerMixin,
  searchMixin
}
