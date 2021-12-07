# plugin-programmable-search-engine

![results-page](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/results-page.jpeg)

A plugin for [Micro.blog](https://micro.blog "Micro.blog") for adding a site search interface using Google’s [programmable search engiine](https://programmablesearchengine.google.com "Programmable Search Engine") API.

## Creating your Google Programmable Search Engine

Assuming you already have or are willing to go ahead and create an account with Google (which I assume is a necessary component to creating the programmable search engine), follow these steps to configure yourself a search engine.

1. Navigate to  the [landing page](https://programmablesearchengine.google.com "programmable search engine") and click the *Get Started* button. {{< lightbox src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/get-started.png" description="1. Navigate to  the <a href='https://programmablesearchengine.google.com'>landing page</a> and click the <i>Get Started</i> button." link-style="width:260px;height:auto" >}}

2. Click the *Add* button to create a new instance. {{< lightbox src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/add.png" description="2. Click the <i>Add</i> button to create a new instance." link-style="width:260px;height:auto" >}}

3. Enter your site address (I believe I went with `*.moondeer.blog/*`) and click *CREATE*. {{< lightbox src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/create.png" description="3. Enter your site address (I believe I went with <code>*.moondeer.blog/*</code>) and click <i>CREATE</i>." link-style="width:260px;height:auto" >}}

4. Click on *Control Panel* to get to the configuration. {{< lightbox src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/control-panel.png" description="4. Click on <i>Control Panel</i> to get to the configuration." link-style="width:260px;height:auto" >}}

5. Here’s the first value we need, the *Search engine ID*, this is the value referred to every else as `cx`. {{< lightbox src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/search-engine-id.png" description="5. Here’s the first value we need, the <i>Search engine ID</i>, this is the value referred to every else as <code>cx</code>." link-style="width:260px;height:auto" >}}

6. Now, scroll down a bit and find the *Programmatic Access* section. Click the *Get Started* button to the right of *Custom JSON Search API*.  {{< lightbox src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/custom-search-api.png" description="6. Now, scroll down a bit and find the <i>Programmatic Access</i> section. Click the *Get Started* button to the right of <i>Custom JSON Search API</i>." link-style="width:260px;height:auto" >}}

7. Find and click the *Get a Key* button. {{< lightbox src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/get-a-key.png" description="7. Find and click the <i>Get a Key</i> button." link-style="width:260px;height:auto" >}}

8. Select the *+ Create a new project* option. {{< lightbox src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/create-a-new-project.png" description="8. Select the <i>+ Create a new project</i> option." link-style="width:260px;height:auto" >}}

9. Pick a project name and click *NEXT*. {{< lightbox src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/project-name.png" description="9. Pick a project name and click <i>NEXT</i>." link-style="width:260px;height:auto" >}}

10. And here’s value number two, the API key. {{< lightbox src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/your-api-key.png" description="10. And here’s value number two, the API key." link-style="width:260px;height:auto" >}}

## Test Driving your Engine

If you follow those ten steps, you’ll end up with a working search engine constrained to your site content (or what Google has crawled of it). You can navigate to that *Public URL* Google kept mentioning as you were getting things setup. If you do, you’ll find an unimpressive page looking something like this:

![public-url](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/public-url.png)

Go ahead and perform a search. These are the same results the plugin will have access to using that *Custom Search JSON API*. The image below explains why I took one look at the Google-supplied interface options and said, “F$&k that noise … how do we get a hold of this data to display for ourselves”:

![ads-boo](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/ads-boo.png)

## Data, What Data?

So that *Custom Search JSON API* page we visited to get our API key kept pushing you to [Try this API](https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list?apix=true "Try this API"), am I right? Here is how can. Locate that *Search engine ID* value that I warned you we’d start calling `cx` and plop that little f$&ker in the *cx* field kinda like:

![try-this-api-cx](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/try-this-api-cx.png)

Then scroll until you find the *q* field (because *query* is such a long f$&king word) and plop in some search terms kinds like:

![try-this-api-q](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/try-this-api-q.png)

Now, the first time I did this (right after creating my API key) I got an error. No idea why. If you get one, holler. If you don’t, it means you have access to the exact same data the plugin (and that *Public URL* page) pulls down.

![try-this-api-response](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/try-this-api-response.png)

The response to a custom search request is detailed [here](https://developers.google.com/custom-search/v1/reference/rest/v1/Search "Search"). Let’s go over the bits I found to be relevant.

### Relevant Response Bits

queries
: `queries` contains 1 - 3 collections of metadata that amount to a glorified page index. There will always be an entry for *request*, this amounts to the current page. Each collection contains a *startIndex* value. I did a whole thing where I generated numbered navigation links for the pages at the bottom (you know, as you do); but, it turns out that the f$&king *totalResults* value is dynamic for some f$&king reason and displaying indices as estimates is horsesh$te (when I checked the *Public URL* page to see if Google, itself, could manufacture accurate indices, I found they could not. Run through your result pages, if you like swing-and-a-miss-indices, I will put them back). Anyway, all we really care about (seeing as we know the search terms), is that `startIndex` and the abscence or presence of *previousPage* and *nextPage* entries (and their `startIndex` values). If I’ve missed something you find to be relevant, feel free to share.

{{< language json >}}
```json
"queries": {
  "previousPage": [{
    …
    "startIndex": integer,
    …
  }],
  "request": [{
    …
    "startIndex": integer,
    …
  }],
  "nextPage": [{
    …
    "startIndex": integer,
    …
  }]
}
```
{{< /language >}}

items
: The `items` array holds the search [result](https://developers.google.com/custom-search/v1/reference/rest/v1/Search#result "Result") items corresponding to `queries.request`. The bits the plugin currently utilizes are these:

{{< language json >}}
```json
{
  …
  "title": string,
  …
  "link": string,
  "displayLink": string,
  …
  "htmlSnippet": string,
  …
  "pagemap": {
    f$&kin-random
  },
  …
}
```
{{< /language >}}

It’s the top four properties that compose the bulk of the displayed item. For result items without an image, they compose it entirely.

![result-without-thumbnail](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/result-without-thumbnail.jpeg)

None of my result items have ever had an *image* entry at the top level as depicted in the API (If y’all end up with an entry, holler, and I’ll add checks for *image* property). The thumbnail images are pulled out of that *pagemap* entry. This collection of page metadata will be influenced by Micro.blog theme and Micro.blog plugin installations. The result items I have received consistently contain an entry at `pagemap.cse_thumbnail[0]` (yeah, they wrap everything in a f$&kin’ array, no idea why). The plugin looks for this entry and when it finds it you get a thumbnail image to along with the other stuffs.

![result-with-thumbnail](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/result-with-thumbnail.jpeg)

### So What the F$&k is the PageMap?
Well, it turns out that a [PageMap](https://developers.google.com/custom-search/docs/structured_data#pagemaps "PageMaps") is yet another f$&kin’ form of structured data used by Google. It consists of a butt-ugly chunk of XML injected into the page `<head>` inside an HTML comment.

{{< language html >}}
```html
<html>
  <head>
   ...
  <!--
  <PageMap>
     <DataObject type="document">
        <Attribute name="title">The Biomechanics of a Badminton
        Smash</Attribute>
        <Attribute name="author">Avelino T. Lim</Attribute>
        <Attribute name="description">The smash is the most
        explosive and aggressive stroke in Badminton. Elite athletes can
        generate shuttlecock velocities of up to 370 km/h. To perform the
        stroke, one must understand the biomechanics involved, from the body
        positioning to the wrist flexion. </Attribute>
        <Attribute name="page_count">25</Attribute>
        <Attribute name="rating">4.5</Attribute>
        <Attribute name="last_update">05/05/2009</Attribute>
     </DataObject>
     <DataObject type="thumbnail">
        <Attribute name="src" value="http://www.example.com/papers/sic.png" />
        <Attribute name="width" value="627" />
        <Attribute name="height" value="167" />
     </DataObject>
  </PageMap>
  -->
  </head>
   ...
</html>
```
{{< /language >}}

Can we utilize PageMaps to inject precisely that data which every Micro.blogger using this plugin would want to have availble for display when viewing their search results? Jury is  still out. I did construct a partial that injects such an eye sore. For a post with all the fixings it generates something kinda like:

{{< language xml >}}
```xml
<!--
<PageMap>
  <DataObject type="post">
    <Attribute name="title">On the American Upside Down</Attribute>
    <Attribute name="summary">While the beltway press, the pundits, the 
      influencers, the organizers, and the cogs that compose the political
      machinery at large desperately cling to those norms and precedents 
      with which order has so long been coaxed from chaos, the unprecedented
      leaves breadcrumbs for the fresh-eyed to trace towards the trailhead,
      near the clearing within which it has planted itself openly as 
      invitation for observation.</Attribute>
    <Attribute name="reading_time">8</Attribute>
    <Attribute name="category">Perspectives</Attribute>
    <Attribute name="publish_date">2021-09-28T15:24:00-08:00</Attribute>
    <Attribute name="modified_date">2021-09-28T15:24:00-08:00</Attribute>
  </DataObject>
  <DataObject type="image">
    <Attribute name="src" value="https://moondeer.blog/uploads/2021/cbeaf7bb2f.jpg" />
  </DataObject>
  …
  <DataObject type="image">
    <Attribute name="src" value="https://moondeer.blog/uploads/2021/de854e7aa6.jpg" />
  </DataObject>
</PageMap>
-->
```
{{< /language >}}

Did it work? Time will tell. I assume we have to wait for Google to re-crawl the site’s pages, at which point the entries will show up in `pagemap` or they won’t.

## Plugin Parameters

![plugin-parameters](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/plugin-parameters.jpeg)

### Required parameter values

CX
: The search engine identifier (*Required*).
APIKey
: The search engine API key (*Required*).

### Build options

Build.Fingerprint
: Whether to provide subresource integrity by generating a base64-encoded cryptographic hash and attaching a `.Data.Integrity` property containing an integrity string, which is made up of the name of the hash function, one hyphen and the base64-encoded hash sum. (Default is `true`).

Build.SassOutput
: Output style for the compiled Sass. Valid options are nested, expanded, compact and compressed (Default is `nested`).

Build.MinifyScript
: Whether to minify the generated Javascript file (Default is `false`).

### Search bar options

SearchBar.ContainerID
: The ID of the element that will serve as the parent of the search bar injected via Javascript (Default is `pse-container`).

SearchBar.Input.Collapsible
: Whether the input field of the search bar is collapsible. (Default is `true`).

SearchBar.Input.InitialState
: Whether the input field is initially expanded or collapsed (Default is `collapsed`).

### Sass variable values

SearchBar.Input.Height
: The height to set for the input field (Default is `auto`).

SearchBar.Input.Width
: The width to set for the input field (Default is `300px`).

SearchBar.Input.Color
: The color of text within the input field (Default is `black`).

SearchBar.Input.Placeholder.Text
: The placeholder text displayed when the input field is empty (Default is `site search`).

SearchBar.Input.Placeholder.Color
: The color of the placeholder text (Default is `darkgray`).

SearchBar.Input.Transition.Duration
: The duration to use when collapsing and expanding the search field (Default is `.35s`).

SearchBar.Input.Transition.TimingFunction
: The time function to use when collapsing and expanding the search field (Default is `ease`).

SearchBar.Input.Padding.Y
: The vertical padding to set on the input field (Default is `0`).

SearchBar.Input.Padding.X
: The horizontal padding to set on the input field (Default is `0.5em`).

SearchBar.Input.Border.Radius
: The border radius value to set on the input field (Default is `1em`).

SearchBar.Input.Border.Style
: The border style to set on the input field (Default is `solid`).

SearchBar.Input.Border.Color
: The border color to set on the input field (Default is `rgba(0,0,0,0.125)`).

SearchBar.Input.Border.Width
: The border width to set on the input field (Default is `1px`).

SearchBar.Button.Color
: The color to set for the button when the input is collapsed (Default is `lightgray`).

SearchBar.Button.Padding.X
: The horizontal padding to set on the button (Default is `0.25em`).

SearchBar.Button.Padding.Y
: The vertical padding to set on the button (Default is `0`).

ResultsOverlay.Color
: The text color to set on the overlay element (Default is `currentcolor`).

ResultsOverlay.Font.Size
: The font size to set on the overlay element (Default is `1rem`).

ResultsOverlay.BG.Color
: The base background color (Default is `rgba(255,255,255,1)`).

ResultsOverlay.Header.Color
: The color for header text (Default is `currentcolor`).

ResultsOverlay.Header.Font.Size
: The font size to set for the results overlay header (Default is `inherit`).

ResultsOverlay.Header.Font.Weight
: The font weight to set for the results overlay header (Default is `inherit`).

ResultsOverlay.Header.Font.Style
: The font style to set for the results overlay header (Default is `inherit`).

ResultsOverlay.Header.Terms.Color
: The text color for the search terms (Default is `currentcolor`).

ResultsOverlay.Header.Terms.Font.Size
: The font size to set for the search terms (Default is `inherit`).

ResultsOverlay.Header.Terms.Font.Weight
: The font weight to set for the search terms (Default is `inherit`).

ResultsOverlay.Header.Terms.Font.Style
: The font style to set for the search terms (Default is `italic`).

ResultsOverlay.Link.Color
: The text color for the previous / next links (Default is `#646386`).

ResultsOverlay.Link.TextDecoration
: The text decoration for the previous / next links (Default is `none`).

ResultsOverlay.Link.Hover.Color
: The text color for the previous / next links when hovering (Default is `scale-color($results-overlay-link-color, $lightness: 10%)`).

ResultsOverlay.Link.Hover.TextDecoration
: The text decoration for the previous / next links when hovering (Default is `underline`).

ResultsOverlay.Item.Title.Color
: The text color for item title links (Default is `$results-overlay-link-color`).

ResultsOverlay.Item.Title.TextDecoration
: The text decoration for the item title links (Default is `$results-overlay-link-text-decoration`).

ResultsOverlay.Item.Title.Hover.Color
: The text color for item title links when hovering (Default is `"$results-overlay-link-hover-color"`).

ResultsOverlay.Item.Title.Hover.TextDecoration
: The text decoration for the item title links when hovering (Default is `$results-overlay-link-hover-text-decoration`).

ResultsOverlay.Item.Title.Font.Size
: The font size to set for item title links (Default is `inherit`).

ResultsOverlay.Item.Title.Font.Weight
: The font weight to set for item title links (Default is `inherit`).

ResultsOverlay.Item.Title.Font.Style
: The font style to set for item title links (Default is `inherit`).

ResultsOverlay.Item.Snippet.Color
: The text color for result item snippets (Default is `currentcolor`).

ResultsOverlay.Item.Snippet.Font.Size
: The font size for result item snippets (Default is `inherit`).

ResultsOverlay.Item.Snippet.Font.Weight
: The font weight for result item snippets (Default is `inherit`).

ResultsOverlay.Item.Snippet.Font.Style
: The font style for result item snippets (Default is `inherit`).