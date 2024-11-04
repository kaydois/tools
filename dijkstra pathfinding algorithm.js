function heuristic(a, b) {
    return Math.hypot(b.y - a.y, b.x - a.x);
}

class Tachyon {
    constructor(x, y, f, g, h) {
        this.x = x;
        this.y = y;
        this.f = f;
        this.g = g;

        this.wall = Math.random() < 0.4;
        this.neighbours = [];
        this.parent;
    }

    addNeighbours() {
        const originalX = this.x, originalY = this.y;
        if(originalX < columns - 1) this.neighbours.push(grid[originalX + 1] && grid[originalX + 1][originalY]);
        if(originalX > 0) this.neighbours.push(grid[originalX - 1] && grid[originalX - 1][originalY]);
        if(originalY < rows - 1) this.neighbours.push(grid[originalX] && grid[originalX][originalY + 1]);
        if(originalY > 0) this.neighbours.push(grid[originalX] && grid[originalX][originalY - 1]);
        if(originalX > 0 && originalY > 0) this.neighbours.push(grid[originalX - 1] && grid[originalX - 1][originalY - 1]);
        if(originalX < columns - 1 && originalY > 0) this.neighbours.push(grid[originalX + 1] && grid[originalX + 1][originalY - 1]);
        if(originalX > 0 && originalY < rows - 1) this.neighbours.push(grid[originalX - 1] && grid[originalX - 1][originalY + 1]);
        if(originalX < columns - 1 && originalY < rows - 1) this.neighbours.push(grid[originalX + 1] && grid[originalX + 1][originalY + 1]);
    }
}

let grid = new Array(50);
let columns = rows = 50;

class Pathfinder {
    constructor(start, end) {
        this.start = start;
        this.end = end;

        this.path = [];
        this.unvisitedNodes = [];
        this.visitedNodes = new Set();
    }

    findPath() {
        // create 2d space in grid array
        for(let i = 0; i < columns; i++) {
            grid[i] = new Array(rows);
        };

        //determine cost, etc of each node
        for(let x = 0; x < columns; x++) {
            for(let y = 0; y < rows; y++) {
                grid[x][y] = new Tachyon(x, y, 0, Infinity);
            }
        };

        for(let x = 0; x < columns; x++) {
            for(let y = 0; y < rows; y++) {
                grid[x][y].addNeighbours();
            }
        };

        this.unvisitedNodes = grid.flat();

        grid[this.start.x][this.start.y].g = 0;

        while(this.unvisitedNodes.length > 0) {
            let currentNode = this.unvisitedNodes.sort((a, b) => {
                return a.g - b.g;
            })[0];

            if (currentNode === this.end) {
                this.path.push(currentNode);
                let node = currentNode;
                while (node.parent) {
                    this.path.push(node.parent);
                    node = node.parent;
                }
                return this.path.reverse();
            }

            this.unvisitedNodes.splice(this.unvisitedNodes.indexOf(currentNode), 1);

            for(let i = currentNode.neighbours.length - 1; i >= 0; i--) {
                let neighbour = currentNode.neighbours[i];

                if(neighbour.wall || this.visitedNodes.has(neighbour)) continue;

                let newDist = currentNode.g + (neighbour.x !== currentNode.x && neighbour.y !== currentNode.y ? Math.SQRT2 : 1);
                if(newDist < neighbour.g) {
                    neighbour.g = newDist;
                    neighbour.parent = currentNode;
                }
            }
        }
        
        return [];
    }
}