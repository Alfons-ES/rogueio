
function generateLevel() {
    tryTo('generate map', function () {
        return generateTiles() == randomPassableTile().getConnectedTiles().length;
    });

    generateMonsters();

    for (let i = 0; i < 3; i++) {
        randomPassableTile().treasure = true;
    }
} // Generate a new level with a map and monsters

function generateTiles() {
    let passableTiles = 0;
    tiles = [];
    for (let i = 0; i < numTiles; i++) {
        tiles[i] = [];
        for (let j = 0; j < numTiles; j++) {
            if (Math.random() < 0.3 || !inBounds(i , j)) {
                tiles[i][j] = new Wall(i, j);
            } else {
                tiles[i][j] = new Floor(i, j);
                passableTiles++;
            }
        }
    }
    return passableTiles;
} // Generate a grid of tiles with walls and floors, returns the number of passable tiles

function inBounds(x, y) {
    return x > 0 && y > 0 && x < numTiles - 1 && y < numTiles - 1;
} // Check if the given coordinates are within the bounds of the map

function getTile(x, y) {
    if (inBounds(x, y)) {
        return tiles[x][y];
    } else {
        return new Wall(x, y);
    }
} // Get the tile at the specified coordinates, returns a Wall if out of bounds

function randomPassableTile() {
    let tile;
    tryTo('get random passable tile', function () {
        let x = randomRange(0, numTiles - 1);
        let y = randomRange(0, numTiles - 1);
        tile = getTile(x, y);
        return tile.passable && !tile.monster;
    });
    return tile;
} // Get a random passable tile that is not occupied by a monster

function generateMonsters() {
    monsters = [];
    let numMonsters = level + 1;
    for (let i = 0; i < numMonsters; i++) {
        spawnMonster();
    }
} // Generate a number of monsters based on the current level

function spawnMonster() {
    let monsterType = shuffle([Bird, Snake, Tank, Eater, Jester])[0];
    let monster = new monsterType(randomPassableTile());
    monsters.push(monster);
} // Spawn a new monster of a random type at a random passable tile