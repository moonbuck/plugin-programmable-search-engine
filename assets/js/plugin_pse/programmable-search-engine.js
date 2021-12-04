{{- /* Grab plugin paramter values required by the Javascript */ -}}
{{- $params := site.Params -}}

{{- $config := site.Data.plugin_pse_config -}}
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

const SEARCH_ICON = `\
<svg aria-hidden='true' 
     focusable='false' 
     data-prefix='fad' 
     data-icon='magnifying-glass' 
     class='svg-inline--fa fa-magnifying-glass' 
     role='img' 
     xmlns='http://www.w3.org/2000/svg' 
     viewBox='0 0 512 512'>
  <g class='fa-duotone-group'>
    <path class='fa-secondary' 
          fill='currentColor' 
          d='M207.1 0C93.12 0-.0002 93.13-.0002 208S93.12 416 207.1 \
             416s208-93.13 208-208S322.9 0 207.1 0zM207.1 336c-70.58 \
             0-128-57.42-128-128c0-70.58 57.42-128 128-128s128 57.42 \
             128 128C335.1 278.6 278.6 336 207.1 336z'>
    </path>
    <path class='fa-primary' 
          fill='currentColor' 
          d='M500.3 443.7l-119.7-119.7c-15.03 22.3-34.26 41.54-56.57 \
             56.57l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 \
             484.7 515.9 459.3 500.3 443.7z'>
    </path>
  </g>
</svg>`


const SEARCH_BAR = 'pse-search-bar'
const INPUT = 'pse-input'
const BUTTON = 'pse-button'
const IS_EXPANDED = Symbol('isExpanded')
const WIDTH = Symbol('width')
const BORDER_STYLE = Symbol('borderStyle')
const PADDING_X = Symbol('paddingX')
const INPUT_WIDTH = '--pse-input-width'
const INPUT_PADDING_X = '--pse-input-padding-x'
const INPUT_BORDER_STYLE = '--pse-border-style'
const EXPANDED = 'aria-expanded'
const INPUT_ELEMENT = Symbol('inputElement')
const BUTTON_ELEMENT = Symbol('buttonElement')


/*

Structure:

div#containerID
  div#SEARCH_BAR
    input#INPUT
    button#BUTTON
      SEARCH_ICON
    
*/

function insertSearchBar(containerID, placeholder, executeSearch) {
  
  let container = document.getElementById(containerID)
  
  let searchBar = document.createElement('DIV')
  searchBar.id = SEARCH_BAR
  container.appendChild(searchBar)      
  
  let computedStyle = getComputedStyle(container)
  
  let input = document.createElement('INPUT')
  input.type = 'search'
  input.id = INPUT
  input.placeholder = placeholder
  input.name = 'pse'
  input.setAttribute('aria-label', 'site search')
  input[WIDTH] = computedStyle.getPropertyValue(INPUT_WIDTH)
  input.style.setProperty(INPUT_WIDTH, 0)
  input[PADDING_X] = computedStyle.getPropertyValue(INPUT_PADDING_X)
  input.style.setProperty(INPUT_PADDING_X, 0)
  input[BORDER_STYLE] = computedStyle.getPropertyValue(INPUT_BORDER_STYLE)
  input.style.setProperty(INPUT_BORDER_STYLE, 'none')
  searchBar.appendChild(input)
  document[INPUT_ELEMENT] = input
    
  let button = document.createElement('BUTTON')
  button.id = BUTTON
  button.type = 'button'
  button.onclick = toggleInput
  button.setAttribute('aria-expanded', false)
  button[IS_EXPANDED] = false
  button.setAttribute('aria-controls', INPUT)
  searchBar.appendChild(button)
  document[BUTTON_ELEMENT] = button
  
  input.onblur = toggleInput
  
  let svg = document.createElement('SVG')
  svg.innerHTML = SEARCH_ICON
  button.appendChild(svg)
 
}

