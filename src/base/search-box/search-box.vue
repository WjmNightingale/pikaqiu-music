<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input v-model="query" type="text" class="box" :placeholder="placeholder">
    <i @click="clearQuery" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
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
      this.query = query
    },
    clearQuery() {
      this.query = ''
    }
  },
  created() {
    this.$watch('query', (newQuery) => {
      this.$emit('query', newQuery)
    })
  },
  components: {}
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
.search-box {
  display flex
  align-items center
  box-sizing border-box
  width 100%
  height 40px 
  padding 0 60px
  background $color-highlight-background
  border-radius 6px
  .icon-search
    font-size 24px
    color $color-background
  .box
    flex 1
    margin 0 5px
    font-size $font-size-medium
    line-height 18px
    color $color-text
    outline 0
    &::placeholder
      color $color-text-d
  .icon-dismiss
    font-size 16px
    color $color-background
}
</style>
