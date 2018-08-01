<template>
  <div class="recommend">
    这是我的详情页
  </div>
</template>

<script type="text/ecmascript-6">
import { getRecommend } from 'api/recommend'
import { ERR_OK } from 'api/config'
export default {
  data() {
    return {
      recommends: []
    }
  },
  created() {
    this._getRecommend()
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    }
  },
  components: {}
}
</script>

<style scoped lang="stylus">
</style>