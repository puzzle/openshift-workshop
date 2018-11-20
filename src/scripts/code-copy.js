Reveal.addEventListener( 'ready', ev => {
	document.querySelectorAll('code').forEach(el => {
    el.title = 'Click to copy!'
    console.log('Adding click to ', el)
    el.addEventListener('click', ev => {
      document.oncopy = copyEvent => {
        console.log('copied to clipboard')
        copyEvent.clipboardData.setData('Text', el.innerText)
        copyEvent.preventDefault()
      }
      document.execCommand('copy')
      document.oncopy = undefined
    })
  })
})
