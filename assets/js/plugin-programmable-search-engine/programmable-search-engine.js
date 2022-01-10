{{ with .Scratch.Get "plugin-programmable-search-engine.Parameters" -}}

/* Property symbols */

const EVENT_HANDLED  = Symbol('eventHandled')

const INPUT_ELEMENT    = Symbol({{ .SearchBar.Input.ID }})
const OVERLAY_ELEMENT  = Symbol({{ .ResultsOverlay.ID }})
const ARTICLE_ELEMENT  = Symbol({{ .ResultsOverlay.Article.ID }})
const TERMS_ELEMENT    = Symbol({{ .ResultsOverlay.Header.Terms.ID }})
const LIST_ELEMENT     = Symbol({{ .ResultItems.List.ID }})
const PREVIOUS_ELEMENT = Symbol({{ .ResultsOverlay.Footer.PreviousPageLink.ID }})
const NEXT_ELEMENT     = Symbol({{ .ResultsOverlay.Footer.NextPageLink.ID }})

/* 
  Load the rest API when the DOM content has loaded,
  inserting the search interface once complete.
*/
document.addEventListener('DOMContentLoaded',() => {
  
  gapi?.load('client', () => {
      gapi.client.setApiKey('{{ .Config.APIKey }}');
      gapi.client.load('https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest')
      .then(() => {
        console.log('GAPI client loaded')
        insertSearchBar()
        insertResultsOverlay()
      })
  });
  
})

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
    
    const loadPage = start => {
      return event => {
        event[EVENT_HANDLED] = true
        search(searchTerms, start)
      }
    }
             
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
    .list({'cx': '{{ .Config.CX }}', 'q': `${q}`, 'start': start})
    .then(response => handler(response), err => console.log(err))
    
}
  
