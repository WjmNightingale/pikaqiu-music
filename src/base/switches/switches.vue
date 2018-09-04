<template>
  <div class="switches">
    <li class="switch-item" v-for="(item, index) in switches" :key="index" :class="{'active': currentIndex === index}" @click.stop="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    switches: {
      type: Array,
      default() {
        return []
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
    switchItem(index) {
      this.$emit('switch', index)
    }
  },
  components: {}
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
.switches
  display flex
  align-items center
  width 240px
  margin 0 auto
  border 1px solid $color-highlight-background
  border-radius 5px
  .switch-item
    flex 1
    padding 8px
    text-align center
    font-size $font-size-medium
    color $color-text-d
    &.active
      background $color-highlight-background
      color $color-text
</style>
