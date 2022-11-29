# Quikweb Docs

### Welcome to the Quikweb framework documentation!

_Table of contents:_

[0. Usage overview](#quick-overview)<br>
[1. Creating components](TUTORIAL.md#creating-components)<br>
[2. Styling components](TUTORIAL.md#styling-components)<br>
[3. Special components](TUTORIAL.md#special-components)<br>
[4. Creating a site](TUTORIAL.md#creating-a-site)<br>
[5. Building](TUTORIAL.md#building)<br>

## Usage overview

Working with Quikweb is very simple. It only requires *2* ingredients to work! In order to begin using the framework, we first need to create or download some web page components to build our page with. Next, we need to describe the page and its content by using the JSON syntax.

The components are created using a combination of HTML and CSS. All Quikweb components belonging to a given project are stored inside a single directory, and (almost) every one of them is composed of two files - `component.html` and `component.css`. 

The first file is a generic HTML markup as encountered in any web site, differing only by the presence of special substitution tags (see [creating components](TUTORIAL.md#creating-components)). CSS on the other hand has nothing special about it, and is not required for a component to be valid and usable (see [styling components](TUTORIAL.md#styling-components)).

Of course, some exceptions apply to component names, and some are reserved as a simple way to provide [important functionality](TUTORIAL.md#special-components).

Once we collect all our uniquely named components into this directory, its path is passed during the build process to the Quikweb Renderer. A web page source file is also required for the build as the second parameter (see [building](TUTORIAL.md#building)). This JSON format file references the components from component directory by their unique name. It also describes how to substitute the special tags inside component's HTML definition. More information can be found in the ['creating a site'](TUTORIAL.md#creating-a-site) section of the [tutorial](TUTORIAL.md).


