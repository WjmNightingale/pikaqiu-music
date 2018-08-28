<template>
  <div class="search">
    <div class="search-wrapper">
      <search-box ref="serachBox"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="short-cut">
        <div class="hoy-key">
          <h1>热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'components/search-box/search-box'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
export default {
  data() {
    return {
      hotKey: []
    }
  },
  methods: {
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    }
  },
  created() {},
  components: {
    SearchBox
  }
}
</script>

<style scoped lang="stylus">
</style>