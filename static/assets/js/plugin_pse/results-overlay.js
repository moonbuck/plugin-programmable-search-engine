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

export {
  eventHandled,
  OVERLAY,
  ARTICLE,
  HEADER,
  TITLE,
  START,
  END,
  TOTAL,
  TERMS,
  ITEMS,
  LIST,
  FOOTER,
  PREVIOUS,
  NEXT,
  insertResultsOverlay
}