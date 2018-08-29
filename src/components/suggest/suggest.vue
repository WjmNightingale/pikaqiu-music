<template>
  <scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="onScrollToEnd">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index">
        <div :class="getIconCls(item)">
          <i></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <loading v-show="hasMore" title=""></loading>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getSearch } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
const TYPE_SINGER = 'singer'
const perpage = 20
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      pullup: true,
      // 检测是否还有数据可上拉加载 默认为true
      hasMore: true,
      result: []
    }
  },
  watch: {
    query(newQuery) {
      this.search(newQuery)
    }
  },
  methods: {
    search(query) {
      this.page = 1
      this.hasMore = true
      getSearch(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMoreData(res.data)
        }
      })
    },
    onScrollToEnd() {
      console.log('上拉加载')
      // 下拉加载刷新
      if (!this.hasMore) {
        return
      }
      this.page += 1
      getSearch(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMoreData(res.data)
        }
      })
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _checkMoreData(data) {
      const song = data.song
      if (
        !song.list.length ||
        song.curnum + (song.curpage - 1) * perpage >= song.totalnum
      ) {
        this.hasMore = false
      }
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      flex-direction row
      align-items center
      padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
        [class^='icon-']
          font-size 14px
          color $color-text-d
      .name
        flex 1
        margin-left 2px
        font-size $font-size-medium
        color $color-text-d
        overflow hidden
        .text
          no-wrap()
</style>
