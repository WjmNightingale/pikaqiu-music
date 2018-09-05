<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list></song-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest @select="selectSuggest" :query="query" :showSinger="showSinger" @inputBlur="onInputBlur"></suggest>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SearchBox from 'base/search-box/search-box'
import SongList from 'base/song-list/song-list'
import Switches from 'base/switches/switches'
import Suggest from 'components/suggest/suggest'
import { searchMixin } from 'common/js/mixin'
import { mapGetters } from 'vuex'
export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['playHistory'])
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    selectSuggest() {
      this.saveSearch()
    },
    switchItem(index) {
      this.currentIndex = index
    }
  },
  components: {
    Scroll,
    SongList,
    SearchBox,
    Suggest,
    Switches
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.add-song
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 200
  background $color-background
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
  &.slide-enter, &.slide-leave-to
    transform translated3d(100%, 0, 0)
  .header
    position relative
    height 44px
    text-align center
    .title
      line-height 44px
      font-size $font-size-large
      color $color-text
    .close
      position absolute
      top 0
      right 0
      .icon-close
        display block
        padding 12px
        font-size 20px
        color $color-theme
  .search-box-wrapper
    margin 20px
  .shortcut
    .list-wrapper
      position absolute
      top 165px
      bottom 0
      width 100%
      .list-scroll
        height 100%
        overflow hidden
        .list-inner
          padding 20px 20px
  .search-result
    position fixed
    top 124px
    bottom 0
    width 100%
  .tip-title
    text-align center
    padding 18px 0
    font-size 0
    .icon-ok
      font-size $font-size-medium
      color $color-theme
      margin-right 4px
    .text
      font-size $font-size-medium
      color $color-text
</style>
