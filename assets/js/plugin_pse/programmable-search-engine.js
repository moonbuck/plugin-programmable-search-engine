/* Constants */

// Plugin parameter values
const CX               = '{{ .Scratch.Get "CX" }}'
const API_KEY          = '{{ .Scratch.Get "APIKey" }}'
const CONTAINER_ID     = '{{ .Scratch.Get "SearchBar.ContainerID" }}'
const PLACEHOLDER_TEXT = '{{ .Scratch.Get "SearchBar.Input.Placeholder.Text" }}'
const COLLAPSIBLE      = '{{ .Scratch.Get "SearchBar.Input.Collapsible" }}'
const INITIAL_STATE    = '{{ .Scratch.Get "SearchBar.Input.InitialState" }}'

// HTML element IDs
const SEARCH_BAR_ID            = 'pse-search-bar'
const SEARCH_BAR_INPUT_ID      = 'pse-search-bar-input'
const SEARCH_BAR_BUTTON_ID     = 'pse-search-bar-button'
const RESULTS_OVERLAY_ID       = 'pse-results-overlay'
const RESULTS_ARTICLE_ID       = 'pse-results-article'
const RESULTS_HEADER_ID        = 'pse-results-header'
const RESULTS_TITLE_ID         = 'pse-results-title'
const RESULTS_SEARCH_TERMS_ID  = 'pse-results-search-terms'
const RESULTS_ITEMS_ID         = 'pse-results-items'
const RESULTS_ITEM_LIST_ID     = 'pse-results-item-list'
const RESULTS_FOOTER_ID        = 'pse-results-footer'
const RESULTS_PREVIOUS_PAGE_ID = 'pse-results-previous-page'
const RESULTS_NEXT_PAGE_ID     = 'pse-results-next-page'


// HTML element class names
const RESULT_LIST_ITEM_CLASS      = 'pse-result-item'
const RESULT_ITEM_ARTICLE_CLASS   = 'pse-result-item-article'
const RESULT_ITEM_HEADER_CLASS    = 'pse-result-item-header'
const RESULT_ITEM_BODY_CLASS      = 'pse-result-item-body'
const RESULT_ITEM_TITLE_CLASS     = 'pse-result-item-title'
const RESULT_ITEM_SNIPPET_CLASS   = 'pse-result-item-snippet'
const RESULT_ITEM_THUMBNAIL_CLASS = 'pse-result-item-thumbnail'

// CSS custom variable names
const INPUT_WIDTH        = '--pse-search-bar-input-width'
const INPUT_PADDING_X    = '--pse-search-bar-input-padding-x'
const INPUT_BORDER_STYLE = '--pse-search-bar-input-border-style'


// Property symbols
const WIDTH          = Symbol(INPUT_WIDTH)
const PADDING_X      = Symbol(INPUT_PADDING_X)
const BORDER_STYLE   = Symbol(INPUT_BORDER_STYLE)

const IS_EXPANDED    = Symbol()
const EVENT_HANDLED  = Symbol()

const INPUT_ELEMENT    = Symbol(SEARCH_BAR_INPUT_ID)
const BUTTON_ELEMENT   = Symbol(SEARCH_BAR_BUTTON_ID)
const OVERLAY_ELEMENT  = Symbol(RESULTS_OVERLAY_ID)
const ARTICLE_ELEMENT  = Symbol(RESULTS_ARTICLE_ID)
const TERMS_ELEMENT    = Symbol(RESULTS_SEARCH_TERMS_ID)
const LIST_ELEMENT     = Symbol(RESULTS_ITEM_LIST_ID)
const PREVIOUS_ELEMENT = Symbol(RESULTS_PREVIOUS_PAGE_ID)
const NEXT_ELEMENT     = Symbol(RESULTS_NEXT_PAGE_ID)

