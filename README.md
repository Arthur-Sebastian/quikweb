# Quikweb
<img src=/img/banner_repo.svg style="width: 100%; height: auto; margin: 0 auto;"></img>
### A simple, JSON-based framework for rendering webpages using Node.js.

## Why?
This project is meant mostly as a JavaScript and Node.js learning opportunity. It does have a purpose beyond that though - website creation and design assistance with little initial configuration. Misplaced _\<div>_ tags that break the layout or confusing stylesheet dependencies will be a pain long gone. This tool is meant to help with quick template insertion and editing without a hassle.

## Prerequisites
- a working installation of Node.js
- good knowledge of JSON file format
- (optional) knowledge of HTML and CSS

## Usage
Open the ['/src'](/src) directory in a terminal. You will find the ['quikweb-render.js'](src/quikweb-render.js) script with provided examples inside. 

To run, execute:
> node quikweb-render.js templates pagedata

| PARAMETER | FUNCTION                              |
|-----------|---------------------------------------|
| templates | path to a template pack manifest file |
| pagedata  | path to a JSON page content file      |

## Creating page templates

### Step 1: HTML element
First, create a new folder inside ['/src'](/src) named **'tutorialpack'**. Then, create a new HTML file named **'sample.html'** inside **'src/tutorialpack'**. This will be our template for a page element:
```html
<div class="sample">
[[title]]
<div class="sample__box">
[[text]]
[[qw_children]]
</div></div>
```
As you can see this template has certain **[[tags]]** inserted. This is a div element with a **[[title]]** and a nested div inside that has some **[[text]]**. Notice the **[[qw_children]]** tag. It will allow us to nest more elements inside of this one.

The general notion is this: tags will be replaced by content, and can basically be arbitrary (with a few exceptions). Page content file defines what those tags will be replaced with. Tag names need to be unique, unless you want to render the same content in multiple places.

> 📙 **IMPORTANT NOTE:**<br>
Some tags have special meaning! See reference below.

| TAG             | FUNCTION                                                        |
|-----------------|-----------------------------------------------------------------|
| [[qw_template]] | identifies a template, cannot be used for user content          |
| [[qw_children]] | renders only child elements, will not render user-defined text  |
| [[qw_*]]        | tags beginning with 'qw_' are reserved for future functionality |

---
### Step 2: CSS element style
Now with this out of the way, we want to style the element that was just created. Create a new CSS file named **'sample.css'** inside **'/src/tutorialpack'**. This is the stylesheet for our element:

```css
.sample {
    border: 0.5rem solid black;
}
.sample__box {
    background-color: #3d3846;
    color: white;
    min-height: 10rem;
}
```

Stylesheets do not need to obey any special formatting or naming rules, and will work just fine with any content. Keep in mind that you can import only one stylesheet per page template, and one stylesheet should describe a single element.

---
### Step 3: Template pack manifest
The last thing we need to do is bring the styling and the template together. This is done via template pack manifests. Create a new JSON file named **'tutorialpack.json'** inside ['/src'](/src):

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

As of now, this pack declares only one element template named 'sample' that uses our new HTML and CSS files. To add another template to the pack manifest, add another JSON object to the **'qw_templates'** array, altering relevant fields. **'qw_id'** should be unique for every template.

> ⚠️ **WARNING:**<br>
Referencing the same CSS stylesheet in multiple templates will likely result in duplicates inside the embedded global stylesheet. If a given stylesheet is implementing multiple elements (strongly discouraged) only reference it once in the manifest.

| KEY            | FUNCTION                                   |
|----------------|--------------------------------------------|
| "qw_templates" | an array of template objects               |
| "qw_id"        | (required) unique template identifier      |
| "html"         | (required) reference to HTML template file |
| "css"          | (optional) reference to CSS stylesheet     |

---
### Step 4 (OPTIONAL): Output document template
This section of the tutorial can be safely skipped.

