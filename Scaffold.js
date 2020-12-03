class ScaffoldPost {
    constructor(position, height, rotation, connections) {
        this.position = position
        this.height = height
        this.rotation = rotation
        this.connections = connections
    }
}

class ScaffoldDiagonal {
    constructor(position, length, height, rotation) {
        this.position = position
        this.length = length
        this.height = height
        this.rotation = rotation
    }
}

class ScaffoldLedger {
    constructor(position, length, rotation) {
        this.position = position
        this.length = length
        this.rotation = rotation
    }
}

class ScaffoldVertical {
    constructor(position, rotation) {
        this.position = position
        this.rotation = rotation
        this.posts = []
        this.height = 0
        this.horizontals = [0, 0, 0, 0]
        this.modules = [0, 0, 0, 0]
    }
    addPost(scaffoldPost) {
        this.posts.push(scaffoldPost)
        scaffoldPost.position = this.height
        this.height += scaffoldPost.height
    }
    removePost() {
        if (this.posts.length > 0) {
            let sub_height = this.posts[-1]
            this.posts.pop()
            this.height -= sub_height
        }
    }
    clearPost() {
        if (this.posts.length > 0) {
            this.posts = []
            this.height = 0
        }
    }
}

class ScaffoldHorizontal {
    constructor(position, length, rotation) {
        this.position = position
        this.length = length
        this.rotation = rotation
        this.ledgers = []
        this.diagonals = []
    }
    addLedger(scaffoldLedger, level) {
        this.ledgers.push(scaffoldLedger)
        scaffoldLedger.position = level
    }
    addDiagonal(scaffoldDiagonal, level) {
        this.diagonals.push(scaffoldDiagonal)
        scaffoldDiagonal.position = level
    }
    removeLedger() {
        if (this.ledgers.length > 0) {
            this.ledgers.pop()
        }
    }
    removeDiagonal() {
        if (this.diagonals.length > 0) {
            this.diagonals.pop()
        }
    }
    clearHorizontal() {
        if (this.ledgers.length > 0) {
            this.ledgers = []
        }
        if (this.diagonals.length > 0) {
            this.diagonals = []
        }
    }
}

class ScaffoldModule {
    constructor(position, length, width) {
        this.position = position
        this.length = length
        this.width = width
        this.verticals = []
        this.horizontals = []
    }
}

class ScaffoldGroup {
    constructor(position) {
        this.position = position
        this.modules = []
    }
    addModule(position, length, width) {
        let existant = false
        if (this.modules.length > 0) {
            for (let x in this.modules) {
                try {
                    if (this.modules[x].position.x != scaffoldModule.position.x &&
                        this.modules[y].position.y != scaffoldModule.position.y) {
                            existant = true
                        }
                    }
                catch (error) {
                    console.log('empty')
                }
            }
        }
        
        if (!existant) {
            let new_module = new ScaffoldModule(position, length, width)
            this.modules.push(new_module)
        }
    }
    removeModule(id) {
        this.modules.pop(id)
    }
}

data = {
    posts: {
        "collar": {name: "collar_base", height: 0.15, connections: [0.1]},
        "200": {name: "standard_200", height: 2.00, connections: [0.4, 0.9, 1.4, 1.9]},
    },
    ledgers: {
        "207": {name: "ledger_207", length: 2.07}
    },
    diagonals: {
        "207x200": {name: "diagonal_207x200", length: 2.07, height: 2.00}
    }
}

//console.log(data)
//console.log(data.posts["collar"].height)
/**
for (x in data.posts) {
    console.log(data.posts[x].name + ', ' + data.posts[x].height)
} */

// Insert new module
let sca = new ScaffoldGroup({x: 0, y: 0, z: 0})
let mod_width = data.ledgers["207"]
let mod_length = data.ledgers["207"]

sca.addModule({x: 0, y: 0, z: 0}, mod_length.length, mod_width.length)
sca.addModule({x: 3.07, y: 3.07, z: 0}, mod_length.length, mod_width.length)

console.log(sca)

for (x in sca.modules) {
    console.log(sca.modules[x].position.x)
}