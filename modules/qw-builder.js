const fs = require("fs");
const Cache = require("./qw-cache.js");
const Inbuilts = require("./qw-inbuilts.js");

const qwTagRegex = /\[\[(\w+)\]\]/g;


function importFile(path, id, type)
{
	let content;
	try {
		content = fs.readFileSync(path, "utf8");
	}
	catch (exc) {
		throw exc;
	}

	let item = {
		id: id,
		content: content
	}
	if (type === "html" || type === "htm") {
		this.htmlImports.store(item);
	}
	else if (type === "css") {
		this.cssImports.store(item);
	}
	else {
		throw "UnknownFileType";
	}
}


function importComponentDir(directory)
{
	directory = directory.replace(/\/$/g, () => { return ""; })
	let fileList;
	try {
		fileList = fs.readdirSync(directory);
	}
	catch (exc) {
		throw exc;
	}

	for (const file of fileList) {
		let path = `${directory}/${file}`;
		if (fs.lstatSync(path).isDirectory()) {
			continue;
		}
		let name = file.replace(/\.[^.]*$/g, "");
		let type = file.match(/[^.]*$/g)[0];
		try {
			this.importFile(path, name, type);
		}
		catch (exc) {
			throw exc;
		}
	}
}


function renderBlock(block)
{
	if (typeof block === "string") {
		return block;
	}

	if (typeof block !== "object" || Object.hasOwn(block, "qw_template") === false) {
		throw "UndefinedComponent";
	}

	let componentType = block.qw_template;
	let template = this.htmlImports.fetch(componentType);
	if (template.error) {
		template = Inbuilts.components.find(component => component.id === componentType);
		if (template === undefined) {
			this.warningCollector.push(`Undefined component '${componentType}' - skipping`);
			return "";
		}
		else {
			this.warningCollector.push(`Using inbuild component '${componentType}'`);
		}
	}

	let render = template.content;
	render = render.replace(/\t/g, () => { return ""; })
	render = render.replace(qwTagRegex, (w, qwTag) => {
		if (qwTag.startsWith("qw_")) {
			this.warningCollector.push(`Found special tag '${qwTag}' in component '${componentType}'`);
		}
		/* recursive rendering */
		if (qwTag in block) {
			let tag = new String();
			if (Array.isArray(block[qwTag])) {
				for (const child of block[qwTag]) {
					tag += this.renderBlock(child);
				}
				return tag;
			}
			else {
				return this.renderBlock(block[qwTag]);
			}
		}
		return "";
	});

	let css = this.cssImports.fetch(template.id);
	if (css !== undefined) {
		this.cssCollector.store(css);
	}
	else {
		this.warningCollector.push(`Component '${componentType}' does not import CSS`);
	}

	this.infoCollector.push(`Rendered component '${componentType}' successfully`);
	return render;
}


module.exports = function ()
{
	this.htmlImports = new Cache();
	this.cssImports = new Cache();
	this.cssCollector = new Cache();

	this.warningCollector = new Array();
	this.infoCollector = new Array();

	this.importFile = importFile;
	this.importComponentDir = importComponentDir;
	this.renderBlock = renderBlock;
}
