#!/usr/bin/env node
"use strict";

const fs = require("fs");
const Cache = require("./modules/qw-cache.js");
const Builder = require("./modules/qw-builder.js");

const args = process.argv;

const qwVersion = "v0.6.0";
const qwUsage = `
Invalid parameters.
Usage:
	node quikweb-render.js <templatepack> <pagedata>
	<templatepack> - component pack directory
	<pagedata>     - page source data`;

const qwOutDir = "./render";
const qwOutFile = `${qwOutDir}/index.html`;


function finalizeBuild(result, worker)
{
	if (worker.infoCollector.length !== 0) {
		console.log("[BUILD]");
		for (const info of worker.infoCollector) {
			console.log(`\t${info}`);
		}
	}
	if (worker.warningCollector.length !== 0) {
		console.log("[WARNINGS]");
		for (const warning of worker.warningCollector) {
			console.log(`\t${warning}`);
		}
	}

	console.log("[FINALIZE]");
	if (result.error) {
		console.log(`\tBuild failed!\n\tCause: ${result.error}`);
	}
	else if (result.success) {
		console.log("\tBuild success!")
		console.log(`\tOutput written to '${qwOutFile}'`);
	}
}


console.log(`Quikweb Renderer ${qwVersion}`);
if(args.length < 4 || args.length > 5) {
	console.log(qwUsage);
	return;
}
console.log(`[INFO]\n\tStarting build of '${args[3]}'`);

try {
	fs.mkdirSync(qwOutDir);
}
catch(exc) {
	console.log(`\tFailed to create '${qwOutDir}' directory\n\t${exc}`);
}

let worker = new Builder();
let pageJson;

console.log(`[IMPORT]\n\tImporting components from '${args[2]}'`);
try {
	worker.importComponentDir(args[2]);
}
catch (exc) {
	finalizeBuild({ error: exc }, worker);
	return;
}

console.log(`\tReading webpage file '${args[3]}'`);
try {
	pageJson = JSON.parse(fs.readFileSync(args[3]));
}
catch (exc) {
	finalizeBuild({ error: exc }, worker);
	return;
}

if (Object.hasOwn(pageJson, "qw_page") === false || Array.isArray(pageJson.qw_page) === false) {
	finalizeBuild({ error: `Page data '${args[3]}' is not a valid page file` }, worker);
	return;
}

let bodyRender = new String();
for (const block of pageJson.qw_page) {
	try {
		bodyRender += worker.renderBlock(block);
	}
	catch (exc) {
		finalizeBuild({ error: exc }, worker);
		return;
	}
}


let baseStyle = worker.cssImports.fetch("qw_html");
if (!baseStyle.error) {
	worker.cssCollector.store(baseStyle);
}

let embeddedCSS = new String();
for (const sheet of worker.cssCollector.content) {
	let css = sheet.content;
	css = css.replace(/\n|\t/g, () => { return ""; });
	embeddedCSS += css;
}

let styleEmbed = worker.renderBlock({
	qw_template: "tag",
	tag: "style",
	content: embeddedCSS
})
let pageRender = worker.renderBlock({
	qw_template: "qw_html",
	qw_style: styleEmbed,
	qw_body: bodyRender
});
pageRender += worker.renderBlock({
	qw_template: "qw_htmlinfo"
});

try {
	fs.writeFileSync(qwOutFile, pageRender);
}
catch (exc) {
	finalizeBuild({ error: exc }, worker);
	return;
}

finalizeBuild({ success: true }, worker);
