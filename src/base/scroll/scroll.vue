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
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disabel() {
      this.scroll && this.scroll.disabel()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
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
