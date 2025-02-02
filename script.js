
class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = null;
        this.right = null; 
        this.left = null;
        this.bottom = null; 
        this.top = null;
        this.thickness = 2
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let nodeDistance = 20;
let nodes = [];
let thres = 0.6

colors = [
    "red", "blue", "green", "yellow", "purple", "cyan", "orange", "white",
    "magenta", "teal", "lime", "brown", "pink", "indigo", "violet",
    "maroon", "navy", "turquoise", "gold", "silver", "beige", "coral", "lavender",
];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateNodes();
}

function colorCluster(node, color) {
    let stack = [node];

    while (stack.length > 0) {
        let current = stack.pop();
        if (current.color == null) {
            current.color = color;
        }
        if (current.right != null && current.right.color == null) {
            current.right.color = color;
            stack.push(current.right);
        }
        if (current.left != null && current.left.color == null) {
            current.left.color = color;
            stack.push(current.left);
        }
        if (current.top != null && current.top.color == null) {
            current.top.color = color;
            stack.push(current.top);
        }
        if (current.bottom != null && current.bottom.color == null) {
            current.bottom.color = color;
            stack.push(current.bottom);
        }
    }
}

function hor_tie(left,right) {
    left.right = right;
    right.left = left;
}

function ver_tie(top,bottom) {
    top.bottom = bottom;
    bottom.top = top;
}

function set_pilo(nodes) {
    let sx = Math.floor(0.2*window.innerWidth/nodeDistance) 
    let sy = 1

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 14; x++) {
            ya = y + sy;
            xa = x + sx;
            let node = nodes[ya][xa]

            node.right = null;
            node.left = null;
            node.top = null;
            node.bottom = null;
            node.thickness = 3
        }
    }

    sx += 1
    sy += 1

    // P
    for (let a = 0;a<=5;a++){
        ver_tie(nodes[sy+a][sx], nodes[sy+a+1][sx])
    }

    hor_tie(nodes[sy][sx], nodes[sy][sx+1])
    hor_tie(nodes[sy][sx+1], nodes[sy][sx+2])
    hor_tie(nodes[sy][sx+2], nodes[sy][sx+3])

    hor_tie(nodes[sy+2][sx], nodes[sy+2][sx+1])
    hor_tie(nodes[sy+2][sx+1], nodes[sy+2][sx+2])
    hor_tie(nodes[sy+2][sx+2], nodes[sy+2][sx+3])

    ver_tie(nodes[sy][sx+3], nodes[sy+1][sx+3])
    ver_tie(nodes[sy+1][sx+3], nodes[sy+2][sx+3])

    // I
    for (let a = 0;a<=5;a++){
        ver_tie(nodes[sy+a][sx+4],nodes[sy+a+1][sx+4])
    }

    // L
    for (let a = 0;a<=5;a++){
        ver_tie(nodes[sy+a][sx+5], nodes[sy+a+1][sx+5])
    }
    hor_tie(nodes[sy+6][sx+5], nodes[sy+6][sx+6])
    hor_tie(nodes[sy+6][sx+6], nodes[sy+6][sx+7])
    hor_tie(nodes[sy+6][sx+7], nodes[sy+6][sx+8])

    // O
    for (let a = 0;a<=5;a++){
        ver_tie(nodes[sy+a][sx+9],nodes[sy+a+1][sx+9])
    }
    for (let a = 0;a<=5;a++){
        ver_tie(nodes[sy+a][sx+12], nodes[sy+a+1][sx+12])
    }
    hor_tie(nodes[sy][sx+9], nodes[sy][sx+10])
    hor_tie(nodes[sy][sx+10], nodes[sy][sx+11])
    hor_tie(nodes[sy][sx+11], nodes[sy][sx+12])

    hor_tie(nodes[sy+6][sx+9], nodes[sy+6][sx+10])
    hor_tie(nodes[sy+6][sx+10], nodes[sy+6][sx+11])
    hor_tie(nodes[sy+6][sx+11], nodes[sy+6][sx+12])
}


// Generate nodes in a 2D grid
function generateNodes() {
    nodes = [];
    let cols = Math.floor(canvas.width / nodeDistance) + 1;
    let rows = Math.floor(canvas.height / nodeDistance) + 1 ;

    for (let y = 0; y <= rows; y++) {
        nodes[y] = [];
        for (let x = 0; x <= cols; x++) {
            nodes[y][x] = new Node(x * nodeDistance, y * nodeDistance);
        }
    }

    for (let y = 0; y < nodes.length; y++) {
        for (let x = 0; x < nodes[y].length; x++) {
            if (Math.random()>thres && x < nodes[y].length - 1){
                if (nodes[y][x].right == null){
                    hor_tie(nodes[y][x], nodes[y][x+1])
                }
            } 
            if (Math.random()>thres && y < nodes.length - 1) {
                if (nodes[y][x].bottom == null){
                    ver_tie(nodes[y][x],nodes[y+1][x])
                }
            } 
        }
    }

    set_pilo(nodes)

    let color = 0
    for (let y = 0; y < nodes.length; y++) {
        for (let x = 0; x < nodes[y].length; x++) {
            if (nodes[y][x].color == null) {
                colorCluster(nodes[y][x], color);
                color++;
            }
            
        }
    }
}

function drawMatrix() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < nodes.length; y++) {
        for (let x = 0; x < nodes[y].length; x++) {
            let node = nodes[y][x];
            let color = node.color % colors.length

            ctx.strokeStyle = colors[color];
            ctx.fillStyle = colors[color];
            ctx.lineWidth = node.thickness;

            if (node.right) drawLine(node, node.right);
            if (node.bottom) drawLine(node, node.bottom);
            // drawNode(node);
        }
    }
}

function drawLine(node1, node2) {
    ctx.beginPath();
    ctx.moveTo(node1.x, node1.y);
    ctx.lineTo(node2.x, node2.y);
    ctx.stroke();
}

function drawNode(node) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
    ctx.fill();
}


window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawMatrix();
