window.showNetworkMap = () => {
	const data = {
		nodes: [
			{ id: 1, label: "Node 1" },
			{ id: 2, label: "Node 2" },
			{ id: 3, label: "Node 3" },
			{ id: 4, label: "Node 4" },
			{ id: 5, label: "Node 5" },
			{ id: 11, label: "Node 11" },
			{ id: 12, label: "Node 12" },
			{ id: 13, label: "Node 13" },
			{ id: 14, label: "Node 14" },
			{ id: 15, label: "Node 15" },
		],
		edges: [
			{ source: 1, target: 5 },
			{ source: 3, target: 4 },
			{ source: 3, target: 5 },
			{ source: 3, target: 13 },
			{ source: 11, target: 12 },
			{ source: 15, target: 14 },
			{ source: 14, target: 13 },
			{ source: 12, target: 5 },
		],
	};

	// Read the JSON data
	Promise.resolve(data).then(data => {
		// ========================================
		// Data manipulations
		// ========================================

		// // Filter links with low occurrence to avoid freezing the browser
		// data.edges = data.edges.filter(link => link.cooccurrence > 5);

		// // Remove nodes with no connections
		var nodes_with_links = new Set();
		data.edges.forEach(link => {
			nodes_with_links.add(link.source);
			nodes_with_links.add(link.target);
		});
		// data.nodes = data.nodes.filter(node => nodes_with_links.has(node.id));

		// Index nodes and connections by id to speed up lookups
		var nodes_are_linked = {},
			nodes_by_id = {};
		data.edges.forEach(link => {
			nodes_are_linked[`${link.source}-${link.target}`] = true;
			nodes_are_linked[`${link.target}-${link.source}`] = true;
		});
		data.nodes.forEach(node => {
			nodes_are_linked[`${node.id}-${node.id}`] = true;
			nodes_by_id[node.id] = node;
		});

		// Detect clusters
		var clusters = new Set();
		data.edges.forEach(link => {
			var added_to = [];
			clusters.forEach(cluster => {
				if (cluster.has(link.source) || cluster.has(link.target)) {
					cluster.add(link.source);
					cluster.add(link.target);
					added_to.push(cluster);
				}
			});
			if (added_to.length == 0) {
				clusters.add(new Set([link.source, link.target]));
			} else if (added_to.length > 1) {
				var merged = new Set();
				added_to.forEach(cluster => {
					cluster.forEach(node_id => merged.add(node_id));
					clusters.delete(cluster);
				});
				clusters.add(merged);
			}
		});
		clusters = Array.from(clusters);

		// Index clusters by node id
		var clusters_by_id = {};
		clusters.forEach(cluster =>
			cluster.forEach(node_id => (clusters_by_id[node_id] = cluster)),
		);

		// ========================================
		// SVG manipulations
		// ========================================

		// Define colors
		var background_color = "white",
			unconnected_color = "red",
			connected_color = "darkgreen",
			link_color = "#696969";

		// Define scale functions
		var freqs = d3.extent(data.nodes, node => node.frequency),
			// coocs = d3.extent(data.edges, link => link.cooccurrence),
			node_radius = d3
				.scaleLinear()
				.domain(freqs)
				.range([3, 20]);
		// node_color = d3
		// 	.scaleLinear()
		// 	.domain(freqs)
		// 	.range([min_values_color, max_values_color]),
		// link_color = d3
		// 	.scaleLinear()
		// 	.domain(coocs)
		// 	.range([min_values_color, max_values_color]),
		// link_size = d3
		// 	.scaleLinear()
		// 	.domain(coocs)
		// 	.range([5, 15]);

		var width = 800,
			height = 600;

		// Define the parent SVG
		var svg = d3
			.select("#map")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.style("background-color", background_color)
			.append("g")
			.attr("transform", `translate(${width / 2}, ${height / 2})`);

		// Define the links
		var links = svg
			.selectAll(".link")
			.data(data.edges)
			.enter()
			.append("path")
			.attr("class", "link")
			.style("fill", "none")
			.style("stroke", link_color)
			.style("stroke-width", 8);

		// Define the nodes
		var nodes = svg
			.selectAll(".node")
			.data(data.nodes)
			.enter()
			.append("circle")
			.attr("class", "node")
			.attr("r", 10)
			.style("fill", d =>
				nodes_with_links.has(d.id)
					? connected_color
					: unconnected_color,
			);
		// .style("stroke", d => d3.color(node_color(d.frequency)).darker())
		// .style("stroke-width", 0.5)
		// .on("mouseover", mouseover_node)
		// .on("mouseout", mouseout_node)
		// .on("click", click_node);

		// Define the node labels (shown on mouseover/click)
		var texts = svg
			.selectAll("text")
			.data(data.nodes)
			.enter()
			.append("text")
			.attr("pointer-events", "none")
			.attr("alignment-baseline", "middle")
			.style("font-family", "Tahoma")
			.style("font-size", "20")
			.style("fill", "black")
			.text(d => d.label);

		// Start the force simulation
		var simulation = d3
			.forceSimulation(data.nodes)
			.force("center", d3.forceCenter())
			.force("charge", d3.forceManyBody().strength(-10))
			.force("collision", d3.forceCollide().radius(20))
			.force("radial", d3.forceRadial(200))
			.on("tick", tick);

		// ========================================
		// Functions
		// ========================================

		function tick() {
			texts
				.attr("text-anchor", d => (d.x < 0 ? "end" : "start"))
				.attr("transform", rotate_text);

			nodes.attr("cx", d => d.x).attr("cy", d => d.y);

			links.attr("d", link_path);
		}

		// function mouseover_node(d_node) {
		// 	links
		// 		.style("stroke", d_link =>
		// 			link_is_connected(d_node, d_link)
		// 				? link_color(d_link.cooccurrence)
		// 				: fade_out_color,
		// 		)
		// 		.filter(d_link => link_is_connected(d_node, d_link))
		// 		.raise();

		// 	nodes
		// 		.style("fill", d_other_node =>
		// 			node_is_connected(d_node, d_other_node)
		// 				? node_color(d_other_node.frequency)
		// 				: fade_out_color,
		// 		)
		// 		.style("stroke", d_other_node =>
		// 			node_is_connected(d_node, d_other_node)
		// 				? d3.color(node_color(d_other_node.frequency)).darker()
		// 				: fade_out_color,
		// 		)
		// 		.filter(d_other_node => node_is_connected(d_node, d_other_node))
		// 		.raise();

		// 	// texts
		// 	// 	.attr("visibility", d_other_node =>
		// 	// 		node_is_connected(d_node, d_other_node)
		// 	// 			? "visible"
		// 	// 			: "hidden",
		// 	// 	)
		// 	// 	.filter(d_other_node => node_in_cluster(d_node, d_other_node))
		// 	// 	.raise();
		// }

		// function mouseout_node() {
		// 	links.style("stroke", d_link => link_color(d_link.cooccurrence));

		// 	nodes
		// 		.style("fill", d_node => node_color(d_node.frequency))
		// 		.style("stroke", d_node =>
		// 			d3.color(node_color(d_node.frequency)).darker(),
		// 		);

		// 	// texts.attr("visibility", "hidden");
		// }

		// function click_node(d_node) {
		// 	links
		// 		.style("stroke", d_link =>
		// 			link_in_cluster(d_node, d_link)
		// 				? link_color(d_link.cooccurrence)
		// 				: fade_out_color,
		// 		)
		// 		.filter(d_link => link_in_cluster(d_node, d_link))
		// 		.raise();

		// 	nodes
		// 		.style("fill", d_other_node =>
		// 			node_in_cluster(d_node, d_other_node)
		// 				? node_color(d_other_node.frequency)
		// 				: fade_out_color,
		// 		)
		// 		.style("stroke", d_other_node =>
		// 			node_in_cluster(d_node, d_other_node)
		// 				? d3.color(node_color(d_other_node.frequency)).darker()
		// 				: fade_out_color,
		// 		)
		// 		.filter(d_other_node => node_in_cluster(d_node, d_other_node))
		// 		.raise();

		// 	// texts
		// 	// 	.attr("visibility", d_other_node =>
		// 	// 		node_in_cluster(d_node, d_other_node)
		// 	// 			? "visible"
		// 	// 			: "hidden",
		// 	// 	)
		// 	// 	.filter(d_other_node => node_in_cluster(d_node, d_other_node))
		// 	// 	.raise();
		// }

		function rotate_text(d_node) {
			var alpha = Math.atan2(-d_node.y, d_node.x),
				distance = node_radius(d_node.frequency) + 10,
				x = d_node.x + Math.cos(alpha) * distance,
				y = d_node.y - Math.sin(alpha) * distance,
				to_degrees = angle => (angle * 180) / Math.PI,
				rotation =
					d_node.x < 0
						? 180 - to_degrees(alpha)
						: 360 - to_degrees(alpha);
			return `translate(${x}, ${y})rotate(${rotation})`;
		}

		function link_path(d_link) {
			var source = nodes_by_id[d_link.source],
				target = nodes_by_id[d_link.target],
				p = d3.path();
			p.moveTo(source.x, source.y);
			p.quadraticCurveTo(0, 0, target.x, target.y);
			return p.toString();
		}

		function link_is_connected(node_data, link_data) {
			return (
				node_data.id === link_data.source ||
				node_data.id === link_data.target
			);
		}

		function node_is_connected(node_data, other_node_data) {
			return nodes_are_linked[`${node_data.id}-${other_node_data.id}`];
		}

		function link_in_cluster(node_data, link_data) {
			var cluster = clusters_by_id[node_data.id];
			return (
				cluster.has(link_data.source) || cluster.has(link_data.target)
			);
		}

		function node_in_cluster(node_data, other_node_data) {
			var cluster = clusters_by_id[node_data.id];
			return cluster.has(other_node_data.id);
		}
	});
};
