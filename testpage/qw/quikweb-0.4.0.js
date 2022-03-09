let contentStorage = new Array();
let templateStorage = new Array();
let templateCache = {type: null};
//file retriever
async function getResource(resourceURL, resourceType) {
	//make a request, fetch it
	const resource_req = new Request(resourceURL);
	const resource_res = await fetch(resource_req, {cache: 'no-cache'});
	let resource_ret;
	if(!resource_res.ok) 
		return null;
	switch(resourceType) {
		case 'JSON':
			resource_ret = await resource_res.json();
			break;
		case 'TEXT':
			resource_ret = await resource_res.text();
			break;
		case 'BLOB':
			resource_ret = await resource_res.blob();
			break;
		default:
			return null;
	}
	return resource_ret;
}
//page loader and renderer
async function buildPage(pageDatabaseArg, templateRepositoriesArg) {
	//prepare for downloading and storing all the data
	let pageDatabases = new Array();
	let templateRepositories = new Array();
	//argument handler for arrays or singular strings
	if(Array.isArray(pageDatabaseArg))
		pageDatabases = pageDatabaseArg;
	else
		pageDatabases.push(pageDatabaseArg);
	if(Array.isArray(templateRepositoriesArg))
		templateRepositories = templateRepositoriesArg;
	else
		templateRepositories.push(templateRepositoriesArg);
	//load all page content databases and their content
	for(let i = 0, n = pageDatabases.length; i < n; i++) {
		const pageDatabaseDownload = await getResource(pageDatabases[i], 'JSON');
		if(pageDatabaseDownload !== null) {
			const pageObjects = pageDatabaseDownload.pageContents;
			//extract JSON page objects and store
			for(let i = 0, n = pageObjects.length; i < n; i++)
				contentStorage.push(pageObjects[i]);
		}
		//if page database download fails serve error screen
		else {
			templateStorage.push({
				type: 'errnotice',
				template:
				'<div style="text-align: center; margin: 5rem;">\n'
				+'<img src=[[image_url]]><h1>[[info]]</h1>\n</div>'
			});
			document.getElementById('root').innerHTML = 
			renderObject({
				template: 'errnotice', 
				info: 	'Requested page resource<br>'+
					'could not be loaded.',
				image_url: '/qw/res/404.svg'
			});
			return;
		}
	}
	//load all template repositories and their content
	let templateRepository = new Array();
	let styleSheetRepository = new Array();
	for(let i = 0, n = templateRepositories.length; i < n ; i++) {
		const templateRepoDownload = await getResource(templateRepositories[i], 'JSON');
		if(templateRepoDownload === null) continue;
		const templateReferences = templateRepoDownload.pageTemplates;
		//load every template reference from repository
		for(let i = 0, n = templateReferences.length; i < n ; i++) {
			const html = await getResource(templateReferences[i].src, 'TEXT');
			if(html === null) continue;
			//build a usable template object from JSON data and store it
			const templateObject = {
				type: templateReferences[i].id,
				template: html
			};
			//check for duplicates
			if(findTemplate(templateObject.type))
				templateStorage.push(templateObject);
			//read the css dependencies
			if(!'css' in templateReferences[i]) continue;
			//array of urls or single url
			let cssDependencies = templateReferences[i].css;
			if(Array.isArray(cssDependencies)) {
				for(const dependency of cssDependencies)
					if(!styleSheetRepository.includes(dependency)) styleSheetRepository.push(dependency);
			}
			else if(!styleSheetRepository.includes(cssDependencies))
				styleSheetRepository.push(cssDependencies);
		}
	}
	//concatenate stylesheets into one tag
	let compactedStylesheets = new String();
	for(const stylesheetURL of styleSheetRepository)
		compactedStylesheets += await getResource(stylesheetURL+`?${Math.random()}`, 'TEXT');
	//push the concatenated stylesheets into a tag
	document.getElementsByTagName('head')[0].innerHTML +=
	`<style type=\"text/css\">` +
	compactedStylesheets + '</style>';
	//fill the page with templated content
	document.getElementById('root').innerHTML = 
	contentStorage.map(renderObject).join('');
	//mark global arrays for GC 
	templateStorage = null;
	contentStorage = null;
	templateCache = null;
}
//template rendering engine
function renderObject(data) {
	//try loading template
	if(findTemplate(data.template)) return Object.entries(data);
	//find formatted quikweb expressions and replace them
	let renderedObject = templateCache.template.replace(/\[\[(\w+)\]\]/g, (hit, key) => {
		//recursively render object children
		if(key === 'children' && 'children' in data && data.children.length) {
			//iterate, rendering all the children
			let renderedChildren = new String();
			for(let i = 0, n = data.children.length; i < n; i++)
				renderedChildren += renderObject(data.children[i]);
			return renderedChildren;
			
		}
		//check for key presence, if not present remove tag
		else if(key in data) {
			//check for multiline data and concactenate
			if(Array.isArray(data[key])) {
				let multilineContent = new String();
				for(let i = 0, n = data[key].length; i < n; i++)
					multilineContent += (data[key])[i];
				return multilineContent;
			}
			//otherwise insert the whole key as text, idc >.<
			else return data[key];
		}
		else return '';
	});
	return renderedObject;
}
//template database search engine
function findTemplate(templateId) {
	//optimise for consecutive objects of the same type
	if(templateCache.type === templateId)
		return 0;
	else {
		//search for the right template if cached one is different
		for(let i = 0, n = templateStorage.length; i < n; i++) {
			if(templateStorage[i].type === templateId) {
				templateCache = templateStorage[i];
				return 0;
			}
		}
	}
	return 1;
}
