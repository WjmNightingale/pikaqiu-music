<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li @click="selectItem(item)" class="search-item" v-for="item in searches" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon">
          <i @click.stop="deleteOne(item)" class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    searches: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    selectItem(item) {
      console.log('SearchList选择事件')
      this.$emit('select', item)
    },
    deleteOne(item) {
      console.log('SearchList删除事件')
      this.$emit('delete', item)
    }
  },
  components: {}
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.search-list
  .search-item
    display flex
    align-items center
    height 40px
    overflow hidden
    &.list-enter-active, &.list-leave-active
      transition all 0.1s
    &.list-enter, &.list-leave-to
      height 0
    .text
      flex 1
      color $color-text-l
    .icon
      extend-click()
      .icon-delete
        font-size $font-size-small
        color $color-text-d
</style>
