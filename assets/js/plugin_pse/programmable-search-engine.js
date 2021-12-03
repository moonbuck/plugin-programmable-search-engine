{{ $params := site.Params }}

{{ $config := site.Data.plugin_programmable_search_engine_config }}
{{ $config  = $config | default site.Data.plugin_programmable_search_engine.config }}

{{ $CX := index $params "programmablesearchengine.cx"  }}
{{ $CX  = $CX | default $config.CX }}

{{ $APIKey := index $params "programmablesearchengine.apikey"  }}
{{ $APIKey  = $APIKey | default $config.APIKey }}

{{ if (and $CX $APIKey) }}

{{ $ContainerID := index $params "programmablesearchengine.searchbar.containerid" }}
{{ $ContainerID  = $ContainerID | default $config.SearchBar.ContainerID }}

{{ $Placeholder := index $params "programmablesearchengine.searchbar.input.placeholder" }}
{{ $Placeholder  = $Placeholder | default $config.SearchBar.Input.Placeholder }}
{{ $Placeholder  = $Placeholder | default "site search" }}

document.addEventListener('DOMContentLoaded',() => {
  
  // redirectLog()
  
  insertSearchBar()
  
  insertResultsOverlay()
  
  gapi?.load('client', () => {
      gapi.client.setApiKey('{{ $APIKey }}');
      gapi.client.load('https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest')
      .then(() => console.log('GAPI client loaded for API'))
  });
  
})

