<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="queryInput" v-model="query" type="text" class="box" :placeholder="placeholder">
    <i @click="clearQuery" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    setQuery(query) {
      // 选中搜索关键词时将关键词填充为input的值
      this.query = query
    },
    clearQuery() {
      // 清空搜索栏关键词
      this.query = ''
    },
    blur() {
      // 对外提供一个blur方法
      this.$refs.queryInput.blur()
    }
  },
  created() {
    // 事件节流 处理以后2秒才发一个请求
    this.$watch(
      'query',
      debounce(newQuery => {
        this.$emit('query', newQuery)
      }, 2000)
    )
  },
  components: {}
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
.search-box
  display flex
  align-items center
  box-sizing border-box
  width 100%
  padding 0 6px
  height 40px
  background $color-highlight-background
  border-radius 6px
  .icon-search
    font-size 24px
    color $color-background
  .box
    flex 1
    margin 0 5px
    line-height 18px
    background $color-highlight-background
    color $color-text
    font-size $font-size-medium
    outline 0
    &::placeholder
      color $color-text-d
  .icon-dismiss
    font-size 16px
    color $color-background
</style>
