// Based on https://bl.ocks.org/JulienAssouline/2847e100ac7d4d3981b0f49111e185fe

const names = [
	"Devolo Home Control Metering Plug",
	"Intermatic Dimmer Switch",
	"Fibaro FGS 223",
	"MCO Home Wall Thermostat",
	"Aeon Labs Multisensor Gen 6"
];

const numNodes = 50;
const numLinks = 30;

// Generated with https://vis4.net/palettes
const colors = ['#0005a5', '#3c33b0', '#5957bb', '#7279c4', '#899ccb', '#a3bfd0', '#c3e2cf', '#ffffbb', '#ffb987', '#fc967c', '#f07674', '#de576d', '#c63c68', '#a62966', '#7d2367']

const matrix = new Array(numNodes).fill(0).map(() => new Array(numNodes).fill(0));

// Generate sample data
function addLink(from, to) {
	matrix[from - 1][to - 1] = matrix[to - 1][from - 1] = 1;
}
for (let i = 1; i < 5; i++) {
	const target = Math.ceil(Math.random() * numNodes);
	addLink(1, target);
}
for (let i = 0; i < numLinks; i++) {
	const source = Math.ceil(Math.random() * numNodes);
	const target = Math.ceil(Math.random() * numNodes);
	if (source !== target) addLink(source, target);
}
// Scale the flows for equal sized nodes
const sum = arr => arr.reduce((acc, cur) => acc + cur, 0);
const maxSum = Math.max(...matrix.map(sum));
const minSum = Math.min(...matrix.map(sum).filter(v => v > 0))

const disconnected = new Set();
for (let i = 0; i < matrix.length; i++) {
	const row = matrix[i];
	const rowSum = sum(row);
	if (rowSum === 0) {
		row[i] = 1 / maxSum;
		disconnected.add(i);
	}
	else {
		matrix[i] = row.map(val => val / maxSum);
	}
}
// Make Node 1 twice as large
const row0Sum = sum(matrix[0]);
matrix[0] = matrix[0].map(val => val * 2 / row0Sum);

// chart dimensions
const body = document.body;
const width = body.clientWidth;
const height = body.clientHeight;
const outerRadius = Math.min(width, height) * 0.5 - 200;
const innerRadius = outerRadius - 20;
const gap = 0.01;

// We rotate by one group so node 1 is at the top
// The first group has the double size, so we add one fake group in the calculation
const rotation = 360 / (matrix.length + 1) - gap / Math.PI * 180

const svg = d3
	.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("viewBox", [-width / 2, -height / 2, width, height])
	.append("g")
	.attr("transform", `rotate(-${rotation.toFixed(2)})`)
	;

const chord = d3
	.chord()
	.padAngle(gap)
	.sortChords(d3.ascending)
	// .sortGroups(d3.descending)
	.sortSubgroups(() => 1)(matrix);

var arcs = d3
	.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius);

var ribbon = d3.ribbon().radius(innerRadius);
const colorScale = d3
	.scaleOrdinal()
	.domain(d3.range(numNodes - 1))
	.range(d3.schemeSpectral[11])

// creating the fill gradient
function getGradID(d) {
	return "linkGrad-" + d.source.index + "-" + d.target.index;
}

var grads = svg
	.append("defs")
	.selectAll("linearGradient")
	.data(chord)
	.enter()
	.append("linearGradient")
	.attr("id", getGradID)
	.attr("gradientUnits", "userSpaceOnUse")
	.attr("x1", function (d, i) {
		return (
			innerRadius *
			Math.cos(
				(d.source.endAngle - d.source.startAngle) / 2 +
				d.source.startAngle -
				Math.PI / 2
			)
		);
	})
	.attr("y1", function (d, i) {
		return (
			innerRadius *
			Math.sin(
				(d.source.endAngle - d.source.startAngle) / 2 +
				d.source.startAngle -
				Math.PI / 2
			)
		);
	})
	.attr("x2", function (d, i) {
		return (
			innerRadius *
			Math.cos(
				(d.target.endAngle - d.target.startAngle) / 2 +
				d.target.startAngle -
				Math.PI / 2
			)
		);
	})
	.attr("y2", function (d, i) {
		return (
			innerRadius *
			Math.sin(
				(d.target.endAngle - d.target.startAngle) / 2 +
				d.target.startAngle -
				Math.PI / 2
			)
		);
	});

// set the starting color (at 0%)

grads
	.append("stop")
	.attr("offset", "0%")
	.attr("stop-color", d => colorScale(d.source.index));

//set the ending color (at 100%)
grads
	.append("stop")
	.attr("offset", "100%")
	.attr("stop-color", d => colorScale(d.target.index));

// add the groups on the inner part of the circle
const node = svg
	.selectAll("g")
	.data(chord.groups)
	.enter()
	.append("g")
	.attr("class", "node");

// Create the node arcs
node.append("path")
	.style("fill", d => colorScale(d.index))
	.attr("d", arcs);

// Create the labels
node.append("text")
	.each(d => d.angle = (d.startAngle + d.endAngle) / 2)
	// .attr("dy", "-0.25em")
	.attr("class", (d, i) => `node-id${disconnected.has(i) ? " disconnected": ""}`)
	.attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
	.attr("dominant-baseline", "middle")
	.attr("transform", d => {
		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
			+ "translate(" + (outerRadius + 10) + ")"
			+ (d.angle > Math.PI ? "rotate(180)" : "");
	})
	.text((d, i) => `Node ${i + 1}`);
//
// node.append("text")
// 	.each(d => d.angle = (d.startAngle + d.endAngle) / 2)
// 	.attr("dy", "0.6em")
// 	.attr("class", "node-name")
// 	.attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
// 	.attr("transform", d => {
// 		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
// 			+ "translate(" + (outerRadius + 10) + ")"
// 			+ (d.angle > Math.PI ? "rotate(180)" : "");
// 	})
// 	.text((d, i) => names[i % names.length]);

// Add the links between groups
svg.datum(chord)
	.append("g")
	.selectAll("path")
	.data(d => d.filter(c => c.source.index !== c.target.index && c.source.value > 0 && c.target.value > 0))
	.enter()
	.append("path")
	.attr("class", d => `chord chord-${d.source.index} chord-${d.target.index}`)
	.style("fill", d => `url(#${getGradID(d)})`)
	.attr("d", ribbon);