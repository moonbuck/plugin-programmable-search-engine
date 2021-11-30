{{- $params := site.Params -}}

{{- $config := site.Data.plugin_programmable_search_engine_config -}}
{{- $config  = $config | default site.Data.plugin_programmable_search_engine.config -}}

{{- $CX := index $params "programmablesearchengine.cx"  -}}
{{- $CX  = $CX | default $config.CX  -}}

{{- $APIKey := index $params "programmablesearchengine.apikey"  -}}
{{- $APIKey  = $APIKey | default $config.APIKey -}}

{{- if (and $CX $APIKey) -}}

document.addEventListener('DOMContentLoaded',() => {
  
  printToConsole('{{ $CX }}', 'CX')
  printToConsole('{{ $APIKey }}', 'APIKey')
  
  printToConsole('loadClient', 'invoking')
  
  loadClient()
  
  printToConsole('execute', 'invoking')
  
  execute()
  
})

function loadClient() {
gapi.client.setApiKey("{{ $APIKey }}");
return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest")
    .then(function() { printToConsole("GAPI client loaded for API", "loadClient"); },
          function(err) { printToConsole(`Error loading GAPI client for API: ${err}`, 'loadClient'); });
}
// Make sure the client is loaded before calling this method.
function execute() {
return gapi.client.search.cse.list({
      "cx": "{{ $CX }}",
      "q": "bubble"
    })
    .then(function(response) {
            // Handle the results here (response.result has the parsed body).
            printToConsole(`response: ${response}`, 'execute');
          },
          function(err) { printToConsole(`Error: ${err}`, 'execute'); });
}
gapi.load("client");

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

{{- else -}}

/* {{ "Generating this script requires valid CX and APIKey values" }} */

{{- end -}}