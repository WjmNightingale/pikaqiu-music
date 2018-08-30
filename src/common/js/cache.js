import storage from 'good-storage'

// 双下划线一般表示内部使用，避免冲突
const SEARCH_KEY = '__search__'

const SEARCH_MAX_LENGTH = 15

function insertArray(arr, val, compare, maxLen) {
  // 将值插入数组
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export {
  saveSearch,
  loadSearch
}
