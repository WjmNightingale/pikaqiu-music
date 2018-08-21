<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd">
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')
// 定义按钮宽度，16 来自于 样式
const progressBtnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  watch: {
    percent(newPercent) {
      // 进度条随着歌曲播放时间变化
      if (newPercent > 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  },
  components: {},
  methods: {
    progressClick(e) {
      // 点击进度条歌曲事件改变
      this._offset(e.offsetX)
      this._triggerTouch()
    },
    progressTouchStart(e) {
      this.touch.initiated = true
      // e.touches[0]表示移动端触屏事件 第一个手指所做的动作
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      )
      this._offset(offsetWidth)
    },
    progressTouchEnd(e) {
      this.touch.initiated = false
      this._triggerTouch()
    },
    _triggerTouch() {
      console.log('触发拖动事件')
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const progressWidth = this.$refs.progress.clientWidth
      let percent = progressWidth / barWidth
      this.$emit('percent-change', percent)
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px'
      let action = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.progressBtn.style[transform] = action
    }
  },
  created() {
    // 位置对象
    this.touch = {}
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
.progress-bar
  height 30px
  .bar-inner
    position relative
    top 13px
    height 4px
    background rgba(0, 0, 0, 0.3)
    .progress
      position absolute
      height 100%
      background $color-theme
    .progress-btn-wrapper
      position absolute
      left -8px
      top -13px
      width 30px
      height 30px
      .progress-btn
        position relative
        top 7px
        left 7px
        box-sizing border-box
        width 16px
        height 16px
        border 3px solid $color-text
        border-radius 50%
        background $color-theme
</style>
