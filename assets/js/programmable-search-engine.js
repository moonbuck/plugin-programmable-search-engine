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

const WIDTH = '300px'
const COLLAPSIBLE_ID = 'programmable-search-engine-collapsible'
const INPUT_ID = 'programmable-search-engine-input'
const BUTTON_ID = 'programmable-search-engine-button'

function insertSearchBar() {
  
  let container = document.getElementById('programmable-search-engine-container')
  
  let collapsible = document.createElement("DIV")
  collapsible.id = COLLAPSIBLE_ID
  collapsible.className = "collapsed"
  
  let input = document.createElement("INPUT")
  input.type = 'search'
  input.id = INPUT_ID
  input.placeholder = 'search the mind of moondeer'
  input.setAttribute('aria-label', 'site search')
  input.addEventListener('keyup', ({key}) => key === "Enter" && executeSearch())
  
  collapsible.appendChild(input)
  
  container.appendChild(collapsible)
  
  let svg = document.createElement("SVG")
  svg.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="magnifying-glass" class="svg-inline--fa fa-magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g class="fa-duotone-group"><path class="fa-secondary" fill="currentColor" d="M207.1 0C93.12 0-.0002 93.13-.0002 208S93.12 416 207.1 416s208-93.13 208-208S322.9 0 207.1 0zM207.1 336c-70.58 0-128-57.42-128-128c0-70.58 57.42-128 128-128s128 57.42 128 128C335.1 278.6 278.6 336 207.1 336z"></path><path class="fa-primary" fill="currentColor" d="M500.3 443.7l-119.7-119.7c-15.03 22.3-34.26 41.54-56.57 56.57l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7z"></path></g></svg>'
  
  let button = document.createElement("BUTTON")
  button.id = BUTTON_ID
  button.type = 'button'
  button.onclick = () => { if (isShown()) hide() else show() }
  button.setAttribute('aria-expanded', false)
  button.setAttribute('aria-controls', 'collapsible')
  button.className = 'collapsed'

  button.appendChild(svg)

  container.appendChild(button)

}

function isShown() { 
  return document.getElementById(COLLAPSIBLE_ID)
                 .classList.contains('show') 
}

function configureAriaAndClass(isExpanded) {
    
  let button = document.getElementById(BUTTON_ID)
  button.setAttribute('aria-expanded', isExpanded)
  button.className = isExpanded ? 'expanded' : 'collapsed'
  
  let collapsible = document.getElementById(COLLAPSIBLE_ID)
  if (isExpanded) collapsible.classList.add('show')
  else collapsible.classList.remove('show')
  
}

let isTransitioning = false

// bootstrap/src/collapse.js:show
function show() {

  configureAriaAndClass(true)  
/*  
  if (isTransitioning || isShown()) { return }

  let collapsible = document.getElementById(COLLAPSIBLE_ID)
  
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

// bootstrap/js/src/utils/index.js:getTransitionDurationFromElement
function transitionDuration() {
  
  // Get transition-duration of the element
  let { transitionDuration, transitionDelay } = 
      window.getComputedStyle(document.getElementById(COLLAPSIBLE_ID))

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

// Make sure the client is loaded before calling this method.
function executeSearch() {
  let searchTerms = document.getElementById(INPUT_ID).value
  printToConsole(`${searchTerms}`, 'search terms')
  
  // gapi?.client?.search.cse.list({ "cx": "{{ $CX }}","q": `${query}`})
  //   .then(response => handleSearchResponse(response),
  //         err => console.log(`error encountered executing search: ${err}`));
}

function handleSearchResponse(response) {
  printToConsole(`response: ${response}`, 'handler');
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