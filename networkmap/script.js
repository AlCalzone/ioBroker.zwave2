// chart dimensions
const body = document.body;
const width = body.clientWidth;
const height = body.clientHeight;
const radius = Math.min(width, height) / 2;
const nodeRadius = 20;

const words = [
	"terrify",
    "box",
    "question",
    "unique",
    "succeed",
    "glossy",
    "stereotyped",
    "scorch",
    "finicky",
    "children",
    "hum",
    "female",
    "nice",
    "cooperative",
    "furry",
    "quickest",
    "voyage",
    "borrow",
    "hobbies",
    "cause",
    "watch",
    "paltry",
    "talented",
    "pot",
    "love",
    "innocent",
    "furtive",
    "egg",
    "stingy",
    "appreciate",
    "frail",
    "apologise",
    "mellow",
    "support",
    "real",
    "chunky",
    "tangy",
    "fill",
    "giant",
    "rhetorical",
    "damaging",
    "maniacal",
    "humdrum",
    "tart",
    "fat",
    "goofy",
    "size",
    "decorate",
    "safe",
    "thinkable",
]

const numNodes = 35;
const nodesWithLinks = new Set();
const data = {
    nodes: [],
    links: []
};

// Generate sample data
data.nodes.push({ id: 1, fx: 0, fy: 0 });
for (let id = 2; id <= numNodes; id++) {
    data.nodes.push({ id });
}
for (const node of data.nodes) {
	node.name = words[Math.floor(Math.random() * words.length)];
}
for (let i = 1; i < 5; i++) {
    const target = Math.ceil(Math.random() * numNodes);
    data.links.push({ source: 1, target });
}
for (let i = 2; i < 20; i++) {
    const source = Math.ceil(Math.random() * numNodes);
    const target = Math.ceil(Math.random() * numNodes);
    data.links.push({ source, target });
}
// Detect disconnected nodes
for (const link of data.links) {
    nodesWithLinks.add(link.source);
    nodesWithLinks.add(link.target);
}
// Detect distance from controller
function detectDistanceFromController(nodeId, base = 0) {
    const nodeNeighbors = data.links
        .filter(l => l.source === nodeId || l.target == nodeId)
        .map(l => (l.source === nodeId ? l.target : l.source))
        .map(id => data.nodes.find(n => n.id === id));
    const recurse = [];
    for (const neighbor of nodeNeighbors) {
        if (neighbor.distance == undefined) {
            neighbor.distance = base + 1;
            recurse.push(neighbor);
        }
    }
    for (const neighbor of recurse) {
        detectDistanceFromController(neighbor.id, base + 1);
    }
}
data.nodes.find(n => n.id === 1).distance = 0;
detectDistanceFromController(1, 0);
for (const node of data.nodes) {
    if (typeof node.distance === "number") {
        console.log(`${node.id}: distance from ctrlr = ${node.distance}`);
    }
}

const attractScale = n => -0.007 * Math.min(n, 5);

// set up svg
var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(
        d3.zoom().on("zoom", function() {
            svg.attr("transform", d3.event.transform);
        })
    )
    .append("g");

const tooltip = d3
    .select("body")
    .append("div")
    .classed("tooltip", true);

var simulation = d3
    .forceSimulation()
    .force(
        "link",
        d3
            .forceLink()
            .id(d => d.id)
            .distance(0)
            .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-5))
    .force("center", d3.forceCenter())
    .force(
        "attract",
        d3
            .forceAttract()
            .strength(d =>
                d.id === 1
                    ? 1
                    : typeof d.distance === "number"
                    ? attractScale(d.distance)
                    : 0.1
            )
    )
    .force(
        "collision",
        d3
            .forceCollide()
            .radius(d =>
                typeof d.distance === "number"
                    ? nodeRadius * 2
                    : nodeRadius * 1.5
            )
    )
    .force(
        "circle",
        d3
            .forceRadial(radius)
            .strength(d => (typeof d.distance === "number" ? 0 : 0.5))
    );
// .force("circle", d3.forceRadial(radius*2, width/2, height/2))
Promise.resolve(data).then(graph => {
    var link = svg
        .selectAll(".link")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("class", "link");

    var node = svg
        .selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(
            d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
        )
        .on("mouseover", function(d) {
            const bbox = d3
                .select(this)
				.node()
                .getBoundingClientRect();
			tooltip
				.html(d.name)
                .style("transform", `translate(calc(${bbox.x + bbox.width/2}px - 50%), calc(${bbox.y}px - 100%))`)
                .classed("visible", true);
        })
        .on("mouseleave", d => {
            tooltip.classed("visible", false);
        });
    node.append("circle")
        .attr("r", nodeRadius)
        .attr("class", d =>
            d.id === 1
                ? "controller"
                : typeof d.distance === "number"
                ? "connected"
                : "disconnected"
        );

    node.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .text(d => d.id)
        .call(
            d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
        );

    // var label = svg
    // 	.append("g")
    // 	.attr("class", "labels")
    // 	.selectAll("text")
    // 	.data(graph.nodes)
    // 	.enter()
    // 	.append("text")
    // 	.style("font-family", "Arial")
    // 	.style("font-size", "20px")

    simulation.nodes(graph.nodes).on("tick", ticked);

    simulation.force("link").links(graph.links);

    function ticked() {
        //update link positions
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        // update node positions
        // note in this example we bound the positions
        node.attr("cx", function(d) {
            return (d.x = Math.max(
                -width / 2 + 2 * nodeRadius,
                Math.min(width / 2 - 2 * nodeRadius, d.x)
            ));
        })
            .attr("cy", function(d) {
                return (d.y = Math.max(
                    -height / 2 + 2 * nodeRadius,
                    Math.min(height / 2 - 2 * nodeRadius, d.y)
                ));
            })
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        // // update label positions
        // label
        // 	.attr("x", d => d.x)
        // 	.attr("y", d => d.y);
    }
});

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
