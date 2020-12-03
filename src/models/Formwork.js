class WallNode {
    constructor(x, y, z = 0) {
        this.position = {
            x : x,
            y : y,
            z : z
        }
        this.wall = {
            right: null,
            left: null,
            top: null,
            bottom: null
        }
        this.extension = {
            right: 0,
            left: 0,
            top: 0,
            bottom: 0
        }
    }

    setWall(wall, side) {
        this.wall[side] = wall;
    }
    setExtension(value, side) {
        this.extension[side] = value;
    }
}

class WallSegment {
    constructor(start, end, height, thickness) {
        this.node = {
            start: start,
            end: end
        }
        this.height = height;
        this.thickness = thickness;
        this.length = ((start.position.x - end.position.x) ** 2 + (start.position.y - end.position.y) ** 2) ** 0.5;
    }
    setThickness(thickness) {
        this.thickness = thickness;
    }
    setHeight(height) {
        this.height = height;
    }
}

class Wall {
    constructor(wallNodes = [], wallSegments = []) {
        this.nodes = wallNodes;
        this.segments = wallSegments;
    }
    addWallNode(x, y, z = 0) {
        let hasNode = false;
        for (let node in this.nodes) {
            if (this.nodes[node].position.x === x &&
                this.nodes[node].position.y === y &&
                this.nodes[node].position.z === z) {
                    hasNode = true;
                }
        }
        if (!hasNode) {
            let newNode = new WallNode(x, y, z);
            this.nodes.push(newNode);
        } else {
            console.log('Node already exists');
        }
    }
}

class Formwork {
    constructor(wall) {
        this.wall = wall
        this.nodes = wall.nodes
        this.segments = wall.segments
    }
    makeCorners(corners, length) {
        for (let corner in corners) {
            console.log(corner)
            console.log(corners[corner])
            
            corners[corner].extension.right = length
            console.log(corners[corner].extension)
        }
    }
    
}

let nodes = [new WallNode(0, 0), new WallNode(1, 0)]
let segments = [new WallSegment(nodes[0], nodes[1], 2, .2)]
let wall = new Wall(nodes, segments);
wall.addWallNode(0, 1);
let form = new Formwork(wall);
let corners = [...nodes];
//console.log(corners)
form.makeCorners(corners, .15);