/* 
  Load the rest API when the DOM content has loaded,
  inserting the search interface once complete.
*/
document.addEventListener('DOMContentLoaded',() => {
  
  const url = 'https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest'
  
  gapi?.load('client', () => {
      gapi.client.setApiKey(API_KEY);
      gapi.client.load(url)
      .then(() => {
        console.log('GAPI client loaded')
        insertSearchBar()
        insertResultsOverlay()
      })
  });
  
})

/* 
  Invokes a search for the current input value.
*/
function executeSearch() {
  document[INPUT_ELEMENT].blur()
  search(document[INPUT_ELEMENT].value, 1)
}

/* 
  Fetch results for the specified query with the specified index offset
*/
function search(q, start) {
  
  // Create a handler for the received responce
  const handler = response => {
    
    // Parse the response and capture what we need.
    let {queries, items} = JSON.parse(response.body)
  
    // Unpack the queries
    let {previousPage, request, nextPage} = queries
    previousPage = previousPage?.[0]
    request = request[0]
    nextPage = nextPage?.[0]
      
    // Get the search terms for the current results
    let {searchTerms} = request
    
    // Update the header with the current search terms
    document[TERMS_ELEMENT].innerText = `${searchTerms}`
    
    // Remove any pre-existing list items
    let list = document[LIST_ELEMENT]
    while (list.firstChild) { list.removeChild(list.firstChild) }
    
    // Map result items to LI items and append to the list
    items.map(result => resultListItem(result))
         .forEach(listItem => list.appendChild(listItem))
    
    const loadPage = start => event => event[EVENT_HANDLED] = true || search(searchTerms, start)
             
    if (previousPage) {
      document[PREVIOUS_ELEMENT].hidden = false
      document[PREVIOUS_ELEMENT].onclick = loadPage(previousPage.startIndex)
    } else {
      document[PREVIOUS_ELEMENT].hidden = true
    }
    
    let next = document[NEXT_ELEMENT]
    
    if (nextPage && nextPage.startIndex < 100) {
      document[NEXT_ELEMENT].hidden = false
      document[NEXT_ELEMENT].onclick = loadPage(nextPage.startIndex)
    } else {
      document[NEXT_ELEMENT].hidden = true
    }
      
    document[OVERLAY_ELEMENT].style.display = 'block'    
    document[ARTICLE_ELEMENT].scrollTop = 0    
    document[INPUT_ELEMENT].value = ''
  } // handler
  
  // Invoke the search with above handler
  gapi?.client?.search.cse
    .list({'cx': CX, 'q': `${q}`, 'start': start})
    .then(response => handler(response), err => console.log(err))
    
}
  
