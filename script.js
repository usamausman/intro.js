// run code sample
const run = (results, code) => {
  const clean = (v) => {
    if (v == undefined) {
      return 'undefined'
    } else if (v instanceof Object) {
      return JSON.stringify(v).replace(/"/g, '').replace(/:/g, ': ').replace(/,/g, ', ')
    } else {
      return v
    }
  }

  // override console functions to write to page
  let replaceConsole = {
    log: function () {
      // console.log(...arguments)
      results.textContent += Array.from(arguments).map((v) => clean(v)).join(' ') + '\n'
    },
    error: function () {
      console.log(`Error in:\n${code}`)
      // console.error(...arguments)
      results.innerHTML += `<span class="error">${arguments[0]}</span>` + '\n'
    }
  }

  return Function(`'use strict';
  async function code(console) {
    try {
      ${code}
    } catch (err) {
      console.error(err)
    }
  }
  return code`)()(replaceConsole)
}

const samples = Array.from(document.querySelectorAll('.sample:not(.dontrun)'))
const sidebar = document.querySelector('.sidebar.hidden')

samples.forEach((sample) => {
  const newSidebar = sidebar.cloneNode(true)
  newSidebar.classList.remove('hidden')

  sample.appendChild(newSidebar)

  const button = sample.querySelector('button')

  const code = sample.querySelector('pre')
  const results = sample.querySelector('.sidebar .results')

  button.addEventListener('click', () => {
    results.textContent = ''
    // setTimeout(() => run(results, code.textContent), 250)
    run(results, code.textContent)
  })
})

sidebar.remove()