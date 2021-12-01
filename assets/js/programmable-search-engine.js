{{ $params := site.Params }}

{{ $config := site.Data.plugin_programmable_search_engine_config }}
{{ $config  = $config | default site.Data.plugin_programmable_search_engine.config }}

{{ $CX := index $params "programmablesearchengine.cx"  }}
{{ $CX  = $CX | default $config.CX }}

{{ $APIKey := index $params "programmablesearchengine.apikey"  }}
{{ $APIKey  = $APIKey | default $config.APIKey }}

{{ if (and $CX $APIKey) }}

document.addEventListener('DOMContentLoaded',() => {
  
  insertSearchBar()
  
  gapi?.load('client', () => {
      gapi.client.setApiKey("{{ $APIKey }}");
      gapi.client.load("https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest")
      .then(() => console.log("GAPI client loaded for API"))
  });
  
})

const inputID = 'programmable-search-engine-input'

function insertSearchBar() {
  let container = document.getElementById('programmable-search-engine-container')
  let input = document.createElement("INPUT")
  input.type = 'search'
  input.id = inputID
  input.placeholder = 'search the mind of moondeer'
  input.ariaLabel = 'site search'
  input.addEventListener('keyup', ({key}) => key === "Enter" && executeSearch())
  container.appendChild(input)
  let svg = document.createElement("SVG")
  svg.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="magnifying-glass" class="svg-inline--fa fa-magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g class="fa-duotone-group"><path class="fa-secondary" fill="currentColor" d="M207.1 0C93.12 0-.0002 93.13-.0002 208S93.12 416 207.1 416s208-93.13 208-208S322.9 0 207.1 0zM207.1 336c-70.58 0-128-57.42-128-128c0-70.58 57.42-128 128-128s128 57.42 128 128C335.1 278.6 278.6 336 207.1 336z"></path><path class="fa-primary" fill="currentColor" d="M500.3 443.7l-119.7-119.7c-15.03 22.3-34.26 41.54-56.57 56.57l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7z"></path></g></svg>'
  let button = document.createElement("BUTTON")
  button.appendChild(svg)
  container.appendChild(button)
}

// Make sure the client is loaded before calling this method.
function executeSearch() {
  let searchTerms = document.getElementById(inputID).value
  printToConsole(`${searchTerms}`, 'search terms')
  
  // gapi?.client?.search.cse.list({ "cx": "{{ $CX }}","q": `${query}`})
  //   .then(response => handleSearchResponse(response),
  //         err => console.log(`error encountered executing search: ${err}`));
}

function handleSearchResponse(response) {
  printToConsole(`response: ${response}`, 'handler');
}

function insertButtons() {
  let main = document.getElementsByTagName("MAIN")[0]
  let load = document.createElement("BUTTON")
  load.innerHTML = 'load'
  load.onclick = loadClient
  let execute = document.createElement("BUTTON")
  execute.innerHTML = 'execute'
  execute.onclick = executeSearch
  main.insertBefore(execute, main.firstChild)
  main.insertBefore(load, execute)
}

// Function for injecting an element for printing custom 
// console messages that appear in page main
const consoleID = 'console'

var printToConsole = function (obj, label) {
  let main = document.getElementsByTagName("MAIN")[0]
  let dl = document.createElement("DL")
  dl.id = consoleID
  dl.style.lineHeight = '1'
  main.insertBefore(dl, main.firstChild)
  let dt = document.createElement("DT")
  dt.innerText = `${label}`
  dt.style.float = 'left'
  dt.style.marginRight = '1rem'
  dl.appendChild(dt)
  let dd = document.createElement("DD")
  dd.innerText = `${obj}`
  dl.appendChild(dd)

  printToConsole = function (obj, label) {
    let dt = document.createElement("DT")
    dt.innerText = `${label}`
    dt.style.float = 'left'
    dt.style.marginRight = '1rem'
    let dd = document.createElement("DD")
    dd.innerText = `${obj}`
    let dl = document.getElementById(consoleID)
    dl.appendChild(dt)
    dl.appendChild(dd)
  }
}

{{ else }}

/* {{ "Generating this script requires valid CX and APIKey values" }} */

{{ end }}