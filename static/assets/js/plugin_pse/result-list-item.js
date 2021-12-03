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

export { resultListItem }