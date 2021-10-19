const inf = '[Quikweb]';
let contentStorage = new Array();
let templateStorage = new Array();
let templateCache = {type: 'NULL'};
//file retriever and request caller
async function loadPage(pageDatabase, templateRepository) {
	//prepare and send http requests
	const data_req = new Request(pageDatabase);
	const temp_req = new Request(templateRepository);
	const data_res = await fetch(data_req, {cache: "no-cache"});
	const temp_res = await fetch(temp_req, {cache: "no-cache"});
	let pageData, templateRepo;
	if(data_res.ok) {
		//attempt fetching and storing page content
		pageData = await data_res.json();
		storeContent(pageData);
	}
	else {
		console.log(`${inf} Error loading content database!`);
		return;
	}
	//try loading template repository
	if(temp_res.ok) 
		templateRepo = await temp_res.json();
	else 
		console.log(`${inf} Error loading template repository: ${templateRepository}`);
	//try fetching and loading templates
	for(let i = 0; i < templateRepo.pageTemplates.length; i++) {
		let html_req = new Request(templateRepo.pageTemplates[i].src);
		let html_res = await fetch(html_req, {cache: "no-cache"});
		let html = await html_res.text();
		let html_id = templateRepo.pageTemplates[i].id;
		if(html_res.ok) 
			storeTemplate(html, html_id);
		else
			console.log(`${inf} Error fetching template: ${html_id}`);
	}
	//hopefully everything is loaded, proceed to rendering
	displayPageContent();
}
//page object cache controller
function storeContent(cnt) {
	//extract JSON page objects and store
	let data = cnt.pageContents;
	for(let i = 0; i < data.length; i++){
		contentStorage.push(data[i]);
	}
}
//HTML template cache controller
function storeTemplate(tmp, type_id) {
	//create a template object and store it
	let templateObject = {type: type_id, template: tmp};
	templateStorage.push(templateObject);
}
//template rendering engine
function renderObject(data) {
	//try loading template
	if(findTemplate(data.template)) return Object.entries(data);
	//find formatted quikweb expressions and replace them
	let renderedObject = templateCache.template.replace(/\[\[(\w+)\]\]/g, (hit, keyMatch) => {
		//recursively render object children
		if(keyMatch === "children") {
			//check if current object even has children
			if('children' in data && data.children.length) {
				//iterate rendering all the children
				let renderedChildren = new String();
				for(let i = 0; i < data.children.length; i++) {
					renderedChildren += renderObject(data.children[i]);
				}
				return renderedChildren;
			}
			//if no children just remove the tag
			else return '';
		}
		//check for key presence, if not present remove tag
		if(`${keyMatch}` in data) return data[keyMatch];
		else return '';
	});
	return renderedObject;
}
function findTemplate(templateId) {
	//optimise for consecutive objects of the same type
	if(templateCache.type === templateId)
		return 0;
	else {
		//search for the right template if cached one is different
		for(let i = 0; i < templateStorage.length; i++) {
			if(templateStorage[i].type === templateId) {
				templateCache = templateStorage[i];
				return 0;	
			}
		}
	}
	//return empty template object and notify
	console.log(`${inf} No template found for: ${templateId}`);
	return 1;
}
//page rendering function
function displayPageContent() {
	document.getElementById("root").innerHTML = contentStorage.map(
	renderObject
	).join('');
}