function toggleInput() {
    
  let button = document[BUTTON_ELEMENT]
  let input = document[INPUT_ELEMENT]
  
  if (button[IS_EXPANDED]) {
    // Collapse the input
    
    input.style.setProperty(INPUT_WIDTH, 0)
    input.style.setProperty(INPUT_PADDING_X, 0)
    input.style.setProperty(INPUT_BORDER_STYLE, 'none')
    button.setAttribute('aria-expanded', false)
    button[IS_EXPANDED] = false
  }
  
  else {
    // Expand the input
    
    input.style.setProperty(INPUT_WIDTH, input[WIDTH])
    input.style.setProperty(INPUT_PADDING_X, input[PADDING_X])
    input.style.setProperty(INPUT_BORDER_STYLE, input[BORDER_STYLE])
    button.setAttribute('aria-expanded', true)
    button[IS_EXPANDED] = true
  }
  
}

const eventHandled = Symbol("eventHandled")
const OVERLAY = 'pse-result-overlay'
const ARTICLE = 'pse-result-article'
const HEADER = 'pse-result-header'
const TITLE = 'pse-result-title'
const START = 'pse-result-start-index'
const END = 'pse-result-end-index'
const TOTAL = 'pse-result-total'
const TERMS = 'pse-result-search-terms'
const ITEMS = 'pse-result-items'
const LIST = 'pse-result-item-list'
const ITEM_ARTICLE = 'pse-result-item-article'
const ITEM_HEADER = 'pse-result-item-header'
const ITEM_BODY = 'pse-result-item-body'
const FOOTER = 'pse-result-footer'
const PREVIOUS = 'pse-result-previous-page'
const NUMBERS = 'pse-result-page-numbers'
const NEXT = 'pse-result-next-page'

/*

Structure:

div#OVERLAY
  article#ARTICLE
    header#HEADER
      h2#TITLE
        Showing items
        span#START
        -
        span#END
        of
        span#TOTAL
        results for
        span#TERMS
    section#ITEMS
      ul#LIST
    footer#FOOTER
      button#PREVIOUS
      button#NEXT

*/

function insertResultsOverlay() {
  
  let overlay = document.createElement('DIV')
  overlay.id = OVERLAY
  overlay.onclick = event => { 
    if (event[eventHandled]) { return }
    document.getElementById(OVERLAY).style.display = 'none' 
  }
  
  let article = document.createElement('ARTICLE')
  article.id = ARTICLE
  overlay.appendChild(article)
  
  let header = document.createElement('HEADER')
  header.id = HEADER
  article.appendChild(header)
    
  let title = document.createElement('H2')
  title.id = TITLE
  title.appendChild(document.createTextNode('Showing results for '))  
  // title.appendChild(document.createTextNode('Showing items '))
  header.appendChild(title)
  
  // let startIndex = document.createElement('SPAN')
  // startIndex.id = START
  // startIndex.innerText = 'startIndex'
  // title.appendChild(startIndex)
  
  // title.appendChild(document.createTextNode(' - '))
  
  // let endIndex = document.createElement('SPAN')
  // endIndex.id = END
  // endIndex.innerText = 'endIndex'
  // title.appendChild(endIndex)
  
  // title.appendChild(document.createTextNode(' of '))
  
  // let total = document.createElement('SPAN')
  // total.id = TOTAL
  // total.innerText = 'total'
  // title.appendChild(total)
  
  // title.appendChild(document.createTextNode(' results for '))
  
  let terms = document.createElement('SPAN')
  terms.id = TERMS
  terms.innerText = 'searchTerms'
  title.appendChild(terms)
  
  let items = document.createElement('SECTION')
  items.id = ITEMS
  article.appendChild(items)
  
  let list = document.createElement('UL')
  list.id = LIST
  items.appendChild(list)
  
  let footer = document.createElement('FOOTER')
  footer.id = FOOTER  
  article.appendChild(footer)
    
  let previous = document.createElement('A')
  previous.id = PREVIOUS
  previous.innerText = 'previous'
  footer.appendChild(previous)
  
  // let numbers = document.createElement('UL')
  // numbers.id = NUMBERS
  // footer.appendChild(numbers)
  
  let next = document.createElement('A')
  next.id = NEXT
  next.innerText = 'next'
  footer.appendChild(next)
  
  
  document.body.insertBefore(overlay, document.body.firstChild)
  
}

const LIST_ITEM = 'pse-list-item'
const ITEM_TITLE = 'pse-item-title'
const SNIPPET = 'pse-snippet'
const THUMBNAIL = 'pse-thumbnail'


