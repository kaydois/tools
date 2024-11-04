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
        return (point.x >= this.x - this.w && point.x <= this.x + this.w && point.y >= this.y - this.h && point.y <= this.y + this.h);
    }
}

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

let size = new Rectangle(0, 0, 200, 200);
let quad = new QuadTree(size, 4);

for (let i = 0; i < 10; i++) {
    let point = new Node(Math.random() * 200, Math.random() * 200);
    quad.insert(point);
}
