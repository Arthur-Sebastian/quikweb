function store(newElement)
{
	if (Object.hasOwn(newElement, "id") == false) {
		return {error: "InvalidObject"};
	}

	if(this.content.find(element => element.id === newElement.id)) {
		return {warning: "DuplicateObject"};
	}
	else {
		this.content.push(newElement);
	}
}


function fetch(id)
{
	let result = this.content.find(element => element.id === id);
	if (result === undefined) {
		return {error: "NotFound"};
	}
	else {
		return result;
	}
}


module.exports = function ()
{
	this.content = new Array();
	this.store = store;
	this.fetch = fetch;
}
