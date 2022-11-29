# Quikweb Docs

### Welcome to the usage tutorial!

This section of the documentation will walk you through creating your first project from scratch using Quikweb. You will be up and running within a couple of hours - provided that you already know how to write JSON files. HTML and CSS knowledge is also recommended, however not required when using pre-made templates.

## Preparation

Before we begin creating our web page, let us quickly create a home for page components. Navigate to the root of your project, and make a new directory named `components` (or any way you like - this tutorial however, will use the name given here).

## Creating components

Create a new file inside `components` directory. Let us call it `sample.html`:
```
project
|	 node_modules
└── components
	 |	 sample.html
```

Next, open the file in your favourite text editor of choice, and paste the following in:
```html
<div class="sample">
[[title]]
<div class="sample__box">
[[text]]
[[contents]]
</div></div>
```

As you can see this template has certain **[[tags]]** inside. This is a div element with a **[[title]]** and a nested div inside that has some **[[text]]**. Notice the **[[contents]]** tag. It will allow us to nest more elements inside of this one later on.

The general notion is: **[[tags]]** will be replaced by content, and can basically be arbitrary (with a few exceptions following from JSON file format and Quikweb limitations). Page content file will define what those tags will be replaced with. Tag names within a component need to be unique, unless you want the same content in multiple spots.

> 📙 **IMPORTANT NOTE:**<br>
Some tags have special meaning! See reference below.

| TAG             | FUNCTION                                                        |
|-----------------|-----------------------------------------------------------------|
| [[qw_template]] | identifies a template, cannot be used for user content          |
| [[qw_*]]        | tags beginning with 'qw_' are reserved for future functionality |

## Styling components
 
Create a new file inside `components` directory. Call it `sample.css`:
```
project
|	 node_modules
└── components
	 |  sample.css 
	 |	sample.html
```

Paste the following into the file:
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

In order to style a particular component, its CSS sheet needs to be named the same as its HTML counterpart - in this case `sample`. Other than that, style sheets need not obey any special formatting, and will work just fine with any content. Keep in mind that you can only have one style sheet per component - every `@import` statement will require you to include the file by its external hosting URL or by manual copy after building. Using `@import` directives is therefore not recommended for simplicity.

## Special components

_This section of the tutorial can be safely skipped._

Quikweb uses certain component names for special functionality. The Render Engine contains several inbuilt components used for different purposes - they can all be overridden by the user simply by including a specially named component inside the component directory. See reference below:

| COMPONENT   | FUNCTION                               |
|-------------|----------------------------------------|
| qw_html     | HTML document template                 |
| qw_htmlinfo | notice at the end of rendered document |
| tag         | generic HTML tag                       |
| tag_void    | empty HTML tag                         |

### Overriding main document template

`qw_html` component has to contain those content tags inside its HTML implementation:

| TAG          | FUNCTION                                       |
|--------------|------------------------------------------------|
| [[qw_meta]]  | will be replaced by document meta values       |
| [[qw_style]] | will be replaced by an embedded CSS stylesheet |
| [[qw_body]]  | will be replaced by the webpage content        |

> 📙 **IMPORTANT NOTE:**<br>
[[qw_meta]] special tag is not yet implemented.

Here is an example of a valid, overridden `qw_html` component:
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	[[qw_meta]]
	[[qw_style]]
</head>
<body id="top">
	[[qw_body]]
</body>
</html>
```

### Overriding document notice

By default, an HTML comment containing a notice about Quikweb's usage is appended to the end of the document. Its inbuilt component `qw_htmlinfo` looks like this:
```html
<!--Built using Quikweb-->
<!--https://github.com/arthur-sebastian/quikweb-->
```

It can be overridden with any other HTML comment, for example:
```html
<!--My overridden notice!-->
```

> ⚠️ **WARNING:**<br>
Make sure this override only contains HTML comments. Placing anything else outside the closing `</html>` tag is not a good practice.

### Tag and void tag components

These two components are simple HTML tags with no attributes:
```html
<!-- tag -->
<[[tag]]>
	[[content]]
</[[tag]]>

<!-- tag_void -->
<[[tag]]>
```

They can be used anywhere on the page as simple stand-ins for elements like `<div>` or `<img>`, provided that the appropriate attributes are added as JSON keys in an element which uses these.

It is unnecessary to override these components, hence the recommendation to leave them as they are.

## Creating a site

Now, to bring everything together. Create a new JSON file in the root of your project named `page.json`:
```
project
|	 node_modules
└── components
	 |  sample.css 
	 |	sample.html
	 page.json
```

Paste the following into the file:
```json
{
	"qw_page": [
	{
		"qw_template": "sample",
		"title": "Lorem Ipsum",
		"text": "Sample text",
		"contents": [
		{
			"qw_template": "sample",
			"text": "another sample text of child element"
		}
		]
	}
	]
}
```

This webpage will consist of a main **'sample'** type element with the title **'lorem ipsum'** and a text saying **'sample text'.** The main element also has a nested element of the same type, but this time it has no title, and the text is different. Remember the **[[tags]]** placed inside the **'sample.html'** file? The JSON keys presented here correspond to those tags, and they will be replaced by the ones found in our page file.

To help you better understand how page elements work, here is an example of a lone page element, taken from the code above:
```json
{
	"qw_template": "sample",
	"text": "another sample text of child element"
}
```

You can add however many elements you wish to display on your page as elements of the **'qw_page'** array.

If you want to display an element within another element you can assign it as a value to a given key:
```json
{
	"qw_template": "sample",
	"text": "another sample text of child element"
	"contents": 
	{
		"qw_template": "sample",
		"text": "embedded element!"	
	}
}
```

Or if you fancy displaying multiple nested elements one after another, you could even do:
```json
{
	"qw_template": "sample",
	"text": "another sample text of child element"
	"contents": [
		{
			"qw_template": "sample",
			"text": "embedded element!"	
		},
		{
			"qw_template": "sample",
			"text": "second embedded element!"	
		}
	]
}
```

The Render Engine draws everything recursively, so there is no additionally imposed limit on how many levels of nested elements can be rendered.

> 📙 **IMPORTANT NOTE:**<br>
Some keys have special meaning! See reference below.

| KEY           | FUNCTION                                                         |
|---------------|------------------------------------------------------------------|
| qw_page | has to be an array, contains all page elements inside            |
| qw_template | identifies a component to be used by a specific page element      |
| qw_*        | keys beginning with 'qw_' are reserved for future functionality  |

## Building
By this point you should have everything you need to get started with your very first Quikweb site. We will now proceed to run our first build. For everything to work out as intended make sure your directory structure matches the one provided below:
```
project
|	 page.json
|	 node_modules
└── components
	 |  sample.css 
	 |	sample.html
```

If everything is in order, navigate to the root directory of the project and execute:
```console
npx quikweb components/ page.json
```

Quikweb Renderer will output a full build log with any potential warnings and debug information, along with a success message pointing you to the output file. Navigate to the `render` directory, and open `index.html` in your web browser of choice. You should expect the following view:

<img src=/docs/res/tutorial_output.png style="width: 100%; height: auto; margin: 0 auto;"></img>

## Exploring

Feel free to play around with the files you have just created. Try adding more elements of the same type to the page, creating new components and placing new elements on the site using them. If you feel adventurous you can even try changing the HTML document component to really get the hang of using the framework. 

> 📙 **IMPORTANT NOTE:**<br>
Remember to re-run the build every time you make any changes, as they will not show up otherwise!

## Happy web development!

I hope you are willing to give the framework a try, and create something great with it. Feel free to file issues on Github if any arise. They will be addressed relatively quickly, as the project remains in active development.