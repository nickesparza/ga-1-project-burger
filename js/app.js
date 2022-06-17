// define variable to refer to canvas
const game = document.getElementById('canvas')

// define variable to refer to context (the paintbrush)
const ctx = game.getContext('2d')

// I do need this lol
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

console.log(`game width ${game.width}`)
console.log(`game height ${game.height}`)

// define character class
class Player {
    constructor(x, y) {
        this.x = x,
        this.y = y,
        this.width = 50,
        this.height = 50,
        this.render = function () {
            ctx.fillStyle = 'green'
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// instantiate a player object
let player = new Player(0, 0)

// handler for moving with the keyboard
const movementHandler = (e) => {
    switch (e.keyCode) {
        case (87): // W
        case (38): // up arrow
            // this moves the player up
            player.y -= 50
            break
        case (65): // A
        case (37): // left arrow
            // this moves the player left
            player.x -= 50
            break
        case (83): // S
        case (40): // down arrow
            // this moves the player down
            player.y += 50
            break
        case (68): // D
        case (39): // right arrow
            // this moves the player right
            player.x += 50
            break
    }
}

const detectEdge = () => {
    if (player.x < 0) {
        player.x = 0
    } else if (player.y < 0) {
        player.y = 0
    } else if (player.x + player.width > game.width) {
        player.x = player.x - player.width
    } else if (player.y + player.height > game.height) {
        player.y = player.y - player.height
    }
        // || player.x + player.width > game.width
        // || player.y + player.height > game.height
}

const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    detectEdge()
    player.render()
}

// add event listener for W keypress
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keydown', movementHandler)
    setInterval(gameLoop, 60)
})