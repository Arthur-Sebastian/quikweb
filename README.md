# Quikweb
<img src=/img/banner_repo.svg style="width: 100%; height: auto;"></img>
## Simple, JSON-based website rendering framework

The following paragraphs describe the setup and usage of Quikweb.

### Introduction to Quikweb
Quikweb uses two types of JSON files for its purposes:
- page content;
- template repository;

The former describes page elements or blocks along with the content
they should be displaying.

The latter is a manifest describing all the available page blocks,
and referencing the files required to build them.

## Usage

### Running the framework

Dependencies:
- Node.js

Quikweb is written to be run using Node.js. You can find the rendering
script in the ['/src'](/src) directory.<br>
To run it, simply execute:
> node quikweb-render.js templates pagedata

Where:
- templates: path to a template repository
- pagedata:  path to JSON page content file

### Quickstart guide

1) run Quikweb using the supplied examples found in ['/src'](/src)
   - use 'testpack.json' as the template repository
   - use 'samplepage.json' as the page content
2) find the rendered result inside ['/render'](/src/render) directory.
3) create a new page data JSON file, and create it using the guide below or using 'samplepage.json' as a template.
4) render your page with provided template pack 

## Creating custom content

### Preparing page templates:
1) create a new HTML file
2) write the markup describing a page element to be templated
3) use keywords surrounded with double, square brackets to place
content markers, like so: [[tagname]]. Placing a field of the same
name in the page content JSON file will result in the tag being
replaced by the field content.

IMPORTANT NOTE:<br> 
Some tag names have special meaning!
   - 'template': this tag name is reserved for template identification. Placing it
     in your templates will result in them being replaced by the template identifier.
   - 'children': this tag will be replaced with nested page blocks. Attempting
     to use this key in block database to hold text will result in a warning, and the
     content in question will not be rendered.
   - tags beginning with 'qw_': may be used for internal needs in the future. To
     avoid potential problems, avoid using such names.

### Preparing the template repository:
1) start your JSON file with an array named: 'qw_templates'.
2) fill the array with objects containing at least 2 keys:
   - 'id': defining template identifier
   - 'html': path to HTML template file
   - 'css': [optional] path to CSS sheet implementing the template
3) add as many template references as desired
4) use the file path in commandline parameters when rendering

IMPORTANT NOTE:<br>
'qw_html_base' is a special template used to define the main HTML document outline.
HTML implementation should contain exactly two tags:
- '[[style]]': will be replaced by an embedded CSS stylesheet
- '[[body]]': will be replaced by the webpage content

### Preparing the page content:
1) start your JSON file with an array named: 'qw_pagedata'
2) fill the array with block objects naming their keys:
   - 'template': defining which template (by identifier from template repository) 
     to use for this page block
   - 'children' [optional]: any number of nested block objects to be consicutively 
     rendered in place of [[children]] tag in the template
   - '_tag name_': content of this key will replace [[_tag name_]] tag in the template
     file assigned. These content keys can be defined as an array of strings, to hold e.g. big paragraphs.
3) add as many nested, or regularly inserted objects to appear on your page!
