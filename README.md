<img src="docs/res/banner.svg" style="width: 100%; height: auto; border-radius: 2%;"></img>
### Uncomplicated, JSON based web page framework and renderer.

## Rationale
This project is meant to help in quick website creation and design with very little initial
configuration. This tool also helps in managing your page components and styling in an
organized manner.

## Features
* template substitution engine
* recursive element rendering
* inline style generator
* in-dev hot-swap global styling

## Prerequisites
- an installation of node.js
- good knowledge of JSON format
- familiarity with HTML and CSS

## Installation
You can install the Quikweb stable package from `main` branch using npm:
```console
npm install arthur-sebastian/quikweb
```

Otherwise, you can also get the nightly version from the `devel` branch by:
```console
npm install arthur-sebastian/quikweb#devel
```

> 📙 **OPTIONAL EXAMPLES:**<br>
To get started with your project quicker, you can also install `quikweb-new-project` package to help
set up an example project that is ready to edit:

```console
npm install arthur-sebastian/quikweb-new-project
```

## Quick start

In order to build a web page using a source file, execute the following command in the root
directory of your project:

```console
npx quikweb <components-dir> <page-source>
```

| PARAMETER      | DESCRIPTION                |
|----------------|----------------------------|
| components-dir | component directory path   |
| page-source    | page source JSON file path |

A directory named `render` containing your rendered `index.html` file will be created in the project
root as a result.

## Tutorial

To learn how to use Quikweb, following the [tutorial](/docs/TUTORIAL.md) is recommended. It contains
many examples and useful notes on particular topics.

## Roadmap

- better handling of file paths
- automated resource bundling
- support for JavaScript enabled components
- improved tutorial
- web app builder

**Happy web development!**
