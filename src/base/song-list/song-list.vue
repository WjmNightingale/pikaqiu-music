<template>
  <!-- <div class="song-list"> -->
  <ul class="song-list">
    <li @click="selectSong(song, index)" v-for="(song, index) in songs" :key="song.id" class="item">
      <div class="rank" v-show="isRank">
        <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
      </div>
      <div class="content">
        <h2 class="name">{{song.name}}</h2>
        <p class="desc">{{getDesc(song)}}</p>
      </div>
    </li>
  </ul>
  <!-- </div> -->
</template>

<script type="text/ecmascript-6">
import { Song } from 'common/js/song'
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    isRank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  components: {},
  methods: {
    getDesc(song) {
      return `${song.singer}-${song.album}`
    },
    selectSong(song, index) {
      console.log('歌曲被选择')
      // 从缓存中读取的 song 对象 不再是 Song的实例，需要再次实例化一下
      song = new Song(song)
      this.$emit('select', song, index)
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return `text`
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.song-list
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    .rank
      flex 0 0 25px
      width 25px
      margin-right 30px
      text-align center
      .icon
        display inline-block
        width 25px
        height 24px
        background-size 25px 24px
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
      .text
        color $color-theme
        font-size $font-size-large
    .content
      flex 1
      line-height 20px
      overflow hidden
      .name
        no-wrap()
        color $color-text
      .desc
        no-wrap()
        margin-top 4px
        color $color-text-d
</style>
