import storage from 'good-storage'

// 双下划线一般表示内部使用，避免冲突
const SEARCH_KEY = '__search__'

const SEARCH_MAX_LENGTH = 15

function insertArray(arr, val, compare, maxLen) {
  // 将值插入数组
}

function saveSearch(query) {
  let oldSearch = storage.get(SEARCH_KEY, [])
}
