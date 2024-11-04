/*
    todo
        fix the nextNode logic (for movement related things)
        make more efficient (garbage rn)
*/

let workercode = `
// quadtree implementation for separation of nodes (for faster computation time)
class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (point.x >= this.x && point.x <= this.x + this.w && point.y >= this.y && point.y <= this.y + this.h);
    }
}

/*
    todo list
        implement a way to extract an item from tree
        implement a way to extract AND remove an item from tree
        implement a way to clear the nodes in a quadrant

*/

class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity || 4;
        this.points = [];
        this.subdivided = false;
    }

    insert(point) {
        if (!this.boundary.contains(point)) return;
        if (this.points.length < this.capacity) {
            this.points.push(point);
        } else {
            if (!this.subdivided) {
                this.subdivide();
            }

            this.northeast.insert(point);
            this.northwest.insert(point);
            this.southeast.insert(point);
            this.southwest.insert(point);
        }
    }

    subdivide() {
        const { x, y, w, h } = this.boundary;
        let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.capacity);

        this.subdivided = true;
    }
}

/*
let size = new Rectangle(0, 0, 200, 200);
let quad = new QuadTree(size, 4);

for (let i = 0; i < 10; i++) {
    let point = new Node(Math.random() * 200, Math.random() * 200);
    quad.insert(point);
}*/

class Tachyon {
    constructor(x, y, f, g, h) {
        this.x = x;
        this.y = y;

        this.f = f;
        this.g = g;
        this.h = h;

        this.neighbours = [];
        this.parent;

        this.occupied = false;
    }

    addNeighbours(grid, columns, rows, spaceBetweenNodes) {
        const originalX = Math.abs(this.x / spaceBetweenNodes);
        const originalY = Math.abs(this.y / spaceBetweenNodes);

        if (originalX < columns - 1) this.neighbours.push(grid[originalX + 1][originalY]);
        if (originalX > 0) this.neighbours.push(grid[originalX - 1][originalY]);
        if (originalY < rows - 1) this.neighbours.push(grid[originalX][originalY + 1]);
        if (originalY > 0) this.neighbours.push(grid[originalX][originalY - 1]);
        if (originalX > 0 && originalY > 0) this.neighbours.push(grid[originalX - 1][originalY - 1]);
        if (originalX < columns - 1 && originalY > 0) this.neighbours.push(grid[originalX + 1][originalY - 1]);
        if (originalX > 0 && originalY < rows - 1) this.neighbours.push(grid[originalX - 1][originalY + 1]);
        if (originalX < columns - 1 && originalY < rows - 1) this.neighbours.push(grid[originalX + 1][originalY + 1]);
    }
}

class Manager {
    constructor(width, height, nodes) {
        this.width = width;
        this.height = height;
        this.nodesCapacity = nodes;

        this.currentPath = [];
        this.lastPath = [];

        //wynds efficient hypot (not accurate, but *good* enough)
        this.dist = (a, b) => {
            const c = Math.SQRT2-1;
            a = Math.abs(a);
            b = Math.abs(b);
            if(a > b){
                let temp = a;
                a = b;
                b = temp;
            }
            return (c * a) + b;
        }

        this.numberOfNodes = this.width / this.nodesCapacity;

        let rect = new Rectangle(0, 0, 14400, 14400);
        this.quad = new QuadTree(rect, 4);

        this.target = null;
        this.speed = 500 / 9;
    }

    setSpeed(speed) {
        if (typeof speed !== "number") throw new TypeError("Pathfinder speed cannot be a non-number!");
        this.speed = speed;
    }

    addObstacle(obstacle, space) {
        if (typeof obstacle !== "object") throw new TypeError("Obstacle must be an object-type!");

        const { x, y, scale } = obstacle;
        let sx = Math.floor((x - scale) / space),
            sy = Math.floor((y - scale) / space),
            ex = Math.floor((x + scale) / space),
            ey = Math.floor((y + scale) / space);

        for (let i = sx; i <= ex; i++) {
            for (let j = sy; j <= ey; j++) {
                if (i >= 0 && i < this.grid.length && j >= 0 && j < this.grid[i].length) {
                    this.grid[i][j].occupied = true;
                    this.quad.insert(new Node(i, j));
                }
            }
        }
    }

    getPath(me, x, y) {
        if(typeof x != "number" || typeof y != "number" || typeof me != "object") throw new TypeError("Incorrect parameters set for method findPath on class Manager.");

        this.findPath(me, x, y);
    }

    getDir(a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }

    getNextNodeToMoveTo(me, hat, tail) {
        const ms = 500 / 9;

        if (pathfinder.path.length < 2) {
            return null;
        }

        let currentNode = pathfinder.path[0];
        let nextNode = pathfinder.path[1];

        let dir = Math.atan2(nextNode.y - currentNode.y, nextNode.x - currentNode.x);

        let newPos = {
            x: me.x + ms * Math.cos(dir),
            y: me.y + ms * Math.sin(dir)
        };

        let target = this.grid[Math.floor(newPos.x / 15)][Math.floor(newPos.y / 15)];

        let closest = pathfinder.path.sort((a, b) => {
            return pathfinder.heuristic(target, b) - pathfinder.heuristic(target, a);
        })[0];

        console.log(pathfinder.path);

        return {
            x: closest.x,
            y: closest.y
        };
    }

    clearCurrentPath() {
        //force a recalculation of the path (in some senarios)
        this.currentPath = [];
    }

    clearPath() {
        //just clear path entirely
        this.currentPath = this.lastPath = [];
    }
}

class Pathfinder extends Manager {
    constructor(width, height, spaceBetweenNodes) {
        super();
        this.width = width;
        this.height = height;
        this.spaceBetweenNodes = spaceBetweenNodes;

        this.grid = new Array(this.height);
        this.start = null;
        this.end = null;
        this.path = [];

        this.heuristic = (a, b) => {
            return Math.hypot(b.y - a.y, b.x - a.x);
        };

        console.log(this.width, this.height, spaceBetweenNodes);

        // prepare grid for finding
        const columns = Math.floor(this.width / spaceBetweenNodes);
        const rows = Math.floor(this.height / spaceBetweenNodes);

        this.grid = new Array(columns);
        for (let i = 0; i < columns; i++) {
            this.grid[i] = new Array(rows);
        }

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.grid[x][y] = new Tachyon(x * spaceBetweenNodes, y * spaceBetweenNodes, 0, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            }
        }

        // assign each node its neighbors
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.grid[x][y].addNeighbours(this.grid, columns, rows, spaceBetweenNodes);
            }
        }
    }

    findPath(me, x, y) {
        this.start = this.grid[Math.floor(me.x / this.spaceBetweenNodes)][Math.floor(me.y / this.spaceBetweenNodes)];
        this.end = this.grid[Math.floor(x / this.spaceBetweenNodes)][Math.floor(y / this.spaceBetweenNodes)];

        let unvisitedNodes = [];
        let visitedNodes = new Set();

        this.start.g = 0;
        this.start.h = this.heuristic(this.start, this.end);
        this.start.f = this.start.g + this.start.h;
        unvisitedNodes.push(this.start);

        while (unvisitedNodes.length) {
            let lowestIndex = unvisitedNodes.reduce((lowestIdx, node, idx) => {
                return node.f < unvisitedNodes[lowestIdx].f ? idx : lowestIdx;
            }, 0);

            let currentNode = unvisitedNodes[lowestIndex];
            if (currentNode === this.end) {
                this.path = [];
                let temp = currentNode;

                while (temp?.parent) {
                    this.path.push(temp);
                    temp = temp.parent;
                }

                this.path.reverse();
                return this.path;
            }

            unvisitedNodes.splice(lowestIndex, 1);
            visitedNodes.add(currentNode);

            for (let neighbour of currentNode.neighbours) {
                if (visitedNodes.has(neighbour) || neighbour.occupied) continue

                let tempG = currentNode.g + (neighbour.x !== currentNode.x && neighbour.y !== currentNode.y ? Math.SQRT2 : 1);
                let foundBetterPath = false;

                if (unvisitedNodes.includes(neighbour)) {
                    if (tempG < neighbour.g) {
                        neighbour.g = tempG;
                        foundBetterPath = true;
                    }
                } else {
                    neighbour.g = tempG;
                    neighbour.h = this.heuristic(neighbour, this.end);
                    neighbour.f = neighbour.g + neighbour.h;
                    neighbour.parent = currentNode;
                    unvisitedNodes.push(neighbour);
                    foundBetterPath = true;
                }

                if (foundBetterPath) {
                    neighbour.parent = currentNode;
                }
            }
        }

        return this.path || [];
    }
}

function removeProperty(obj, propToRemove) {
    if (Array.isArray(obj)) {
        return obj.map(item => removeProperty(item, propToRemove));
    } else if (obj && typeof obj === 'object') {
        const newObj = { ...obj };
        delete newObj[propToRemove];
        for (const key in newObj) {
            newObj[key] = removeProperty(newObj[key], propToRemove);
        }
        return newObj;
    }
    return obj;
}

//what the fuck happened here...
var pathfinder, path, cleanedPath;
self.onmessage = (e) => {
    switch (e.data[0]) {
        case "initialize":
            pathfinder = new Pathfinder(14400, 14400, 15);
            console.error(pathfinder);
            break;
        case "addBuilding":
            pathfinder.addObstacle(e.data[1], pathfinder.spaceBetweenNodes);
            break;
        case "getPath":
            path = pathfinder.findPath(e.data[1].me, e.data[1].x, e.data[1].y);
            cleanedPath = removeProperty(path, 'neighbours');
            path = JSON.stringify(cleanedPath);
            postMessage(["path", path]);
            break;
        case "getNextNodeToMoveTo":
            postMessage(["getNextNodeToMoveTo", pathfinder.getNextNodeToMoveTo(e.data[1].me, e.data[1].hatMult, e.data[1].tailMult, e.data[1].moveDir)]);
            break;
        default:
            break;
    }
};
`;

