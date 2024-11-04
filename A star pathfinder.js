var columns = 5, rows = 5, unvisitedNodes = [], visitedNodes = [], startNode, endNode, path;

var grid = new Array(columns);

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

    addNeighbours() {
        const originalX = this.x, originalY = this.y;
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

function heuristic(a, b) {
    return Math.hypot(b.y - a.y, b.x - a.x);
}

function run(grid) {
    // create 2d space in grid array
    for(let i = 0; i < columns; i++) {
        grid[i] = new Array(rows);
    };

    //determine cost, etc of each node
    for(let x = 0; x < columns; x++) {
        for(let y = 0; y < rows; y++) {
            grid[x][y] = new Tachyon(x, y, 0, Infinity, Infinity);
        }
    };

    for(let x = 0; x < columns; x++) {
        for(let y = 0; y < rows; y++) {
            grid[x][y].addNeighbours();
        }
    };

    //change accordingly
    startNode = grid[0][0];
    endNode = grid[columns - 1][rows - 1];

    startNode.occupied = endNode.occupied = false;

    unvisitedNodes.push(startNode);

    while(unvisitedNodes.length) {
        //find node with lowest f score
        let lowest = unvisitedNodes.sort((a, b) => {
            return a.f - b.f;
        })[0];

        let currentNode = lowest; //unvisitedNodes[lowest]; //cus the closest is obv the one ur at

        if(lowest == endNode) {
            console.log("finished");

            path = [];
            path.push(currentNode);

            var temp = currentNode;
            while(temp.parent) {
                path.push(temp.parent);
                temp = temp.parent;
            }

            path.reverse();

            return;
        }

        unvisitedNodes.splice(unvisitedNodes.indexOf(currentNode), 1);
        visitedNodes.push(currentNode);

        for(let i = 0; i < currentNode.neighbours.length; i++) {
            let neighbour = currentNode.neighbours[i];

            if(visitedNodes.includes(neighbour) || neighbour.occupied) return;

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
                neighbour.h = heuristic(neighbour, endNode);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.parent = currentNode;
            }
        }
    }

};

run(grid);