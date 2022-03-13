# Quikweb
<img src=/img/banner_repo.svg style="width: 100%; height: auto; margin: 0 auto;"></img>
Quikweb is a simple, JSON-based Node.js framework for rendering webpages using templates.

## Why?
First of all, this project is meant mostly as a JavaScript and Node.js learning opportunity. Secondly, creating even simple webpages using templates can be a nuissance. Misplaced _<div>_ tags that break the layout, or confusing stylesheet dependencies are a real pain. This tool is meant to help with quick template insertion, and later editing without a hassle.

## Usage
Before getting started make sure you have a working intallation of Node.js.
You can find the rendering script in the ['/src'](/src) directory.<br>
To run it, simply execute:
> node quikweb-render.js templates pagedata

Where:
- templates: path to a template pack manifest
- pagedata:  path to JSON page content file

### Creating page templates
First, create a new folder inside ['/src'](/src) named "tutorialpack" and open it.<br>
Create a new HTML file named "sample.html". This will be our template for a page element:
```html
<div class="sample">
[[title]]
<div class="sample__box">
[[text]]
[[qw_children]]
</div></div>
```
As you can see this template has certain _[[tags]]_ inserted. These tags will be later replaced by our content.<br>
> **IMPORTANT NOTE:** Some tags have special meaning!
- 'qw_template': identifies a given template, it cannot be used for user content
- 'qw_children': renders child elements, will not render text
- other tags beginning with 'qw_' may be used for special purposes, avoid using such tags

Now with this out of the way, we want to style the element that was just created.<br>
Create a new CSS file named "sample.css". This is the stylesheet for our element:
```css
.sample {
    border: 0.5rem solid black;
}
.sample__box {
    background-color: #fafafa;
    color: white;
    min-height: 10rem;
}
```
> **NOTE**: Stylesheets do not need to obey any special formatting or naming rules, and will work just fine with any content.

The last thing we need to do is bring the styling and the template together. This is done via template pack manifests.<br>
Create a new JSON file named "tutorialpack.json". This time place it outside the "tutorialpack" folder:
```json
{
    "qw_templates": [
        {
            "qw_id": "sample",
            "html": "tutorialpack/sample.html",
            "css": "tutorialpack/sample.css"
        }
    ]
}
```
> **IMPORTANT NOTE:**
'qw_id'and 'html' keys are required, a template without them is considered invalid.
'qw_html_base' is a special template used to define the main HTML document outline.
HTML implementation should contain exactly two tags:
- '[[qw_style]]': will be replaced by an embedded CSS stylesheet
- '[[qw_body]]': will be replaced by the webpage content

**Your directory structure should now look something like this:**
```
->  [src/]
    quikweb-render.js
    samplepack.json
    samplepage.json
    tutorialpack.json
    ->  [src/tutorialpack/]
        sample.css
        sample.html
    -> [src/samplepack/]
        ...
```

### Creating a website using templates
For this part of the tutorial we will be using our newly created template pack, that was described in the previous section.

Create a new JSON file named "tutorialpage.json", inside your ['/src'](/src) folder:
```json
{
	"qw_pagedata": [
	{
		"qw_template": "sample",
		"title": "Lorem Ipsum",
		"text": "Sample text",
		"qw_children": [
		{
			"qw_template": "sample",
			"text": "another sample text of child element"
		}
		]
	}
	]
}
```
> **IMPORTANT NOTE:** Some keys have special meaning!
- 'qw_pagedata': has to be an array, contains all page elements inside
- 'qw_template': identifies a given template, it cannot be used for user content
- 'qw_children': has to be an array, contains all child elements of given element
- other keys beginning with 'qw_' may be used for special purposes, avoid using those

You can add however many elements you wish to display on your page, as elements of 'qw_pagedata' array, or as elements of 'qw_children' array in a given element. Keep in mind, that your template will need to have a '[[qw_children]]' tag placed in it for child objects to be rendered.

**Your directory structure should now look something like this:**
```
->  [src/]
    quikweb-render.js
    samplepack.json
    samplepage.json
    tutorialpack.json
    tutorialpage.json
    ->  [src/tutorialpack/]
        sample.css
        sample.html
    -> [src/samplepack/]
        ...
```
### Running the build
Now all that is left to do is to run our build. Navigate to the ['/src'](/src) directory, and run:
> node quikweb-render.js tutorialpack.json tutorialpage.json

After the build finishes, you will be notified about the output file that has been created. By default all output files are stored in '/src/render'. This is the output that you should expect when opening the 'index.html' file in your browser of choice:<br>
<img src=/img/tutorial_output.png style="width: 100%; height: auto; margin: 0 auto;"></img>

## More examples
You can find a fuller, included webpage under ['src/samplepage.json'](/src) and a corresponding template pack under ['src/samplepack.json'](/src). Run the build, observe the output, and feel free to browse the json files to learn more. You can also contact me if you wish to ask any questions. Happy web development!

## Roadmap for the future

Among the things I would like to see improved in the future are:
- publication of Quikweb as an npm package
- better handling of file paths
- automatic page resource (imagery/fonts) collection
- referencing of template packs in page data files
- JavaScript embedding and integration with HTML id's

