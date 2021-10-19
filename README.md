# QuikWeb
## Dynamic page builder and templating engine all-in-one solution!

The following paragraphs describe the setup and usage of QuikWeb.

### Introduction to QuikWeb file system:
QuikWeb uses two types of JSON databases for its purposes:
- page content database;
- page template repository.
The former describes contextual page elements (or blocks) of which your web
page is constructed, giving them their content and pointing to HTML templates
which should be used to build a given block.
The latter is a collection of JSON objects pointing at actual HTML template
files, and giving the given template an identifier.
QuikWeb's algorithm is simple: if a block points at a template of a given
identifier, and this identifier is found in template repository, the page
block is constructed using this template.

### Preparing the Page Content Database:
1) start your JSON file with an array named: 'pageContents'
2) fill the array with block objects

### Preparing your HTML document:
1) include 'quikweb-x.x.x.js' script in your html document
2) add 'onload="buildPage(a,b);"' to your page 'body' tag
3) replace 'a' with an array of/or path(s) to page content databases
4) replace 'b' with an array of/or path(s) to page template repositories
5) add a div of class 'root' to the body element to hold dynamic content
