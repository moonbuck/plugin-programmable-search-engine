{{- /* Grab plugin paramter values required by the Javascript */ -}}
{{- $params := site.Params -}}

{{- $config := site.Data.pse_config -}}
{{- $config  = $config | default site.Data.plugin_pse.config -}}

{{- $CX := index $params "programmablesearchengine.cx" -}}
{{- $CX  = $CX | default $config.CX -}}

{{- $APIKey := index $params "programmablesearchengine.apikey" -}}
{{- $APIKey  = $APIKey | default $config.APIKey -}}

{{- /* Make sure we have what we need to continue */ -}}
{{- if (and $CX $APIKey) -}}

{{- $key := "programmablesearchengine.searchbar.containerid" -}}
{{- $id := index $params $key -}}
{{- $id  = $id | default $config.SearchBar.ContainerID -}}

{{- $key = "programmablesearchengine.searchbar.input.placeholder" -}}
{{- $text := index $params $key -}}
{{- $text  = $text | default $config.SearchBar.Input.Placeholder -}}
{{- $text  = $text | default "site search" -}}

import { 
  INPUT, 
  insertSearchBar,
  showInput,
  hideInput
} from './search-bar.js'

import {
  eventHandled,
  OVERLAY,
  ARTICLE,
  START,
  END,
  TOTAL,
  TERMS,
  ITEMS,
  LIST,
  PREVIOUS,
  NEXT,
  insertResultsOverlay
} from './results-overlay.js';

import { resultListItem } from './result-list-item.js'

const CONTAINER = '{{ $id }}'
const PLACEHOLDER = '{{ $text }}'

document.addEventListener('DOMContentLoaded',() => {
    
  insertSearchBar(CONTAINER, PLACEHOLDER, executeSearch)
  
  let input = document.getElementById(INPUT)
  input.addEventListener('keyup', ({key}) => key === 'Enter' && executeSearch())
  
  insertResultsOverlay()
  
  gapi?.load('client', () => {
      gapi.client.setApiKey('{{ $APIKey }}');
      gapi.client.load('https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest')
      .then(() => console.log('GAPI client loaded for API'))
  });
  
})

// Make sure the client is loaded before calling this method.
function executeSearch() {
  let input = document.getElementById(INPUT)
  input.blur()
  hideInput()
  
  let searchTerms = input.value
  console.log(searchTerms, 'search terms')
  
  search(searchTerms, 1)
}

function search(q, start) {
  gapi?.client?.search.cse.list({ 
    'cx': '{{ $CX }}',
    'q': `${q}`,
    'start': start
  }).then(response => handleSearchResponse(JSON.parse(response.body)),
          err => console.log(`error executing search: ${err}`))
}

function handleSearchResponse(response) {

  let {queries, items} = response
  
  let {previousPage, request, nextPage} = queries
  previousPage = previousPage?.[0]
  request = request[0]
  nextPage = nextPage?.[0]
    
  let {startIndex, searchTerms, totalResults, count} = request
  let endIndex = startIndex + count - 1
    
  document.getElementById(START).innerText = `${startIndex}`
  document.getElementById(END).innerText = `${endIndex}`
  document.getElementById(TOTAL).innerText = `${totalResults}`
  document.getElementById(TERMS).innerText = `${searchTerms}`
  
  let list = document.getElementById(LIST)
  while (list.firstChild) { list.removeChild(list.firstChild) }
  
  items.map(result => resultListItem(result))
       .forEach(listItem => list.appendChild(listItem))
  
  let previousButton = document.getElementById(PREVIOUS)
  
  if (previousPage) {
    previousButton.hidden = false
    previousButton.onclick = () => { 
      event[eventHandled] = true
      let start = previousPage.startIndex
      let q = previousPage.searchTerms
      search(q, start) 
    }
  } else {
    previousButton.hidden = true
  }
  
  let nextButton = document.getElementById(NEXT)
  
  if (nextPage) {
    nextButton.hidden = false
    nextButton.onclick = event => {
      event[eventHandled] = true
      let start = nextPage.startIndex
      let q = nextPage.searchTerms
      search(q, start) 
    }
  } else {
    nextButton.hidden = true
  }
  
  let overlay = document.getElementById(OVERLAY)
  overlay.style.display = 'block'
  
  document.getElementById(ARTICLE).scrollTop = 0
  
}

{{ else }}

/* {{ "Generating this script requires valid CX and APIKey values" }} */

{{ end }}