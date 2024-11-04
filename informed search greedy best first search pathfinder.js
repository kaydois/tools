function heuristic(a, b) {
    const dx = Math.abs(b.x - a.x);
    const dy = Math.abs(b.y - a.y);
    return dx > dy ? 14 * dy + 10 * (dx - dy) : 14 * dx + 10 * (dy - dx);
}


var grid = new Array(50);
let columns = rows = 50;

class Tachyon {
    constructor(x, y, f, g, h) {
        this.x = x;
        this.y = y;
        this.h = h;

        this.parent;
        this.neighbours = [];
    }

    addNeighbours() {
        var originalX = this.x, originalY = this.y;

        if(originalX < columns - 1) this.neighbours.push(grid[originalX + 1][originalY]);
        if(originalX > 0) this.neighbours.push(grid[originalX - 1][originalY]);
        if(originalY < rows - 1) this.neighbours.push(grid[originalX][originalY + 1]);
        if(originalY > 0) this.neighbours.push(grid[originalX][originalY - 1]);

        if(originalX > 0 && originalY > 0) this.neighbours.push(grid[originalX - 1][originalY - 1]);
        if(originalX < columns - 1 && originalY > 0) this.neighbours.push(grid[originalX + 1][originalY - 1]);
        if(originalX > 0 && originalY < rows - 1) this.neighbours.push(grid[originalX - 1][originalY + 1]);
        if(originalX < columns - 1 && originalY < rows - 1) this.neighbours.push(grid[originalX + 1][originalY + 1]);
    }
}

class Pathfinder {
    constructor(start, end) {
        this.start = start;
        this.end = end;

        this.unvisitedNodes = [start];
        this.visitedNodes = new Set();
        this.path = [];
    }

    findPath() {
        // create 2d space in grid array
        for(let i = 0; i < columns; i++) {
            grid[i] = new Array(rows);
        };

        //determine cost, etc of each node
        for(let x = 0; x < columns; x++) {
            for(let y = 0; y < rows; y++) {
                grid[x][y] = new Tachyon(x, y);
            }
        };

        for(let x = 0; x < columns; x++) {
            for(let y = 0; y < rows; y++) {
                grid[x][y].addNeighbours();
            }
        };

        if(!this.unvisitedNodes.length) return false;
        while(this.unvisitedNodes.length) {
            this.unvisitedNodes.sort((a, b) => {
                return a.h - b.h;
            });

            let currentNode = this.unvisitedNodes[0];

            //check if current node we are searching is neighbour
            if(currentNode == this.end) {
                //if yes then return path
                this.path.push(currentNode);

                while(currentNode.parent) {
                    this.path.push(currentNode.parent);
                    currentNode = currentNode.parent;
                }

                return this.path.reverse();
            } else {
                this.visitedNodes.push(currentNode);

                for(let i = currentNode.neighbours.length; i--; ) {
                    let neighbour = currentNode.neighbours[i];

                    if (this.visitedNodes.has(neighbour) || neighbour.wall) continue;

                    neighbour.h = heuristic(neighbour, this.end);
                    this.unvisitedNodes.push(neighbour);
                    neighbour.parent = currentNode;
                }
            }
        }
    }
}