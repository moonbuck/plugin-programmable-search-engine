
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


const SEARCH_BAR = 'pse-search-bar'
const COLLAPSIBLE = 'pse-collapsible'
const INPUT = 'pse-input'
const BUTTON = 'pse-button'

/*

Structure:

div#containerID
  div#SEARCH_BAR
    div#COLLAPSIBLE
      input#INPUT
    button#BUTTON
      ICON
    
*/

function insertSearchBar(containerID, placeholder, executeSearch) {
  
  let container = document.getElementById(containerID)
  
  let searchBar = document.createElement('DIV')
  searchBar.id = SEARCH_BAR
  
  let collapsible = document.createElement('DIV')
  collapsible.id = COLLAPSIBLE
  collapsible.className = 'collapsed'
  
  let input = document.createElement('INPUT')
  input.type = 'search'
  input.id = INPUT
  input.placeholder = placeholder
  input.name = 'pse'
  input.setAttribute('aria-label', 'site search')
  
  collapsible.appendChild(input)
  
  searchBar.appendChild(collapsible)
    
  let svg = document.createElement('SVG')
  svg.innerHTML = ICON
  
  let button = document.createElement('BUTTON')
  button.id = BUTTON
  button.type = 'button'
  button.onclick = () => { if (isShown()) { hideInput() } else { showInput() } }
  button.setAttribute('aria-expanded', false)
  button.setAttribute('aria-controls', 'collapsible')
  button.className = 'collapsed'

  button.appendChild(svg)

  searchBar.appendChild(button)
  
  container.appendChild(searchBar)  

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

// bootstrap/src/collapse.js:show
function showInput() {
  
  configureAriaAndClass(true)  
  document.getElementById(INPUT).focus()

}

function hideInput() { configureAriaAndClass(false) }

export {
  SEARCH_BAR,
  COLLAPSIBLE,
  INPUT,
  BUTTON,
  insertSearchBar,
  showInput,
  hideInput
}
