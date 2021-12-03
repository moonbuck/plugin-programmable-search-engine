// Function for injecting an element for printing custom 
// console messages that appear in page main
const consoleID = 'console'

function redirectLog() {
  console.log = function(message, label) {
    printToConsole((typeof message == 'object'
                   ? (JSON && JSON.stringify 
                      ? JSON.stringify(message) 
                      : message)
                   : message),
                   label ?? 'log')
    }
}
  
var printToConsole = function (obj, label) {
  let main = document.getElementsByTagName('MAIN')[0]
  let dl = document.createElement('DL')
  dl.id = consoleID
  dl.style.lineHeight = '1'
  dl.style.overflow = 'wrap'
  main.insertBefore(dl, main.firstChild)
  let dt = document.createElement('DT')
  dt.innerText = `${label}`
  dt.style.float = 'left'
  dt.style.marginRight = '1rem'
  dl.appendChild(dt)
  let dd = document.createElement('DD')
  dd.innerText = `${obj}`
  dl.appendChild(dd)

  printToConsole = function (obj, label) {
    let dt = document.createElement('DT')
    dt.innerText = `${label}`
    dt.style.float = 'left'
    dt.style.marginRight = '1rem'
    let dd = document.createElement('DD')
    dd.innerText = `${obj}`
    let dl = document.getElementById(consoleID)
    dl.appendChild(dt)
    dl.appendChild(dd)
  }
}

export { redirectLog }