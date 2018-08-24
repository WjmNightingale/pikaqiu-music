<template>
  <scroll class="listview" ref="listview" :data="data" :listenScroll="listenScroll" :probeType="probeType" @scroll="onScroll">
    <ul>
      <!-- 单个group -->
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.id" @click="selectItem(item)" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar" alt="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStar" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" v-for="(item,index) in shortCutList" :key="index" :class="{'current': currentIndex === index}" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'
const ANCHOR_HEIGHT = 20
const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    shortCutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : ''
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      // console.log(newY)
      const listHeight = this.listHeight
      // 滚动到顶部时，newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 滚动到中间部分时, neY < 0
      for (let i = 0; i < listHeight.length - 1; i++) {
        let minHeight = listHeight[i]
        let maxHieght = listHeight[i + 1]
        if (-newY >= minHeight && -newY < maxHieght) {
          this.currentIndex = i
          this.diff = maxHieght + newY
          return
        }
      }
      // 滚动到底部 且-newY > listHeight最后一个元素的值
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.tarnsfrom = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStar(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.anchorIndex = parseInt(anchorIndex)
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 小数 | 0 相当于 Math.floor()向下取整
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      let anchorIndex = parseInt(this.anchorIndex + delta)
      this._scrollTo(anchorIndex)
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    onScroll(pos) {
      // 监听scroll组件的滚动事件
      // console.log(pos)
      // 实时滚动的垂直方向的滚动距离Y值
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let element = list[i]
        height += element.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
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
