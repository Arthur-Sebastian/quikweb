const fs = require("fs");
const args = process.argv;

/*
	Configuration
*/
const version = "v0.5.0";
const outputdir = "./render";
const usageInfo = 
	"Invalid parameters.\n" +
	"Usage:\n\tnode quikweb-render.js templates pagedata\n" +
	"Where:\n\ttemplates - path to a template repository\n" +
	"\tpagedata  - path to JSON page data file";
const defaultDoc = 
	"<!DOCTYPE html>\n<html lang='en'>\n" +
	"<head>\n[[qw_style]]\n</head>\n" +
	"<body>\n[[qw_body]]\n</body>\n</html>";
const idKey = "qw_id";
const htmlKey = "html";
const cssKey = "css";
const templateKey = "qw_template";
const childrenKey = "qw_children";

/*
	Implementation
*/
class File {

	static pathudef = "File: Path is undefined.";
	
	constructor(path) {
		this.path = path;
	}
	
	read() {
		if(!this.path) {
			console.log(this.pathudef);
			return 1;
		}
		try {
			return fs.readFileSync(this.path, 'utf8');
		} catch (exc) {
			console.log(`File: Failed to read '${this.path}'.`);
			return 1;
		}
	}
	
	json() {
		let cnt = this.read();
		if(cnt === 1){
			return 1;
		}
		try {
			return JSON.parse(cnt);
		} catch (exc) {
			console.log(
			`File: Parsing '${this.path}' as JSON failed:\n${exc}`
			);
			return 1;
		}
	}
	
	write(content) {
		if(!this.path) {
			console.log(this.pathudef);
			return 1;
		}
		try {
			return fs.writeFileSync(this.path, content);
		} catch (exc) {
			console.log(`File: Failed to write '${this.path}'.`);
			return 1;
		}
	}
}

class Cache {

	constructor() {
		this.content = new Array();
	}
	
	clear() {
		this.content = new Array();
	}
	
	get empty() {
		return (this.content.length == 0);
	}
	
	store(object) {
		//not a cacheable object
		if(!("id" in object)) {
			return 2;
		}
		//search for duplicates
		for(const element of this.content) {
			if(element.id === object.id) {
				return 1;
			}
		}
		//object is unique, store
		this.content.push(object);
		return 0;
	}
	
	fetch(id) {
		//search for existent object
		for(const element of this.content) {
			if(element.id === id) {
				return element;
			}
		}
		return 1;
	}
	
}

class Builder {

	constructor() {
		this.templates = new Cache();
		this.stylesheets = new Cache();
		this.usedCSS = new Cache();
	}
	
	warn(what) {
		console.log("Warning: " + what);
	}
	
	info(what) {
		console.log("Info: " + what);
	}
	
	arraySum(array) {
		return array.reduce( (p, c) => {
			return p + c;
		});
	}

	validateTemplateObject(object) {
		return !(
			(typeof object === "object") &&
			(idKey in object) &&
			(htmlKey in object)
		);
	}
	
	validatePageBlock(block) {
		if(!(typeof block === "object")) {
			return 1;
		}
		return !(templateKey in block);
	}
	
	importTemplate(template) {
		//validate template object
		if(this.validateTemplateObject(template)) {
			this.warn(
			"A template has missing or invalid tags, skipping."
			);
			return 1;
		}
		//cache main html template
		let file = new File(template[htmlKey]);
		let html = file.read();
		if(html === 1) {
			return 2;
		}
		console.log(
		`Info: Importing template '${template[idKey]}'.`
		);
		this.templates.store({
			id: template[idKey],
			content: html
		});
		//cache associated css stylesheets
		if(!(cssKey in template)) {
			this.info(
			`Template '${template[idKey]}'` +
			"does not import a CSS stylesheet."
			);
			return 0;
		}
		file.path = template[cssKey];
		let css = file.read();
		if(css === 1) {
			return 2;
		}
		this.stylesheets.store({
			id: template[idKey],
			content: css
		});
	}
	
