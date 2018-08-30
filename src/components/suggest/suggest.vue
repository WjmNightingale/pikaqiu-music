<template>
  <scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="onScrollToEnd" ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div :class="getIconCls(item)">
          <i></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import { getSearch } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { Singer } from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'

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
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singerid,
          name: item.singername
        })
        this.$router.push({
          path: `/serach/${singer.id}`
        })
        this.setSinger(item)
      } else {
        this.insertSong(item)
      }
    },
    search(query) {
      // 改变query再次查询时，需要重置
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      getSearch(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMoreData(res.data)
        }
      })
    },
    onScrollToEnd() {
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
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong'])
  },
  components: {
    Scroll,
    Loading,
    NoResult
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
      font-size $font-size-medium
      color $color-text-d
      overflow hidden
      .text
        no-wrap()
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
