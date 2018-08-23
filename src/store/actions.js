import * as types from './mutation-types'
import {
  playMode
} from 'common/js/config'
import {
  shuffle
} from 'common/js/util'

function findIndex(randomList, currentSong) {
  return randomList.findIndex(item => item.id === currentSong.id)
}

const selectPlay = function ({
  commit,
  state
}, {
  list,
  index
}) {
  let updateList, updateIndex
  if (state.mode === playMode.random) {
    // 如果是随机播放
    updateList = shuffle(list)
    updateIndex = findIndex(updateList, list[index])
  } else {
    // 非随机播放
    updateList = list
    updateIndex = index
  }
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, updateList)
  commit(types.SET_CURRENT_INDEX, updateIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

const randomPlay = function ({
  commit
}, {
  list
}) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export {
  selectPlay,
  randomPlay
}
