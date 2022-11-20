const Cache = require("./qw-cache.js");

const qwHtml =
`<!DOCTYPE html>
<html lang='en'>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		[[qw_meta]]
		[[qw_style]]
	</head>
	<body>
		[[qw_body]]
	</body>
</html>`;

const qwTag =
`<[[tag]]>
	[[content]]
</[[tag]]>`;

const qwTagVoid =
`<[[tag]]>`;

const qwInfo =
`<!--Built using Quikweb-->
<!--https://github.com/arthur-sebastian/quikweb-->`;

module.exports = {
	components: [
		{
			id: "qw_html",
			content: qwHtml
		},
		{
			id: "qw_htmlinfo",
			content: qwInfo
		},
		{
			id: "tag",
			content: qwTag
		},
		{
			id: "tag_void",
			content: qwTagVoid
		}
	],
	styles : [
	]
};
