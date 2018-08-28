<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item">
        <div class="icon">
          <i></i>
        </div>
        <div class="name">
          <p class="text"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import {} from ''
export default {
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  watch: {
    query(newQuery) {
      this.search(newQuery)
    }
  },
  methods: {
    search(query) {}
  },
  components: {}
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      flex-direction row
      align-items center
      padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
        [class^='icon-']
          font-size 14px
          color $color-text-d
      .name
        flex 1
        font-size $font-size-medium
        color $color-text-d
        overflow hidden
        .text
          no-wrap()
</style>
