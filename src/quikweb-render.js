const fs = require("fs");
const args = process.argv;

/*
	Configuration
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
	}

	validateRepoObject(object) {
		return !(
			("id" in object) &&
			("html" in object)
		);
	}
	
	importTemplates(repo) {
		//load template repository
		let file = new File(repo);
		let jsonContent = file.json();		
		if(jsonContent === 1) {
			return 1;
		}
		//check for basic repo validity
		if(!("qw_templates" in jsonContent)) {
			console.log(
			`Repository '${repo}' could not be loaded:\n` +
			"Repository does not contain a 'qw_templates' array."
			);
			return 2;
		}
		//cache complete templates for usage
		for(const template of jsonContent.qw_templates) {
			//validate template object
			if(this.validateRepoObject(template)) {
				console.log(
				"Warning: A template is missing crucial tags, skipping."
				);
				continue;
			}
			//cache main html template
			file.path = template.html;
			let html = file.read();
			if(html === 1) {
				continue;
			}
			this.templates.store({
				id: template.id,
				content: html
			});
			//cache associated css stylesheets
			if(!("css" in template)) {
				continue;
			}
			file.path = template.css;
			let css = file.read();
			if(css === 1) {
				continue;
			}
			this.stylesheets.store({
				id: template.id,
				content: css
			});
		}
		
		console.log(this.templates);
		console.log(this.stylesheets);
	}
	
}

/*
	Main code
*/
let worker = new Builder();
worker.importTemplates(args[2]);


let data = new Cache();
data.store({
	id: 0,
	content: 'HELLO'
});
data.store({
	id: 1,
	content: 'WORLD'
});
console.log(data.content);
