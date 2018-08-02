function addClass(el, className) {
  console.log(el)
  console.log(className)
  console.log('addClass函数')
  if (hasClass(el, className)) {
    return false
  }
  console.log('验证通过')
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
  console.log('添加后的className')
  console.log(el.className)
}

function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
export {
  addClass,
  hasClass
}
