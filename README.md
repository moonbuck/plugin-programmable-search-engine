# plugin-programmable-search-engine

![results-page](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/results-page.jpeg)

A plugin for [Micro.blog](https://micro.blog "Micro.blog") for adding a site search interface using Google’s [programmable search engiine](https://programmablesearchengine.google.com "Programmable Search Engine") API.

## Creating your Google Programmable Search Engine

Assuming you already have or are willing to go ahead and create an account with Google (which I assume is a necessary component to creating the programmable search engine), follow these steps to configure yourself a search engine.

1. Navigate to  the [landing page](https://programmablesearchengine.google.com "programmable search engine") and click the *Get Started* button. ![get-started](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/get-started.png)

2. Click the *Add* button to create a new instance. ![add](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/add.png)

3. Enter your site address (I believe I went with `*.moondeer.blog/*`) and click *CREATE*. ![](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/create.png)

4. Click on *Control Panel* to get to the configuration. ![control-panel](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/control-panel.png)

5. Here’s the first value we need, the *Search engine ID*, this is the value referred to every else as `cx`. ![search-engine-id](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/search-engine-id.png)

6. Now, scroll down a bit and find the *Programmatic Access* section. Click the *Get Started* button to the right of *Custom JSON Search API*.  ![custom-search-api](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/custom-search-api.png)

7. Find and click the *Get a Key* button. ![get-a-key](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/get-a-key.png)

8. Select the *+ Create a new project* option. ![create-a-new-project](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/create-a-new-project.png)

9. Pick a project name and click *NEXT*. ![project-name](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/project-name.png)

10. And here’s value number two, the API key. ![your-api-key](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/your-api-key.png)

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

<dl>
<dt>queries</dt>
<dd><code>queries</code> contains 1 - 3 collections of metadata that amount to a glorified page index. There will always be an entry for <i>request</i>, this amounts to the current page. Each collection contains a <i>startIndex</i> value. I did a whole thing where I generated numbered navigation links for the pages at the bottom (you know, as you do); but, it turns out that the f$&king <i>totalResults</i> value is dynamic for some f$&king reason and displaying indices as estimates is horsesh$te (when I checked the <i>Public URL</i> page to see if Google, itself, could manufacture accurate indices, I found they could not. Run through your result pages, if you like swing-and-a-miss-indices, I will put them back). Anyway, all we really care about (seeing as we know the search terms), is that <code>startIndex</code> and the abscence or presence of <i>previousPage</i> and <i>nextPage</i> entries (and their <i>startIndex</i> values). If I’ve missed something you find to be relevant, feel free to share.
<div class="highlight highlight-source-json position-relative overflow-auto"><pre><span class="pl-ent">"queries"</span>: {
  <span class="pl-ent">"previousPage"</span>: [{
    <span>…</span>
    <span class="pl-ent">"startIndex"</span>: <span>integer,</span>
    <span>…</span>
  }],
  <span class="pl-ent">"request"</span>: [{
    <span>…</span>
    <span class="pl-ent">"startIndex"</span>: <span>integer,</span>
    <span>…</span>
  }],
  <span class="pl-ent">"nextPage"</span>: [{
    <span>…</span>
    <span class="pl-ent">"startIndex"</span>: <span>integer,</span>
    <span>…</span>
  }]
}</pre>
</div>
</dd>

<dt>items</dt>
<dd>The <code>items</code> array holds the search <a href='https://developers.google.com/custom-search/v1/reference/rest/v1/Search#result'>result</a> items corresponding to <code>queries.request</code>. The bits the plugin currently utilizes are these:
<div class="highlight highlight-source-json position-relative overflow-auto"><pre>{
  <span>…</span>
  <span class="pl-ent">"title"</span>: <span>string,</span>
  <span>…</span>
  <span class="pl-ent">"link"</span>: <span>string,</span>
  <span class="pl-ent">"displayLink"</span>: <span>string,</span>
  <span>…</span>
  <span class="pl-ent">"htmlSnippet"</span>: <span>string,</span>
  <span>…</span>
  <span class="pl-ent">"pagemap"</span>: {
    <span>f$&amp;kin-random</span>
  },
  <span>…</span>
}</pre>
</div>

It’s the top four properties that compose the bulk of the displayed item. For result items without an image, they compose it entirely.

<img src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/result-without-thumbnail.jpeg" />

None of my result items have ever had an <i>image</i> entry at the top level as depicted in the API (If y’all end up with an entry, holler, and I’ll add checks for <i>image</i> property). The thumbnail images are pulled out of that <i>pagemap</i> entry. This collection of page metadata will be influenced by Micro.blog theme and Micro.blog plugin installations. The result items I have received consistently contain an entry at <code>pagemap.cse_thumbnail[0]</code> (yeah, they wrap everything in a f$&kin’ array, no idea why). The plugin looks for this entry and when it finds it you get a thumbnail image to along with the other stuffs.

<img src="https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/result-with-thumbnail.jpeg" />
</dd>
</dl>

### So What the F$&k is the PageMap?
Well, it turns out that a [PageMap](https://developers.google.com/custom-search/docs/structured_data#pagemaps "PageMaps") is yet another f$&kin’ form of structured data used by Google. It consists of a butt-ugly chunk of XML injected into the page `<head>` inside an HTML comment.

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

Can we utilize PageMaps to inject precisely that data which every Micro.blogger using this plugin would want to have availble for display when viewing their search results? Jury is  still out. I did construct a partial that injects such an eye sore. For a post with all the fixings it generates something kinda like:

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

Did it work? Time will tell. I assume we have to wait for Google to re-crawl the site’s pages, at which point the entries will show up in `pagemap` or they won’t.

## Plugin Parameters

![plugin-parameters](https://raw.githubusercontent.com/moonbuck/plugin-programmable-search-engine/main/images/plugin-parameters.jpeg)

### Required parameter values

<dl>
<dt>CX</dt>
<dd>The search engine identifier (<i>Required</i>).</dd>
<dt>APIKey</dt>
<dd>The search engine API key (<i>Required</i>).</dd>
</dl>

### Build options

<dl>
<dt>Build.Fingerprint</dt>
<dd>Whether to provide subresource integrity by generating a base64-encoded cryptographic hash and attaching a <code>.Data.Integrity</code> property containing an integrity string, which is made up of the name of the hash function, one hyphen and the base64-encoded hash sum. (Default is <code>true</code>).</dd>

<dt>Build.SassOutput</dt>
<dd>Output style for the compiled Sass. Valid options are nested, expanded, compact and compressed (Default is <code>nested</code>).</dd>

<dt>Build.MinifyScript</dt>
<dd>Whether to minify the generated Javascript file (Default is <code>false</code>).</dd>
</dl>

### Search bar options

<dl>
<dt>SearchBar.ContainerID</dt>
<dd>The ID of the element that will serve as the parent of the search bar injected via Javascript (Default is <code>pse-container</code>).</dd>

<dt>SearchBar.Input.Collapsible</dt>
<dd>Whether the input field of the search bar is collapsible. (Default is <code>true</code>).</dd>

<dt>SearchBar.Input.InitialState</dt>
<dd>Whether the input field is initially expanded or collapsed (Default is <code>collapsed</code>).</dd>
</dl>

### Sass variable values

<dl>
<dt>SearchBar.Input.Height</dt>
<dd>The height to set for the input field (Default is <code>auto</code>).</dd>

<dt>SearchBar.Input.Width</dt>
<dd>The width to set for the input field (Default is <code>300px</code>).</dd>

<dt>SearchBar.Input.Color</dt>
<dd>The color of text within the input field (Default is <code>black</code>).</dd>

<dt>SearchBar.Input.Placeholder.Text</dt>
<dd>The placeholder text displayed when the input field is empty (Default is <code>site search</code>).</dd>

<dt>SearchBar.Input.Placeholder.Color</dt>
<dd>The color of the placeholder text (Default is <code>darkgray</code>).</dd>

<dt>SearchBar.Input.Transition.Duration</dt>
<dd>The duration to use when collapsing and expanding the search field (Default is <code>.35s</code>).</dd>

<dt>SearchBar.Input.Transition.TimingFunction</dt>
<dd>The time function to use when collapsing and expanding the search field (Default is <code>ease</code>).</dd>

<dt>SearchBar.Input.Padding.Y</dt>
<dd>The vertical padding to set on the input field (Default is <code>0</code>).</dd>

<dt>SearchBar.Input.Padding.X</dt>
<dd>The horizontal padding to set on the input field (Default is <code>0.5em</code>).</dd>

<dt>SearchBar.Input.Border.Radius</dt>
<dd>The border radius value to set on the input field (Default is <code>1em</code>).</dd>

<dt>SearchBar.Input.Border.Style</dt>
<dd>The border style to set on the input field (Default is <code>solid</code>).</dd>

<dt>SearchBar.Input.Border.Color</dt>
<dd>The border color to set on the input field (Default is <code>rgba(0,0,0,0.125)</code>).</dd>

<dt>SearchBar.Input.Border.Width</dt>
<dd>The border width to set on the input field (Default is <code>1px</code>).</dd>

<dt>SearchBar.Button.Color</dt>
<dd>The color to set for the button when the input is collapsed (Default is <code>lightgray</code>).</dd>

<dt>SearchBar.Button.Padding.X</dt>
<dd>The horizontal padding to set on the button (Default is <code>0.25em</code>).</dd>

<dt>SearchBar.Button.Padding.Y</dt>
<dd>The vertical padding to set on the button (Default is <code>0</code>).</dd>

<dt>ResultsOverlay.Color</dt>
<dd>The text color to set on the overlay element (Default is <code>currentcolor</code>).</dd>

<dt>ResultsOverlay.Font.Size</dt>
<dd>The font size to set on the overlay element (Default is <code>1rem</code>).</dd>

<dt>ResultsOverlay.BG.Color</dt>
<dd>The base background color (Default is <code>rgba(255,255,255,1)</code>).</dd>

<dt>ResultsOverlay.Header.Color</dt>
<dd>The color for header text (Default is <code>currentcolor</code>).</dd>

<dt>ResultsOverlay.Header.Font.Size</dt>
<dd>The font size to set for the results overlay header (Default is <code>inherit</code>).</dd>

<dt>ResultsOverlay.Header.Font.Weight</dt>
<dd>The font weight to set for the results overlay header (Default is <code>inherit</code>).</dd>

<dt>ResultsOverlay.Header.Font.Style</dt>
<dd>The font style to set for the results overlay header (Default is <code>inherit</code>).</dd>

<dt>ResultsOverlay.Header.Terms.Color</dt>
<dd>The text color for the search terms (Default is <code>currentcolor</code>).</dd>

<dt>ResultsOverlay.Header.Terms.Font.Size</dt>
<dd>The font size to set for the search terms (Default is <code>inherit</code>).</dd>

<dt>ResultsOverlay.Header.Terms.Font.Weight</dt>
<dd>The font weight to set for the search terms (Default is <code>inherit</code>).</dd>

<dt>ResultsOverlay.Header.Terms.Font.Style</dt>
<dd>The font style to set for the search terms (Default is <code>italic</code>).</dd>

<dt>ResultsOverlay.Link.Color</dt>
<dd>The text color for the previous / next links (Default is <code>#646386</code>).</dd>

<dt>ResultsOverlay.Link.TextDecoration</dt>
<dd>The text decoration for the previous / next links (Default is <code>none</code>).</dd>

<dt>ResultsOverlay.Link.Hover.Color</dt>
<dd>The text color for the previous / next links when hovering (Default is <code>scale-color($results-overlay-link-color, $lightness: 10%)</code>).</dd>

<dt>ResultsOverlay.Link.Hover.TextDecoration</dt>
<dd>The text decoration for the previous / next links when hovering (Default is <code>underline</code>).</dd>

<dt>ResultsOverlay.Item.Title.Color</dt>
<dd>The text color for item title links (Default is <code>$results-overlay-link-color</code>).</dd>

<dt>ResultsOverlay.Item.Title.TextDecoration</dt>
<dd>The text decoration for the item title links (Default is <code>$results-overlay-link-text-decoration</code>).</dd>

<dt>ResultsOverlay.Item.Title.Hover.Color</dt>
<dd>The text color for item title links when hovering (Default is <code>"$results-overlay-link-hover-color"</code>).</dd>

<dt>ResultsOverlay.Item.Title.Hover.TextDecoration</dt>
<dd>The text decoration for the item title links when hovering (Default is <code>$results-overlay-link-hover-text-decoration</code>).</dd>

<dt>ResultsOverlay.Item.Title.Font.Size</dt>
<dd>The font size to set for item title links (Default is <code>inherit</code>).</dd>

<dt>ResultsOverlay.Item.Title.Font.Weight</dt>
<dd>The font weight to set for item title links (Default is <code>inherit</code>).</dd>

<dt>ResultsOverlay.Item.Title.Font.Style</dt>
<dd>The font style to set for item title links (Default is <code>inherit</code>).</dd>

<dt>ResultsOverlay.Item.Snippet.Color</dt>
<dd>The text color for result item snippets (Default is <code>currentcolor</code>).</dd>

<dt>ResultsOverlay.Item.Snippet.Font.Size</dt>
<dd>The font size for result item snippets (Default is <code>inherit</code>).</dd>

<dt>ResultsOverlay.Item.Snippet.Font.Weight</dt>
<dd>The font weight for result item snippets (Default is <code>inherit</code>).</dd>

<dt>ResultsOverlay.Item.Snippet.Font.Style</dt>
<dd>The font style for result item snippets (Default is <code>inherit</code>).</dd>
</dl>