const ICON = `\
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


const CONTAINER = '{{ $ContainerID }}'
const WIDTH = '300px'
const SEARCH_BAR = 'pse-search-bar'
const COLLAPSIBLE = 'pse-collapsible'
const INPUT = 'pse-input'
const BUTTON = 'pse-button'

/*

Structure:

div#{{ $ContainerID }}
  div#SEARCH_BAR
    div#COLLAPSIBLE
      input#INPUT
    button#BUTTON
      ICON
    
*/

function insertSearchBar() {
  
  let container = document.getElementById(CONTAINER)
  
  let searchBar = document.createElement('DIV')
  searchBar.id = SEARCH_BAR
  
  let collapsible = document.createElement('DIV')
  collapsible.id = COLLAPSIBLE
  collapsible.className = 'collapsed'
  
  let input = document.createElement('INPUT')
  input.type = 'search'
  input.id = INPUT
  input.placeholder = '{{ $Placeholder }}'
  input.setAttribute('results', 5)
  input.setAttribute('autosave', 'pse-recent-queries')
  input.name = 'pse'
  input.setAttribute('aria-label', 'site search')
  input.addEventListener('keyup', ({key}) => key === 'Enter' && executeSearch())
  
  collapsible.appendChild(input)
  
  searchBar.appendChild(collapsible)
    
  let svg = document.createElement('SVG')
  svg.innerHTML = ICON
  
  let button = document.createElement('BUTTON')
  button.id = BUTTON
  button.type = 'button'
  button.onclick = () => { if (isShown()) { hide() } else { show() } }
  button.setAttribute('aria-expanded', false)
  button.setAttribute('aria-controls', 'collapsible')
  button.className = 'collapsed'

  button.appendChild(svg)

  searchBar.appendChild(button)
  
  container.appendChild(searchBar)  

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
const FOOTER = 'pse-result-footer'
const PREVIOUS = 'pse-result-previous-page'
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
  title.appendChild(document.createTextNode('Showing items '))
  header.appendChild(title)
  
  let startIndex = document.createElement('SPAN')
  startIndex.id = START
  startIndex.innerText = 'startIndex'
  title.appendChild(startIndex)
  
  title.appendChild(document.createTextNode(' - '))
  
  let endIndex = document.createElement('SPAN')
  endIndex.id = END
  endIndex.innerText = 'endIndex'
  title.appendChild(endIndex)
  
  title.appendChild(document.createTextNode(' of '))
  
  let total = document.createElement('SPAN')
  total.id = TOTAL
  total.innerText = 'total'
  title.appendChild(total)
  
  title.appendChild(document.createTextNode(' results for '))
  
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
    
  let previous = document.createElement('BUTTON')
  previous.id = PREVIOUS
  previous.innerText = 'previous'
  footer.appendChild(previous)
  
  let next = document.createElement('BUTTON')
  next.id = NEXT
  next.innerText = 'next'
  footer.appendChild(next)
  
  
  document.body.insertBefore(overlay, document.body.firstChild)
  
}

// Make sure the client is loaded before calling this method.
function executeSearch() {
  let input = document.getElementById(INPUT)
  input.blur()
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
          err => console.log(`error encountered executing search: ${err}`))
}

function handleSearchResponse(response) {

  let {queries, items} = response
  
  let {previousPage, request, nextPage} = queries
  previousPage = previousPage?.[0]
  request = request[0]
  nextPage = nextPage?.[0]
  
  // console.log(previousPage, 'previousPage')
  // console.log(request, 'request')
  // console.log(nextPage, 'nextPage')
  // console.log(items.length, 'items.length')
  
  let {startIndex, searchTerms, totalResults, count} = request
  let endIndex = startIndex + count - 1
  
  // console.log(startIndex, 'startIndex')
  // console.log(endIndex, 'endIndex')
  // console.log(searchTerms, 'searchTerms')
  // console.log(totalResults, 'totalResults')
  // console.log(count, 'count')
  
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

const LIST_ITEM = 'pse-list-item'
const ITEM_TITLE = 'pse-item-title'
const SNIPPET = 'pse-snippet'
const THUMBNAIL = 'pse-thumbnail'


function resultListItem(result) {
  
  let listItem = document.createElement('LI')
  listItem.className = LIST_ITEM
  
  let link = document.createElement('A')
  link.href = result.link
  link.className = ITEM_TITLE
  link.innerText = `${result.title} - ${result.displayLink}`  
  listItem.appendChild(link)
  
  debugger;
  let thumbnail = result.pagemap.cse_thumbnail
  if (thumbnail) {
    let {src, width, height} = thumbnail[0]
    link = document.createElement('A')
    link.href = result.link
    link.className = THUMBNAIL
    listItem.appendChild(link)
    
    let img = document.createElement('IMG')
    img.src = src
    img.width = width
    img.height = height
    link.appendChild(img)   
  }

  let snippet = document.createElement('P')
  snippet.className = SNIPPET
  snippet.innerHTML = result.htmlSnippet
  listItem.appendChild(snippet)
  
  return listItem
}

function isShown() { 
  return document.getElementById(COLLAPSIBLE)
                 .classList.contains('show') 
}

function configureAriaAndClass(isExpanded) {
    
  let button = document.getElementById(BUTTON)
  button.setAttribute('aria-expanded', isExpanded)
  button.className = isExpanded ? 'expanded' : 'collapsed'
  
  let collapsible = document.getElementById(COLLAPSIBLE)
  if (isExpanded) collapsible.classList.add('show')
  else collapsible.classList.remove('show')
  
}

let isTransitioning = false

// bootstrap/src/collapse.js:show
function show() {
  configureAriaAndClass(true)  
  document.getElementById(INPUT).focus()
/*  
  if (isTransitioning || isShown()) { return }

  let collapsible = document.getElementById(COLLAPSIBLE)
  
  collapsible.classList.remove('collapse')
  collapsible.classList.add('collapsing')
  collapsible.style.width = 0
  
  
  
  const startEvent = EventHandler.trigger(collapsible, 'show.md.collapse')
  if (startEvent.defaultPrevented) {
    return
  }
  
  const dimension = this._getDimension()

  this._element.classList.remove(CLASS_NAME_COLLAPSE)
  this._element.classList.add(CLASS_NAME_COLLAPSING)

  this._element.style[dimension] = 0

  this._addAriaAndCollapsedClass(this._triggerArray, true)
  this._isTransitioning = true

  const complete = () => {
    this._isTransitioning = false

    this._element.classList.remove(CLASS_NAME_COLLAPSING)
    this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW)

    this._element.style[dimension] = ''

    EventHandler.trigger(this._element, EVENT_SHOWN)
  }

  const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1)
  const scrollSize = `scroll${capitalizedDimension}`

  this._queueCallback(complete, this._element, true)
  this._element.style[dimension] = `${this._element[scrollSize]}px`
  */
}

function hide() {
  
  configureAriaAndClass(false)
  
  /*
  if (this._isTransitioning || !this._isShown()) {
    return
  }

  const startEvent = EventHandler.trigger(this._element, EVENT_HIDE)
  if (startEvent.defaultPrevented) {
    return
  }

  const dimension = this._getDimension()

  this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`

  reflow(this._element)

  this._element.classList.add(CLASS_NAME_COLLAPSING)
  this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW)

  for (const trigger of this._triggerArray) {
    const elem = getElementFromSelector(trigger)

    if (elem && !this._isShown(elem)) {
      this._addAriaAndCollapsedClass([trigger], false)
    }
  }

  this._isTransitioning = true

  const complete = () => {
    this._isTransitioning = false
    this._element.classList.remove(CLASS_NAME_COLLAPSING)
    this._element.classList.add(CLASS_NAME_COLLAPSE)
    EventHandler.trigger(this._element, EVENT_HIDDEN)
  }

  this._element.style[dimension] = ''

  this._queueCallback(complete, this._element, true)
  */
}
/*
// bootstrap/js/src/utils/index.js:getTransitionDurationFromElement
function transitionDuration() {
  
  // Get transition-duration of the element
  let { transitionDuration, transitionDelay } = 
      window.getComputedStyle(document.getElementById(COLLAPSIBLE))

  const floatTransitionDuration = Number.parseFloat(transitionDuration)
  const floatTransitionDelay = Number.parseFloat(transitionDelay)

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration && !floatTransitionDelay) { return 0 }

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(',')[0]
  transitionDelay = transitionDelay.split(',')[0]

  let duration = ( Number.parseFloat(transitionDuration) 
                 + Number.parseFloat(transitionDelay))
                 * 1000
  return duration
}

// bootstrap/js/src/utils/index.js:executeAfterTransition
function executeAfterTransition(callback, transitionElement) {
  
  const emulatedDuration = transitionDuration() + 5
  const transitionEnd = 'transitionend'
  
  let called = false
  

  const handler = ({ target }) => {
    if (target !== transitionElement) { return }

    called = true
    transitionElement.removeEventListener(transitionEnd, handler)
    execute(callback)
  }

  transitionElement.addEventListener(transitionEnd, handler)
  let onTimeout = () => { 
    if (!called) { transitionElement.dispatchEvent(new Event(transitionEnd)) } 
  }
  setTimeout(onTimeout, emulatedDuration)
  
}
*/

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

{{ else }}

/* {{ "Generating this script requires valid CX and APIKey values" }} */

{{ end }}