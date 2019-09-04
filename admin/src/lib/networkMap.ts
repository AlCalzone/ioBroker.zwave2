// Based on https://bl.ocks.org/JulienAssouline/2847e100ac7d4d3981b0f49111e185fe
import { ascending, range } from "d3-array";
import { chord as d3chord, ribbon } from "d3-chord";
import { scaleOrdinal } from "d3-scale";
import { schemeSpectral } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { arc } from "d3-shape";

export interface NodeInfo {
	id: number;
	name: string;
	neighbors: number[];
}

export function drawNetworkMap(selector: string, nodes: NodeInfo[]) {
	const matrix = new Array(nodes.length)
		.fill(0)
		.map(() => new Array(nodes.length).fill(0));
	function addLink(from, to) {
		matrix[from][to] = matrix[to][from] = 1;
	}

	// Maps the node ID to index in the matrix
	const nodeIndizes = new Map<number, number>();
	for (let i = 0; i < nodes.length; i++) {
		nodeIndizes.set(nodes[i].id, i);
	}

	for (const node of nodes) {
		for (const neighborId of node.neighbors) {
			addLink(nodeIndizes.get(node.id), nodeIndizes.get(neighborId));
		}
	}

	// Scale the flows for equal sized nodes
	const sum = arr => arr.reduce((acc, cur) => acc + cur, 0);
	const maxSum = Math.max(...matrix.map(sum));

	// Remember which nodes are not connected

	const disconnected = new Set<number>();
	for (let i = 0; i < matrix.length; i++) {
		const row = matrix[i];
		const rowSum = sum(row);
		if (rowSum === 0) {
			row[i] = 1 / maxSum;
			disconnected.add(nodes[i].id);
		} else {
			matrix[i] = row.map(val => val / maxSum);
		}
	}
	// Make Node 1 larger
	const node1Factor = 1.5;
	const row0Sum = sum(matrix[0]);
	matrix[0] = matrix[0].map(val => (val * node1Factor) / row0Sum);
	const matrixSum = sum(matrix.map(sum));
	// row0Sum = node1Factor

	// chart dimensions
	const width = 600;
	const height = 600;
	const outerRadius = Math.min(width, height) * 0.5 - 150;
	const innerRadius = outerRadius - 20;
	const gap = Math.min(0.15, Math.PI / 2 / nodes.length);

	// We rotate by one group so node 1 is at the top
	// The first group has the double size, so we add one fake group in the calculation
	const remainder = 2 * Math.PI - nodes.length * gap;
	const firstNodeRotation = 0.5 * remainder * (node1Factor / matrixSum);

	const svg = select(selector)
		.append("svg")
		// Responsive SVG needs these 2 attributes and no width and height attr.
		.attr("preserveAspectRatio", "xMidYMid meet")
		.attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
		.append("g")
		.attr(
			"transform",
			`rotate(-${(firstNodeRotation * (180 / Math.PI)).toFixed(2)})`,
		);

	const chord = d3chord()
		.padAngle(gap)
		.sortChords(ascending)
		.sortSubgroups(() => 1)(matrix);

	var arcs = arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);

	var ribbonGenerator = ribbon().radius(innerRadius);
	const colorScale = scaleOrdinal()
		// @ts-ignore This does work
		.domain(range(nodes.length - 1))
		.range(schemeSpectral[Math.max(3, Math.min(11, nodes.length))]);

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
		.attr("x1", function(d, i) {
			return (
				innerRadius *
				Math.cos(
					(d.source.endAngle - d.source.startAngle) / 2 +
						d.source.startAngle -
						Math.PI / 2,
				)
			);
		})
		.attr("y1", function(d, i) {
			return (
				innerRadius *
				Math.sin(
					(d.source.endAngle - d.source.startAngle) / 2 +
						d.source.startAngle -
						Math.PI / 2,
				)
			);
		})
		.attr("x2", function(d, i) {
			return (
				innerRadius *
				Math.cos(
					(d.target.endAngle - d.target.startAngle) / 2 +
						d.target.startAngle -
						Math.PI / 2,
				)
			);
		})
		.attr("y2", function(d, i) {
			return (
				innerRadius *
				Math.sin(
					(d.target.endAngle - d.target.startAngle) / 2 +
						d.target.startAngle -
						Math.PI / 2,
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
		.each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
		// .attr("dy", "-0.25em")
		.attr(
			"class",
			(d, i) => `node-id${disconnected.has(i) ? " disconnected" : ""}`,
		)
		.attr("text-anchor", d =>
			d.angle - firstNodeRotation > Math.PI ? "end" : null,
		)
		.attr("dominant-baseline", "middle")
		.attr("transform", d => {
			return (
				"rotate(" +
				((d.angle * 180) / Math.PI - 90) +
				")" +
				"translate(" +
				(outerRadius + 10) +
				")" +
				(d.angle - firstNodeRotation > Math.PI ? "rotate(180)" : "")
			);
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
		.data(d =>
			d.filter(
				c =>
					c.source.index !== c.target.index &&
					c.source.value > 0 &&
					c.target.value > 0,
			),
		)
		.enter()
		.append("path")
		.attr(
			"class",
			d => `chord chord-${d.source.index} chord-${d.target.index}`,
		)
		.style("fill", d => `url(#${getGradID(d)})`)
		.attr("d", ribbonGenerator);
}
