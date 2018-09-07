import storage from 'good-storage'

// 双下划线一般表示内部使用，避免冲突
const SEARCH_KEY = '__search__'

const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'

const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'

const FAVORITE_MAX_LENGTH = 200

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

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
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
  // 从localStorage中读取值
  return storage.get(SEARCH_KEY, [])
}

function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

function savePlay(song) {
  let playHistories = storage.get(PLAY_KEY, [])
  insertArray(playHistories, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, playHistories)
  return playHistories
}

function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

function saveFavorite(song) {
  let favoriteList = storage.get(FAVORITE_KEY, [])
  insertArray(favoriteList, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, favoriteList)
  return favoriteList
}

function deleteFavorite(song) {
  let favoriteList = storage.get(FAVORITE_KEY, [])
  deleteFromArray(favoriteList, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, favoriteList)
  return favoriteList
}

function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

export {
  saveSearch,
  loadSearch,
  deleteSearch,
  clearSearch,
  savePlay,
  loadPlay,
  saveFavorite,
  deleteFavorite,
  loadFavorite
}