/*
  Generates the search bar and inserts it as a child of the
  specified container
*/ 
function insertSearchBar() {
  
  let container = document.getElementById('{{ .SearchBar.ContainerID }}')
  
  let searchBar = document.createElement('DIV')
  searchBar.id = {{ .SearchBar.ID }}
  container.appendChild(searchBar)      

  let input = document.createElement('INPUT')
  input.type = 'search'
  input.id = {{ .SearchBar.Input.ID }}
  input.placeholder = '{{ .SearchBar.Input.Placeholder.Text }}'
  input.name = 'pse'
  input.setAttribute('aria-label', 'site search')
  input.onkeyup = ({key}) => key === 'Enter' && (input.blur() || search(input.value, 1))
  searchBar.appendChild(input)
  document[INPUT_ELEMENT] = input
  
  let button = document.createElement('BUTTON')
  button.id = {{ .SearchBar.Button.ID }}
  button.type = 'button'
  searchBar.appendChild(button)

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
              d='M207.1 0C93.12 0-.0002 93.13-.0002 208S93.12 416 \
              207.1 416s208-93.13 208-208S322.9 0 207.1 0zM207.1 \
              336c-70.58 0-128-57.42-128-128c0-70.58 57.42-128 \
              128-128s128 57.42 128 128C335.1 278.6 278.6 336 \
              207.1 336z'>
        </path>
        <path class='fa-primary' 
              fill='currentColor' 
              d='M500.3 443.7l-119.7-119.7c-15.03 22.3-34.26 \
              41.54-56.57 56.57l119.7 119.7c15.62 15.62 40.95 \
              15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7z'>
        </path>
      </g>
    </svg>`
  button.appendChild(svg)      
  
{{ if .SearchBar.Input.Collapsible }}
  /* Configure button for expanding and collapsing the input */
  const IS_EXPANDED  = Symbol()
  
  const toggleInput = () => {
        
    if (button[IS_EXPANDED]) {
      // Collapse the input
      
      input.style.width = 0
      input.style.paddingLeft = 0
      input.style.paddingRight = 0
      input.style.borderStyle = 'none'
      button.setAttribute('aria-expanded', false)
      button[IS_EXPANDED] = false
    }
    
    else {
      // Expand the input
      
      input.style.width = '{{ .SearchBar.Input.Width }}'
      input.style.paddingLeft = '{{ .SearchBar.Input.Padding.X }}'
      input.style.paddingRight = '{{ .SearchBar.Input.Padding.X }}'
      input.style.borderStyle = '{{ .SearchBar.Input.Border.Style }}'
      button.setAttribute('aria-expanded', true)
      button[IS_EXPANDED] = true
    }
    
  }
    
  input.onblur = toggleInput
  button.onclick = toggleInput
  button.setAttribute('aria-controls', {{ .SearchBar.Input.ID }})
  
  {{ if not (eq (lower .SearchBar.Input.InitialState) "expanded") }}
  
  button.setAttribute('aria-expanded', false)
  button[IS_EXPANDED] = false
  input.style.width = 0
  input.style.paddingLeft = 0
  input.style.paddingRight = 0
  input.style.borderStyle = 'none'
  
  {{ else }}
  
  button.setAttribute('aria-expanded', true)
  button[IS_EXPANDED] = true
  
  {{ end }}
  
{{ else }}
  
/* Disable the button */

  button.enabled = false
  button.setAttribute('aria-expanded', true)

{{ end }}

}

/*
  Generates the results overlay and inserts it at the body head
*/
function insertResultsOverlay() {
  
  let overlay = document.createElement('DIV')
  overlay.id = {{ .ResultsOverlay.ID }}
  overlay.onclick = event => !event[EVENT_HANDLED] && (overlay.style.display = 'none')
  document[OVERLAY_ELEMENT] = overlay
  
  let article = document.createElement('ARTICLE')
  article.id = {{ .ResultsOverlay.Article.ID }}
  overlay.appendChild(article)
  document[ARTICLE_ELEMENT] = article
  
  let header = document.createElement('HEADER')
  header.id = {{ .ResultsOverlay.Header.ID }}
  article.appendChild(header)
    
  let title = document.createElement('H2')
  title.id = {{ .ResultsOverlay.Header.Title.ID }}
  title.appendChild(document.createTextNode('Showing results for '))  
  header.appendChild(title)
    
  let terms = document.createElement('SPAN')
  terms.id = {{ .ResultsOverlay.Header.Terms.ID }}
  terms.innerText = 'searchTerms'
  title.appendChild(terms)
  document[TERMS_ELEMENT] = terms
  
  let items = document.createElement('SECTION')
  items.id = {{ .ResultItems.ID }}
  article.appendChild(items)
  
  let list = document.createElement('UL')
  list.id = {{ .ResultItems.List.ID }}
  items.appendChild(list)
  document[LIST_ELEMENT] = list
  
  let footer = document.createElement('FOOTER')
  footer.id = {{ .ResultsOverlay.Footer.ID }}  
  article.appendChild(footer)
    
  let previous = document.createElement('A')
  previous.id = {{ .ResultsOverlay.Footer.PreviousPageLink.ID }}
  previous.innerText = 'previous'
  footer.appendChild(previous)
  document[PREVIOUS_ELEMENT] = previous
    
  let next = document.createElement('A')
  next.id = {{ .ResultsOverlay.Footer.NextPageLink.ID }}
  next.innerText = 'next'
  footer.appendChild(next)
  document[NEXT_ELEMENT] = next
    
  document.body.insertBefore(overlay, document.body.firstChild)
  
}


function resultListItem(result) {
  
  let listItem = document.createElement('LI')
  listItem.className = {{ .ResultItems.Item.ClassName }}
  
  let article = document.createElement('ARTICLE')
  article.className = {{ .ResultItems.Item.Article.ClassName }}
  listItem.appendChild(article)
  
  let header = document.createElement('HEADER')
  header.className = {{ .ResultItems.Item.Header.ClassName }}
  article.appendChild(header)
  
  let link = document.createElement('A')
  link.href = result.link
  link.className = {{ .ResultItems.Item.Title.ClassName }}
  link.innerText = `${result.title} - ${result.displayLink}`
  header.appendChild(link)
  
  let section = document.createElement('SECTION')
  section.className = {{ .ResultItems.Item.Body.ClassName }}
  article.appendChild(section)
  
  let thumbnail = result.pagemap.cse_thumbnail
  if (thumbnail) {
    let {src, width, height} = thumbnail[0]
    link = document.createElement('A')
    link.href = result.link
    link.className = {{ .ResultItems.Item.Thumbnail.ClassName }}
    section.appendChild(link)
    
    let img = document.createElement('IMG')
    img.src = src
    img.width = width
    img.height = height
    link.appendChild(img)   
  }

  let snippet = document.createElement('P')
  snippet.className = {{ .ResultItems.Item.Snippet.ClassName }}
  snippet.innerHTML = result.htmlSnippet
  section.appendChild(snippet)
  
  return listItem
}

{{- end }}