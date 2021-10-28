# Quikweb
## Dynamic page builder and templating engine all-in-one solution!

The following paragraphs describe the setup and usage of Quikweb.

### Introduction to Quikweb and its file system:
Quikweb uses two types of JSON databases for its purposes:
- page content database;
- page template repository;

The former describes contextual page elements (or blocks) of which your web
page is constructed, giving them their content and pointing to HTML templates
which should be used to build a given block.

The latter is a collection of JSON objects pointing at actual HTML template
files, and giving the given template an identifier.

Quikweb's algorithm is simple: if a block points at a template of a given
identifier, and this identifier is found in template repository, the page
block is constructed using this template.

### Preparing page templates:
1) create a new HTML file
2) write your HTML 'div' as usual to represent a block on a page
3) to indicate where Quikweb should insert block data, surround _tag name_
   with double, square brackets like so: [[_tag name_]]. The engine will
   fill this spot with respective data pulled from the JSON key for any block
   using this template (see: 'Preparing the Page Content Database' and 'Preparing
   the Page Template Repository')
4) IMPORTANT NOTE: Some tag names have special meaning!
   - 'template': this block key will indicate a template identifier, and inserting
     it into the template will result in it being replaced by block template name.
   - 'children': this tag will be replaced with nested page blocks. Attempting
     to use this key in block database to hold text will result in a JavaScript exception.

### Preparing the Page Template Repository:
1) start your JSON file with an array named: 'pageTemplates'
2) fill the array with objects containing 2 keys each:
   - 'type': defining template identifier
   - 'src': providing a path to HTML template file
3) add as many template references as you need
4) provide the JSON file path to import all the templates into a given HTML web page!

### Preparing the Page Content Database:
1) start your JSON file with an array named: 'pageContents'
2) fill the array with block objects naming their keys:
   - 'template': defining which template (by identifier from template repository) 
     to use for this page block
   - (optional) 'children': any number of nested block objects to be rendered in 
     place of [[children]] tag in the template
   - '_tag name_': content of this key will replace [[_tag name_]] tag in the template
     file assigned. These content keys can be defined as an array of strings, to hold e.g. big paragraphs.
3) add as many nested, or regularly inserted objects to appear on your page!

### Preparing your HTML document:
1) include 'quikweb-x.x.x.js' script in your html document
2) add 'onload="buildPage(a,b);"' to your page 'body' tag
3) replace 'a' with an array of/or path(s) to page content databases
4) replace 'b' with an array of/or path(s) to page template repositories
5) add a div of class 'root' to the body element to hold dynamic content
6) provided that you have followed all the steps correctly, your page should
   be dynamically loaded by the Quikweb engine.