/*
  Generates the search bar and inserts it as a child of the
  specified container
*/ 
function insertSearchBar() {
  
  let container = document.getElementById(CONTAINER_ID)
  
  let searchBar = document.createElement('DIV')
  searchBar.id = SEARCH_BAR_ID
  container.appendChild(searchBar)      
  
  let computedStyle = getComputedStyle(container)
  
  let input = document.createElement('INPUT')
  input.type = 'search'
  input.id = SEARCH_BAR_INPUT_ID
  input.placeholder = PLACEHOLDER_TEXT
  input.name = 'pse'
  input.setAttribute('aria-label', 'site search')
  input[WIDTH] = computedStyle.getPropertyValue(INPUT_WIDTH)
  input.style.setProperty(INPUT_WIDTH, 0)
  input[PADDING_X] = computedStyle.getPropertyValue(INPUT_PADDING_X)
  input.style.setProperty(INPUT_PADDING_X, 0)
  input[BORDER_STYLE] = computedStyle.getPropertyValue(INPUT_BORDER_STYLE)
  input.style.setProperty(INPUT_BORDER_STYLE, 'none')
  input.addEventListener('keyup', ({key}) => key === 'Enter' && executeSearch())
  searchBar.appendChild(input)
  document[INPUT_ELEMENT] = input
    
  let button = document.createElement('BUTTON')
  button.id = SEARCH_BAR_BUTTON_ID
  button.type = 'button'
  button.onclick = toggleInput
  button.setAttribute('aria-expanded', false)
  button[IS_EXPANDED] = false
  button.setAttribute('aria-controls', SEARCH_BAR_INPUT_ID)
  searchBar.appendChild(button)
  document[BUTTON_ELEMENT] = button
  
  input.onblur = toggleInput
  
  let svg = document.createElement('SVG')
  svg.innerHTML = `\
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
  
/*
  Generates the results overlay and inserts it at the body head
*/
function insertResultsOverlay() {
  
  let overlay = document.createElement('DIV')
  overlay.id = RESULTS_OVERLAY_ID
  overlay.onclick = event => !event[EVENT_HANDLED] && overlay.style.display = 'none'
  document[OVERLAY_ELEMENT] = overlay
  
  let article = document.createElement('ARTICLE')
  article.id = RESULTS_ARTICLE_ID
  overlay.appendChild(article)
  document[ARTICLE_ELEMENT] = article
  
  let header = document.createElement('HEADER')
  header.id = RESULTS_HEADER_ID
  article.appendChild(header)
    
  let title = document.createElement('H2')
  title.id = RESULTS_TITLE_ID
  title.appendChild(document.createTextNode('Showing results for '))  
  header.appendChild(title)
    
  let terms = document.createElement('SPAN')
  terms.id = RESULTS_SEARCH_TERMS_ID
  terms.innerText = 'searchTerms'
  title.appendChild(terms)
  document[TERMS_ELEMENT] = terms
  
  let items = document.createElement('SECTION')
  items.id = RESULTS_ITEMS_ID
  article.appendChild(items)
  
  let list = document.createElement('UL')
  list.id = RESULTS_ITEM_LIST_ID
  items.appendChild(list)
  document[LIST_ELEMENT] = list
  
  let footer = document.createElement('FOOTER')
  footer.id = RESULTS_FOOTER_ID  
  article.appendChild(footer)
    
  let previous = document.createElement('A')
  previous.id = RESULTS_PREVIOUS_PAGE_ID
  previous.innerText = 'previous'
  footer.appendChild(previous)
  document[PREVIOUS_ELEMENT] = previous
    
  let next = document.createElement('A')
  next.id = RESULTS_NEXT_PAGE_ID
  next.innerText = 'next'
  footer.appendChild(next)
  document[NEXT_ELEMENT] = next
    
  document.body.insertBefore(overlay, document.body.firstChild)
  
}


function resultListItem(result) {
  
  let listItem = document.createElement('LI')
  listItem.className = RESULT_LIST_ITEM_CLASS
  
  let article = document.createElement('ARTICLE')
  article.className = RESULT_ITEM_ARTICLE_CLASS
  listItem.appendChild(article)
  
  let header = document.createElement('HEADER')
  header.className = RESULT_ITEM_HEADER_CLASS
  article.appendChild(header)
  
  let link = document.createElement('A')
  link.href = result.link
  link.className = RESULT_ITEM_TITLE_CLASS
  link.innerText = `${result.title} - ${result.displayLink}`
  header.appendChild(link)
  
  let section = document.createElement('SECTION')
  section.className = RESULT_ITEM_BODY_CLASS
  article.appendChild(section)
  
  let thumbnail = result.pagemap.cse_thumbnail
  if (thumbnail) {
    let {src, width, height} = thumbnail[0]
    link = document.createElement('A')
    link.href = result.link
    link.className = RESULT_ITEM_THUMBNAIL_CLASS
    section.appendChild(link)
    
    let img = document.createElement('IMG')
    img.src = src
    img.width = width
    img.height = height
    link.appendChild(img)   
  }

  let snippet = document.createElement('P')
  snippet.className = RESULT_ITEM_SNIPPET_CLASS
  snippet.innerHTML = result.htmlSnippet
  section.appendChild(snippet)
  
  return listItem
}