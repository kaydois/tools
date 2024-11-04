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

        this.occupied = (Math.random() < 0.1 ? true : false);
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
    }}

class Manager {
    constructor(width, height, nodes) {
        this.width = width;
        this.height = height;
        this.nodesCapacity = nodes;

        this.currentPath = [];
        this.lastPath = [];

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

    addObstacle(obstacle) {
        if(typeof obstacle != "object") throw new TypeError("Obstacle must be an object-type!");
        //this.quad.insert(obstacle);

        const { x, y, width, height, scale } = obstacle;
        let sx = Math.floor(x / this.nodesCapacity),
            sy = Math.floor(y / this.nodesCapacity),
            ex = Math.floor((x + width) / this.nodesCapacity),
            ey = Math.floor((y + height) / this.nodesCapacity);

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
        if(typeof x != "number" || typeof y != "number" || typeof me != "object") throw new TypeError(`Incorrect parameters set for method "findPath" on class "Manager".`);

        this.findPath(me, x, y);
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

        this.heuristic = function(a, b) {
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

        console.log(this.width, this.height, spaceBetweenNodes);

        // repare grid for finding
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
        //before u do stuff make sure to round x/ys to nearest node
        console.log(this.grid);

        this.start = this.grid[Math.floor(me.x / this.spaceBetweenNodes)][Math.floor(me.y / this.spaceBetweenNodes)]; //double check this
        this.end = this.grid[Math.floor(x / this.spaceBetweenNodes)][Math.floor(y / this.spaceBetweenNodes)];

        let unvisitedNodes = [], visitedNodes = [];

        unvisitedNodes.push(this.start);

        while(unvisitedNodes.length) {
            //find node with lowest f score
            let lowest = unvisitedNodes.sort((a, b) => {
                return a.f - b.f;
            })[0];

            let currentNode = lowest; //unvisitedNodes[lowest]; //cus the closest is obv the one ur at

            if(lowest == this.end) {
                this.path = [];
                this.path.push(currentNode);

                var temp = currentNode;
                while(temp?.parent) {
                    this.path.push(temp.parent);
                    temp = temp.parent;
                }

                this.path.reverse();

                return this.path;
            }

            unvisitedNodes.splice(unvisitedNodes.indexOf(currentNode), 1);
            visitedNodes.push(currentNode);

            for(let i = 0; i < currentNode.neighbours.length; i++) {
                let neighbour = currentNode.neighbours[i];

                if (visitedNodes.includes(neighbour) || neighbour.occupied) continue;

                let tempG = currentNode.g + (neighbour.x !== currentNode.x && neighbour.y !== currentNode.y ? Math.SQRT2 : 1);
                let foundBetterPath = false;

                if(unvisitedNodes.includes(neighbour)) {
                    //if its a shorter route
                    if(tempG > neighbour.g) {
                        neighbour.g = tempG;
                        foundBetterPath = true;
                    }
                } else {
                    neighbour.g = tempG;
                    foundBetterPath = true;
                    unvisitedNodes.push(neighbour);
                }

                if(foundBetterPath) {
                    neighbour.h = this.heuristic(neighbour, this.end);
                    neighbour.f = neighbour.g + neighbour.h;
                    neighbour.parent = currentNode;
                }
            }
        }
    }
}

/*
    idea
        use quadtree to split up the map into "chunks"
        pathfinder will only use the nearby chunks when taking into consideration path generation
        path generation will be done once on call (and will be reevaluated when a further path is determined)
        this pathfinder manager will NOT support any angle pathfinding

        instead of having like 5 separate pathfinder instances running, just make one that can alternate (difference in each pathfinder is like +- 1 line)

        supported pathfinder implementations:
            for now i can do a star

*/

/*
    suggested ideas
        use tensorflow AI model to train an ai to determine a path that will consistently be shorter then generated path (as the path generated might have a completely different "vison" then what the next generation might have)

*/

window.pf = new Pathfinder(14400, 14400, 40);