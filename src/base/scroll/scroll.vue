<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
// better-scroll 创造一个局部滚动区域
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    refreshDealy: {
      type: Number,
      default: 20
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 是否开启上拉加载刷新
    pullup: {
      tyep: Boolean,
      default: false
    },
    // 是否监听Scroll内部的滚动事件
    beforeScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  components: {},
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let vm = this
        this.scroll.on('scroll', pos => {
          // pos Object
          vm.$emit('scroll', pos)
        })
      }
      if (this.pullup) {
        // 如果需要上拉刷新，监听better-scroll的`scrollEnd`事件
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            console.log('滚动到底部 派发事件')
            // 滚动到底部 派发事件
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforeScroll) {
        // 需要监听scroll内部的滚动
        this.scroll.on('beforeScrollStart', () => {
          console.log('这里是listScroll')
          this.$emit('listScroll')
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disabel() {
      this.scroll && this.scroll.disabel()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDealy)
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  }
}
</script>

<style scoped lang="stylus">
</style>
