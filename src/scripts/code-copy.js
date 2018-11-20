Reveal.addEventListener( 'ready', ev => {
	document.querySelectorAll('code').forEach(el => {
    el.title = 'Click to copy!'
    el.addEventListener('click', ev => {
      document.oncopy = copyEvent => {
        copyEvent.clipboardData.setData('Text', el.innerText)
        copyEvent.preventDefault()
      }
      document.execCommand('copy')
      document.oncopy = undefined

      let elem = document.createElement('div');
      elem.style.cssText = 'position:fixed; top: 20px; right: 20px; padding: 1em; opacity:0.8; z-index:100; background: #8df; border-radius: 5px; animation: fadeout 600ms; animation-delay: 1s'
      elem.innerText = 'Code copied to clipboard!'
      document.body.appendChild(elem);
      setTimeout(() => document.body.removeChild(elem), 1600)
    })
  })
})