	importTemplateRepo(repo) {
		//load template repository
		let file = new File(repo);
		let jsonContent = file.json();		
		if(jsonContent === 1) {
			return 1;
		}
		//check for basic repo validity
		if(!("qw_templates" in jsonContent) || !Array.isArray(jsonContent.qw_templates)) {
			console.log(
			`Repository '${repo}' could not be loaded:\n` +
			"Repository does not contain a 'qw_templates' array."
			);
			return 2;
		}
		//cache complete templates for usage
		for(const template of jsonContent.qw_templates) {
			this.importTemplate(template);
		}
	}
	
	renderBlock(block) {
		//check if data is a valid object
		if(this.validatePageBlock(block)) {
			this.warn(
			"Page block has missing or invalid tags, skipping."
			);
			return "";
		}
		//find the given template
		let template = this.templates.fetch(block[templateKey]);
		if(template === 1) {
			this.warn(
			`Page block uses non-existent template '${block[templateKey]}', skipping.`
			);
			return "";
		}
		this.info(`Rendering block '${block[templateKey]}'.`);
		let render = template.content;
		render = render.replace(/\[\[(\w+)\]\]/g, (w, key) => {
			//recursive child rendering
			if((key === childrenKey) && (childrenKey in block)) {
				let children = new String();
				for(const child of block[childrenKey]) {
					children += this.renderBlock(child);
				}
				return children;
			}
			//other tags
			else if(key in block) {
				if(Array.isArray(block[key])) {
					return this.arraySum(block[key]);
				}
				return block[key];
			}
			return "";
		});
		//add css stylesheet to the global cache
		let css = this.stylesheets.fetch(template.id);
		if(css !== 1) {
			this.usedCSS.store(css);
		}
		return render;
	}
	
	renderPage(pagedata) {
		//load page data
		let file = new File(pagedata);
		let jsonContent = file.json();
		if(jsonContent === 1) {
			return "";
		}
		//check for basic pagedata validity
		if(!("qw_pagedata" in jsonContent) || !Array.isArray(jsonContent.qw_pagedata)) {
			console.log(
			`Page data '${pagedata}' could not be loaded:\n` +
			"Page data does not contain a 'qw_pagedata' array."
			);
			return "";
		}
		//start rendering every page block
		let bodyRender = new String();
		for(const block of jsonContent.qw_pagedata) {
			bodyRender += this.renderBlock(block);
		}
		//create embedded css stylesheet
		let embeddedCSS = new String('<style type="text/css">');
		let baseStyle = this.stylesheets.fetch("qw_html_base");
		if(baseStyle !== 1) {
			this.usedCSS.store(baseStyle);
		}
		for(const sheet of this.usedCSS.content) {
			let css = sheet.content;
			css = css.replace(/\n|\t/g, () => {
				return "";
			});
			embeddedCSS += css;
		}
		embeddedCSS += "</style>";
		//try finding the document template, if not found use default
		if(this.templates.fetch("qw_html_base") === 1) {
			this.templates.store({
				id: "qw_html_base",
				content: defaultDoc
			});
		}
		//insert all the elements into a document template
		let pageRender = this.renderBlock({
			qw_template: "qw_html_base",
			qw_style: embeddedCSS,
			qw_body: bodyRender
		});
		return pageRender + `<!-- Webpage generated using Quikweb ${version} -->`;
	}
	
}

/*
	Main code
*/
console.log(`Quikweb ${version}`);
if(args.length < 4) {
	console.log(usageInfo);
	return;
}
console.log(
`[CONFIG]\n\tTemplate pack: '${args[2]}'` +
`\n\tPage data:     '${args[3]}'`
);
console.log("[BUILD LOG]");
//filesystem stuff
try {
	fs.mkdirSync(outputdir);
} catch(exc) {
	console.log(
	`Failed to create '${outputdir}' directory:\n${exc}`
	);
}
//output phase
let worker = new Builder();
worker.importTemplateRepo(args[2]);
const outputfile = outputdir + "/index.html";
let output = new File(outputfile);
if(output.write(worker.renderPage(args[3])) === 1) {
	console.log("[OUTPUT]\n\tBuild failed!");
	return;
}
console.log(
"[OUTPUT]\n\tBuild succeeded!" +
`\n\tOutput written to: '${outputfile}'`
);
