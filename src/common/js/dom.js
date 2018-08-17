function addClass(el, className) {
  if (hasClass(el, className)) {
    return false
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

var vendor = (() => {
  let elementStyle = document.createElement('div').style
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'Otransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
    return false
  }
})()

function prefixStyle(style) {
  // 自动检测浏览器所支持的css属性
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export {
  addClass,
  hasClass,
  getData,
  prefixStyle
}
