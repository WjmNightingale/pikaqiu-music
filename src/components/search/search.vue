<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="serachBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
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
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @inputBlur="onInputBlur" @select="onSelect"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      query: '',
      hotKey: []
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    addQuery(query) {
      console.log(query)
      console.log(this.$refs.serachBox)
      this.$refs.serachBox.setQuery(query)
    },
    onQueryChange(query) {
      this.query = query
    },
    onInputBlur() {
      console.log('这里开始调用子组件serach-box')
      this.$refs.serachBox.blur()
    },
    onSelect(query) {
      this.saveSearchHistory(query)
      // window.localStorage.clear()
      console.log(window.localStorage)
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions(['saveSearchHistory'])
  },
  created() {
    this._getHotKey()
  },
  components: {
    SearchBox,
    Suggest
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