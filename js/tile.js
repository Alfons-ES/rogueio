class Tile {
    constructor(x, y, sprite, passable) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
    }

    replace(newTileType) {
        let newTile = new newTileType(this.x, this.y);

        
        if (this.monster) {
            newTile.monster = this.monster;
            this.monster.tile = newTile;
        }

        tiles[this.x][this.y] = newTile;
        return newTile;
    } // Replace this tile with a new tile of the specified type

    dist(other) {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    } // Manhattan distance to another tile

    getNeighbor(dx, dy) {
        return getTile(this.x + dx, this.y + dy)
    } // Get the tile at the specified offset from this tile

    getAdjacentNeighbors() {
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0),
        ]);
    } // Get the adjacent tiles (up, down, left, right) in a random order

    getAdjacentPassableNeighbors() {
        return this.getAdjacentNeighbors().filter(t => t.passable);
    } // Get the adjacent passable tiles (up, down, left, right) in a random order

    getConnectedTiles() {
        let connectedTiles = [this];
        let frontier = [this];
        while (frontier.length) {
            let neighbors = frontier.pop()
                .getAdjacentPassableNeighbors()
                .filter(t => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors);
            frontier = frontier.concat(neighbors);
        }
        return connectedTiles;
    } // Get all connected passable tiles starting from this tile

    draw() {
        drawSprite(this.sprite, this.x, this.y);

        if (this.treasure) {
            drawSprite(12, this.x, this.y);
        }
    }
}
class Floor extends Tile {
    constructor(x, y) {
        super(x, y, 2, true);
    }

    stepOn(monster) {
        if (monster.isPlayer && this.treasure) {
            score++;
            this.treasure = false;
            spawnMonster();
        }
    }
}

class Wall extends Tile {
    constructor(x, y) {
        super(x, y, 3, false);
    }
}

class Exit extends Tile {
    constructor(x, y) {
        super(x, y, 11, true);
    }

    stepOn(monster) {
        if (monster.isPlayer) {
            if (level == numLevels) {
                addScore(score, true);
                showTitle();
            } else {
                level++;
                startLevel(Math.min(maxHp, player.hp + 1));
            }
        }
    }
}