function resultListItem(result) {
  
  let listItem = document.createElement('LI')
  listItem.className = LIST_ITEM
  
  let article = document.createElement('ARTICLE')
  article.className = ITEM_ARTICLE
  listItem.appendChild(article)
  
  let header = document.createElement('HEADER')
  header.className = ITEM_HEADER
  article.appendChild(header)
  
  let link = document.createElement('A')
  link.href = result.link
  link.className = ITEM_TITLE
  link.innerText = `${result.title} - ${result.displayLink}`
  header.appendChild(link)
  
  let section = document.createElement('SECTION')
  section.className = ITEM_BODY
  article.appendChild(section)
  
  let thumbnail = result.pagemap.cse_thumbnail
  if (thumbnail) {
    let {src, width, height} = thumbnail[0]
    link = document.createElement('A')
    link.href = result.link
    link.className = THUMBNAIL
    section.appendChild(link)
    
    let img = document.createElement('IMG')
    img.src = src
    img.width = width
    img.height = height
    link.appendChild(img)   
  }

  let snippet = document.createElement('P')
  snippet.className = SNIPPET
  snippet.innerHTML = result.htmlSnippet
  section.appendChild(snippet)
  
  return listItem
}

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
  document[INPUT_ELEMENT].blur()
  search(document[INPUT_ELEMENT].value, 1)
}

function search(q, start) {
  gapi?.client?.search.cse.list({ 
    'cx': '{{ $CX }}',
    'q': `${q}`,
    'start': start
  }).then(response => handleSearchResponse(JSON.parse(response.body)),
          err => console.log(`error executing search: ${JSON.stringify(err)}`))
}

function handleSearchResponse(response) {

  let {queries, items} = response
  
  let {previousPage, request, nextPage} = queries
  previousPage = previousPage?.[0]
  request = request[0]
  nextPage = nextPage?.[0]
    
  let {startIndex, searchTerms, totalResults, count} = request
  let endIndex = startIndex + count - 1
    
  // document.getElementById(START).innerText = `${startIndex}`
  // document.getElementById(END).innerText = `${endIndex}`
  // document.getElementById(TOTAL).innerText = `${totalResults}`
  document.getElementById(TERMS).innerText = `${searchTerms}`
  
  let list = document.getElementById(LIST)
  while (list.firstChild) { list.removeChild(list.firstChild) }
  
  items.map(result => resultListItem(result))
       .forEach(listItem => list.appendChild(listItem))
  
  let previous = document.getElementById(PREVIOUS)
  
  if (previousPage) {
    previous.hidden = false
    previous.onclick = event => { 
      event[eventHandled] = true
      search(searchTerms, previousPage.startIndex) 
    }
  } else {
    previous.hidden = true
  }
  
  let next = document.getElementById(NEXT)
  
  if (nextPage && nextPage.startIndex < 100) {
    next.hidden = false
    next.onclick = event => {
      event[eventHandled] = true
      search(searchTerms, nextPage.startIndex) 
    }
  } else {
    next.hidden = true
  }
  
  // let numbers = document.getElementById(NUMBERS)
  // while (numbers.firstChild) { numbers.removeChild(numbers.firstChild) }
  
  // let pageCount = Math.ceil(totalResults / 10)
  
  // for (let i = 0; i < pageCount; i++) {
    
    // let item = document.createElement('LI')
    
    // let pageNumber = i + 1
    // let start = i * 10 + 1
    // let pageLink = document.createElement('A')
    // pageLink.innerText = `${pageNumber}`
    // pageLink.onclick = event => {
    //   event[eventHandled] = true
    //   search(searchTerms, start)
    // }
    // if (start == startIndex) { pageLink.active = true }

    // item.appendChild(pageLink)
    // numbers.appendChild(item)
    
  // }
    
  
  let overlay = document.getElementById(OVERLAY)
  overlay.style.display = 'block'
  
  document.getElementById(ARTICLE).scrollTop = 0
  
  document[INPUT_ELEMENT].value = ''
  
}

{{ else }}

/* {{ "Generating this script requires valid CX and APIKey values" }} */

{{ end }}