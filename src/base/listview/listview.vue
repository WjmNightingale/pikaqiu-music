<template>
  <scroll class="listview" ref="listview" :data="data">
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.id" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar" alt="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStar" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" v-for="(item,index) in shortCutList" :key="index" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
const ANCHOR_HEIGHT = 20
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    shortCutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    }
  },
  components: {
    Scroll
  },
  methods: {
    onShortcutTouchStar(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 小数 | 0 相当于 Math.floor()向下取整
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      let anchorIndex = this.touch.anchorIndex + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  created() {
    this.touch = {}
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
.listview
  position relative
  width 100%
  height 100%
  overflow hidden
  background $background-color
  .list-group
    padding-bottom 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-1
      background $color-hightlight-background
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        margin-left 20px
        color $color-text-1
        font-size $font-size-medium
  .list-shortcut
    position absolute
    z-index 30
    right 0px
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 0
    border-radius 10px
    text-align center
    font-family Helvetica, sans-serif
    background $color-background-d
    .item
      padding 5px
      line-height 1
      color $color-text-1
      font-size $font-size-small
      &.current
        color $color-theme
  .list-fixed
    position absolute
    top 0px
    left 0px
    width 100%
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-samll
      color $color-text-1
      background $color-highlight-background
  .loading-container
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