You can change the general webpage file structure for the rendered HTML document by declaring a template named **'qw_html_base'** inside your template pack manifest. This is not required, as Quikweb contains an embedded, fallback document template - it should be sufficient for the simplest of websites, but it does not include many important meta tags.

Overriding document template should contain exactly two content tags inside its HTML implementation:

| TAG          | FUNCTION                                       |
|--------------|------------------------------------------------|
| [[qw_style]] | will be replaced by an embedded CSS stylesheet |
| [[qw_body]]  | will be replaced by the webpage content        |

Just having this template declared inside a pack manifest will result in it being automatically used for generated webpages. You can find an example of this special template inside ['/src/samplepack/html_base'](/src/samplepack/html_base), and its proper declaration in the ['samplepack.json'](/src/samplepack.json) file.

> ⚠️ **WARNING:**<br>
Do not use this template in the page data file. There is no check implemented against this as of now, and it will break your webpage.

## Creating a website using templates
For this part of the tutorial we will be using our newly created template pack, that was described in previous sections.

### Step 1: Page data
Create a new JSON file named **'tutorialpage.json'** inside your ['/src'](/src) folder.

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

This webpage will consist of a main **'sample'** type element with the title **"Lorem Ipsum"** and a text saying **"Sample text"**. The main element also has a nested element of the same type, but this time it has no title, and the text is different. Remember the tags placed inside the **'sample.html'** file? Those keys correspond to those tags, and they are replaced by the ones found in our page file.

To help you better understand how page elements work, here is an example of a single, childless page element:

```json
{
	"qw_template": "sample",
	"title": "Lorem Ipsum 2",
	"text": "Sample text 2"
}
```

You can add however many elements you wish to display on your page, as elements of the **"qw_pagedata"** array, or as elements of **"qw_children"** array in a given element. Keep in mind, that your template will need to have a **[[qw_children]]** tag placed in it for child objects to be rendered.

> 📙 **IMPORTANT NOTE:**<br>
Some keys have special meaning! See reference below.

| KEY           | FUNCTION                                                         |
|---------------|------------------------------------------------------------------|
| "qw_pagedata" | has to be an array, contains all page elements inside            |
| "qw_template" | identifies a template to be used by a specific page element      |
| "qw_children" | has to be an array, contains all child elements of given element |
| "qw_*"        | keys beginning with 'qw_' are reserved for future functionality  |

### Step 2: Running the build
By this point you should have everything you need to get started with your very first Quikweb site. We will now proceed to run our first build. For everything to work out as intended make sure your directory structure matches the one provided below:

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
    ->	[src/samplepack/]
        ...
```

If everything is in order navigate to the ['/src'](/src) directory, and run:

> node quikweb-render.js tutorialpack.json tutorialpage.json

After the build finishes, you will be notified about the output file that has been created. By default all output files are stored in **'/src/render'**. This is the output that you should expect when opening the **'index.html'** file in your browser of choice:<br>

<img src=/img/tutorial_output.png style="width: 100%; height: auto; margin: 0 auto;"></img>

### Step 3: Exploring
Feel free to play around with the files you have just created. Try adding more elements of the same type to the page, creating new templates and placing new elements on the site using them. If you feel adventurous you can even try changing the HTML output template to really get the hang of using the framework. 

> 📙 **IMPORTANT NOTE:**<br>
Remember to re-run the build everytime you make any changes, as they will not show up otherwise!

## Included templates and examples
You can find a full, included webpage ['src/samplepage.json'](src/samplepage.json) and a corresponding template pack ['src/samplepack.json'](src/samplepack.json). Run the build, observe the output, and browse the included files to learn more. You can also contact me if you wish to ask any questions. The **'samplepack'** template package can be freely used for evaluation purposes.

**Happy web development!**

## Roadmap for the future
- better handling of file paths
- referencing template packs in page data files
- automatic page resource (imagery/fonts) collection
- support for multiple template packs
- export of a global CSS sheet for a website
- JavaScript embedding and integration with HTML id's
- a better tutorial describing more advanced usage
- publication of Quikweb as an npm package
- web interface for easier usage
- more included templates
