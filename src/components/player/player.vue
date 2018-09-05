<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.img">
        </div>
        <div class="top">
          <div class="back" @click="onClose">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend.prevent="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="normalImgWrapper">
                <img :class="cdCls" class="image" :src="currentSong.img" ref="img">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}" v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-left">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @percent-change="onProgressBarChange" :percent="percent"></progress-bar>
            </div>
            <span class="time time-right">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="iconPlayState"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="onOpen">
        <div class="icon">
          <div class="mini-img-wrapper" ref="miniImgWrapper">
            <img :class="cdCls" width="40" height="40" :src="currentSong.img">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini" @click.stop="togglePlaying" :class="miniIconPlayState"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="timeUpdate" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import Scroll from 'base/scroll/scroll'
import PlayList from 'components/playlist/playlist'
import { playMode } from 'common/js/config'
import { playerMixin } from 'common/js/mixin'
import Lyric from 'lyric-parser'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  mixins: [playerMixin],
  data() {
    return {
      // @param -- songReady 用来标记audio对象是否加载成功
      songReady: false,
      // @param -- currentTime 用来标记播放时间
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: '',
      radius: 32
    }
  },
  computed: {
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    cdCls() {
      return this.playing ? 'play' : 'pause'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    iconPlayState() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIconPlayState() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    ...mapGetters(['fullScreen', 'playing', 'currentIndex'])
  },
  watch: {
    currentSong(newSong, oldSong) {
      console.log('歌曲变化了')
      console.log(newSong)
      if (!newSong.id || newSong.id === oldSong.id) {
        return
      }
      console.log('开始播放')
      this.currentLyric && this.currentLyric.stop()
      // 为了保证浏览器能够响应audio播放，使用 setTimeout 替换 $nextTick
      // this.$nextTick(() => {
      //   this.getLyric()
      //   this.$refs.audio.play()
      // })
      setTimeout(() => {
        this.getLyric()
        this.$refs.audio.play()
      }, 1000)
    },
    playing(newPlaying) {
      const audio = this.$refs.audio
      if (newPlaying) {
        this.$nextTick(() => {
          audio.play()
        })
      } else {
        this.$nextTick(() => {
          audio.pause()
        })
      }
    }
  },
  methods: {
    middleTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      // 触摸事件起始点X轴坐标
      this.touch.startX = touch.pageX
      // 触摸事件起始点Y轴坐标
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      // 触摸事件在X轴上滑动的距离
      const deltaX = touch.pageX - this.touch.startX
      // 触摸事件在Y轴上滑动的距离
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // 如果Y轴上滑动的距离大于X轴上的滑动
        // 不是左右滑动，返回即可
        return
      }
      // 如果当前展示的是CD,那么偏移距离为X
      // 如果展示的是LYRiC,那么偏移距离就为屏幕宽度(因为歌词展示了)
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      )
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      let action = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transform] = action
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      // middleL划出时背景渐透明
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd(e) {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        // 从右向左滑动，划出歌词
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        // 从右向左滑动，隐藏歌词
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      let action = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transform] = action
      const duration = 300
      this.$refs.lyricList.$el.style[transitionDuration] = `${duration}ms`
      this.$refs.middleL.style.opacity = opacity
    },
    onClose() {
      // 收起播放器
      this.setFullScreen(false)
    },
    onOpen() {
      // 打开播放器
      this.setFullScreen(true)
    },
    showPlayList() {
      this.$refs.playList.show()
    },
    timeUpdate(e) {
      this.currentTime = e.target.currentTime
    },
    end(e) {
      // 歌曲播放完毕 根据播放模式来选择
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    getLyric() {
      this.currentSong
        .getLyric()
        .then(lyric => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        })
        .catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let prevIndex = this.currentIndex - 0 - 1
        prevIndex = prevIndex < 0 ? this.playList.length - 1 : prevIndex
        this.setCurrentIndex(prevIndex)
        // 暂停切歌
        if (!this.playing) {
          this.togglePlaying()
        }
        // 切歌动作完成后，当前歌曲的audio对象应该是处于未加载状态
        this.songReady = false
      }
    },
    next() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let nextIndex = this.currentIndex - 0 + 1
        nextIndex = nextIndex === this.playList.length ? 0 : nextIndex
        this.setCurrentIndex(nextIndex)
        // 上首歌是暂停，切到下一首歌，icon图标要变化
        if (!this.playing) {
          this.togglePlaying()
        }
        // 切歌动作完成后，当前歌曲的audio对象应该是处于未加载状态
        this.songReady = false
      }
    },
    loop(e) {
      // 循环播放
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.currentLyric && this.currentLyric.seek(0)
    },
    ready() {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error() {
      this.songReady = true
    },
    onProgressBarChange(percent) {
      // 拖动事件处理函数
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
      this.currentLyric && this.currentLyric.seek(currentTime * 1000)
    },
    togglePlaying() {
      // 点击播放或是暂停
      if (!this.songReady) {
        return
      }
      this.setPlaingState(!this.playing)
      this.currentLyric && this.currentLyric.togglePlay()
    },
    // vue 钩子动画函数
    enter(el, done) {
      // el dom元素 done 回调函数
      // console.log(el)
      const { x, y, scale } = this._getPosAndScroll()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = `all 0.4s`
      const { x, y, scale } = this._getPosAndScroll()
      const action = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.style[transform] = action
      const timer = setTimeout(done, 400)
      this.$refs.cdWrapper.addEventListener('transitionend', () => {
        clearTimeout(timer)
        done()
      })
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    format(interval) {
      // number | 0 => 向下取整
      interval = interval | 0
      const minute = (interval / 60) | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    // 字符串补0函数
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len = len + 1
      }
      return num
    },
    _getPosAndScroll() {
      // mini播放器歌曲图片宽
      const targetWidth = 40
      // mini播放器歌曲图片中心点距离屏幕左边的距离
      const paddingLeft = 40
      // mini播放器歌曲图片中心点距离屏幕底部的距离
      const paddingBottom = 30
      // normal播放器唱片图片容器(div.middle)距离屏幕顶部的距离
      const paddingTop = 80
      // normal播放器(div.cdWrapper)宽
      const width = window.innerWidth * 0.8
      // mini播放器图放大到div.cdWrapper宽所需要的放大比
      const scale = targetWidth / width
      // mini播放器歌曲图片中心点移动到div.cdWrapper中心点在x轴上的偏移
      const x = -(window.innerWidth / 2 - paddingLeft)
      // mini播放器歌曲图片中心点移动到div.cdWrapper中心点在y轴上的偏移
      const y = window.innerHeight - paddingBottom - width / 2 - paddingTop
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    PlayList
  },
  created() {
    this.touch = {}
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.player
  .normal-player
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 150
    background $color-background
    .background
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      opacity 0.6
      filter blur(20px)
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back
          display block
          padding 9px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
      .title
        width 70%
        margin 0 auto
        line-height 40px
        text-align center
        no-wrap()
        font-size $font-size-large
        color $color-text
      .subtitle
        line-height 20px
        text-align center
        font-size $font-size-medium
        color $color-text
    .middle
      position fixed
      width 100%
      top 80px
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-l
        display inline-block
        // display none
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          left 10%
          top 0
          width 80%
          box-sizing border-box
          height 100%
          .cd
            width 100%
            height 100%
            border-radius 50%
            .image
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              box-sizing border-box
              border-radius 50%
              border 10px solid rgba(255, 255, 255, 0.1)
              &.play
                animation rotate 20s linear infinite
              &.pause
                animation-play-state paused
        .playing-lyric-wrapper
          width 80%
          margin 30px auto 0 auto
          overflow hidden
          text-align center
          .playing-lyric
            height 20px
            line-height 20px
            font-size $font-size-medium
            color $color-text-l
      .middle-r
        display inline-block
        vertical-align top
        width 100%
        height 100%
        overflow hidden
        .lyric-wrapper
          width 80%
          margin 0 auto
          overflow hidden
          text-align center
          .text
            line-height 32px
            color $color-text-l
            font-size $font-size-medium
            &.current
              color $color-text
          .pure-music
            padding-top 50%
            line-height 32px
            color $color-text-l
            font-size $font-size-medium
    .bottom
      position absolute
      bottom 50px
      width 100%
      .dot-wrapper
        text-align center
        font-size 0
        .dot
          display inline-block
          vertical-align middle
          margin 0 4px
          width 8px
          height 8px
          border-radius 50%
          background $color-text-l
          &.active
            width 20px
            border-radius 5px
            background $color-text-ll
      .progress-wrapper
        display flex
        align-items center
        width 80%
        margin 0px auto
        padding 10px 0
        .time
          color $color-text
          font-size $font-size-small
          flex 0 0 30px
          line-height 30px
          width 30px
          &.time-left
            text-align left
          &.time-right
            text-align right
        .progress-bar-wrapper
          flex 1
      .operators
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme
          &.disable
            color $color-theme-d
          i
            font-size 30px
        .i-left
          text-align right
        .i-center
          padding 0 20px
          text-align center
          i
            font-size 40px
        .i-right
          text-align left
        .icon-favorite
          color $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition all 0.4s
      .top, .bottom
        transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity 0
      .top
        transform translate3d(0, -100px, 0)
      .bottom
        transform translate3d(0, 100px, 0)
  .mini-player
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    z-index 180
    width 100%
    height 60px
    background $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity 0
    .icon
      flex 0 0 40px
      width 40px
      height 40px
      padding 0 10px 0 20px
      .mini-img-wrapper
        height 100%
        width 100%
        img
          border-radius 50%
          &.play
            animation rotate 10s linear infinite
          &.pause
            animation-play-state paused
    .text
      display flex
      flex-direction column
      justify-content center
      flex 1
      line-height 20px
      overflow hidden
      .name
        margin-bottom 2px
        no-wrap()
        font-size $font-size-medium
        color $color-text
      .desc
        no-wrap()
        font-size $font-size-small
        color $color-text-d
    .control
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size 30px
        color $color-theme-d
      .icon-mini
        font-size 32px
        position absolute
        left 0
        top 0
@keyframes rotate
  0%
    transform rotate(0)
  100%
    transform rotate(360deg)
</style>
