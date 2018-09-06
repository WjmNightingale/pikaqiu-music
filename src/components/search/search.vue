<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" :refreshDelay="refreshDelay" class="shortcut" :data="shortcutData">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" @click="addQuery(item.k)" v-for="(item,index) in hotKey" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="clearAllSearches">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @select="onSearchSelect" @delete="onSearchDelete" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @inputBlur="onInputBlur" @select="saveSearch"></suggest>
    </div>
    <confirm @confirm="onConfirm" @cancel="onCancel" ref="confirm" text="是否清空搜索历史？"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'
import Confirm from 'base/confirm/confirm'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapActions } from 'vuex'
import { playListMixin, searchMixin } from 'common/js/mixin'
export default {
  mixins: [playListMixin, searchMixin],
  data() {
    return {
      hotKey: []
    }
  },
  computed: {
    shortcutData() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  watch: {
    query(newQuery) {
      // watch query 的改变
      if (!newQuery) {
        // 如果是从搜索界面切换到搜索历史
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    clearAllSearches() {
      this.$refs.confirm.show()
    },
    onSearchSelect(query) {
      this.addQuery(query)
    },
    onSearchDelete(query) {
      this.deleteSearchHistory(query)
    },
    onConfirm() {
      this.clearSearchHistory()
    },
    onCancel() {
      this.$refs.confirm.hide()
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions(['clearSearchHistory'])
  },
  created() {
    this._getHotKey()
  },
  components: {
    Scroll,
    SearchBox,
    SearchList,
    Suggest,
    Confirm
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.search
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d
      .search-history
        position relative
        margin 0 20px
        .title
          display flex
          align-items center
          height 40px
          font-size $font-size-medium
          color $color-text-l
          .text
            flex 1
          .clear
            /* 拓展点击区域 */
            extend-click()
            .icon-clear
              font-size $font-size-medium
              color $color-text-d
  .search-result
    position fixed
    top 178px
    bottom 0
    width 100%
</style>