function shuffle(arr) {
  // 打乱数组
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let tmp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = tmp
  }
  return _arr
}

function getRandomInt(min, max) {
  // 返回一个 (min, max] 区间的随机数，包括 max
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 节流函数
function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export {
  shuffle,
  debounce
}