class Path {
    constructor() {
        this.blob = new Blob([workercode], { type: "application/javascript" });
        this.url = URL.createObjectURL(this.blob);
        this.worker = new Worker(this.url);
        URL.revokeObjectURL(this.url);
        this.path = [];
        this.worker.onmessage = (e) => {
            switch (e.data[0]) {
                case "path":
                    this.path = JSON.parse(e.data[1]);

                    break;
                case "getNextNodeToMoveTo":
                    this.getNextNodeToMoveTo = e.data[1];

                    break;
                default:
                    throw new Error(e.data[0], e.data[1]);
            }
        }
    }

    postMessage(action, data) {
        this.worker.postMessage(action, data);
    }

    initialize() {
        this.postMessage(["initialize", { width: 14400, height: 14400, spaceBetweenNodes: 40 }]);
    }

    addBuilding(tmpObj) {
        this.postMessage(["addBuilding", tmpObj]);
    }

    getPath(player, x, y) {
        this.postMessage(["getPath", { me: player, x: x, y: y }]);
    }

    findGetNextNodeToMoveTo(player, hat, tail, dir) {
        hat = Jh.find((hat) => hat.id == hat)?.spdMult || 1;
        tail = Qh.find((tail) => tail.id == tail)?.spdMult || 1;

        player = {
            x: player.x2,
            y: player.y2
        }

        this.postMessage(["getNextNodeToMoveTo", { me: player, hat: hat, tail: tail, moveDir: dir }]);
    }

    updatePlayers() {

    }
}

window.Path = new Path();
window.Path.initialize();