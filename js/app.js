// define variable to refer to canvas
const game = document.getElementById('canvas')

// define variable to refer to context (the paintbrush)
const ctx = game.getContext('2d')

// I do need this lol
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

// define player class
class Player {
    constructor(x, y) {
        this.x = x,
        this.y = y,
        this.width = 50,
        this.height = 50,
        // empty starting array to fill with ingredients
        this.ingredients = [],
        // variable which becomes true when all ingredients have been added to ingredients array
        this.scoreable = false,
        this.render = function () {
            ctx.fillStyle = 'green'
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// define class for generic wall object that player cannot move through
class Wall {
    constructor() {
        this.x = x,
        this.y = y,
        this.width = 50,
        this.height = 50,
        this.render = function () {
            ctx.fillStyle = 'gray'
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// define "scorer" class that checks if the player has all ingredients and increments score
class Scorer {
    constructor(x, y) {
        this.x = x,
        this.y = y,
        this.width = 50,
        this.height = 50,
        // function to check ingredients
        this.checkIngredients = function () {
            // if player has all ingredients, delete ingredients and increment score
            if (player.scoreable === true) {
                player.scoreable = false
                player.ingredients.length = 0
                console.log(`Players ingredient list is now ${player.ingredients}`)
                console.log(`You scored a point`)
            } else if (player.ingredients.length > 0 && player.ingredients.length < ingArray.length) {
                player.ingredients.length = 0
                console.log(`You screwed up! Not all ingredients were added`)
            }
            // if they don't, delete ingredients and display error message
        },
        this.render = function () {
            ctx.fillStyle = 'rgb(255, 133, 230, .5)'
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// define a "generator" class that sits on the grid and gives the player an ingredient
class Generator {
    constructor(x, y, ingredient) {
        this.x = x,
        this.y = y,
        this.width = 50,
        this.height = 50,
        // attribute that determines what ingredient the generator gives
        this.ingredient = ingredient,
        // function to give ingredients
        this.giveIngredient = function () {
            // if player does not 'have' ingredient, give it to them
            if (!player.ingredients.includes(this.ingredient)) {
                player.ingredients.push(this.ingredient)
                console.log(`Player has obtained ${this.ingredient}`)
                console.log(player.ingredients)
            }
            // check for all ingredients and make player scoreable
            if (player.ingredients.length === ingArray.length && player.scoreable === false) {
                player.scoreable = true
                console.log(`player can now score a point`)
            }
        },
        // function to render generator on screen
        this.render = function () {
            ctx.fillStyle = 'rgb(44, 133, 230, .5)'
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// instantiate a player object
let player = new Player(50, 50)

// instantiate a generator object
let tomato = new Generator(400, 300, 'tomato')
let cheese = new Generator(600, 100, 'cheese')
let lettuce = new Generator(200, 500, 'lettuce')
let mustard = new Generator(750, 300, 'mustard')
let patty = new Generator(450, 450, 'patty')
let scorer = new Scorer(0, 0)

const ingArray = [tomato, cheese, lettuce, mustard, patty]
const interactables = [tomato, cheese, lettuce, mustard, patty, scorer]

// checker function for giving player an ingredient
const collisionChecker = (interactable) => {
    if (player.x === interactable.x && player.y === interactable.y) {
        if (interactable instanceof Generator) {
            interactable.giveIngredient()
        } else {
            interactable.checkIngredients()
        }
    }
}

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

// function to draw map
const drawLevel = () => {
    const wallHeight = 50
    const wallWidth = 50
    for (let i = 0; i <= 800; i += 50) {
        ctx.fillStyle = 'gray'
        ctx.fillRect(i, 0, wallWidth, wallHeight)
        ctx.fillRect(i, 550, wallWidth, wallHeight)
        ctx.fillRect(0, i, wallWidth, wallHeight)
        ctx.fillRect(750, i, wallWidth, wallHeight)
    }
}

// function to detect edge collision and reset player to in-bounds
const detectEdge = () => {
    if (player.x < 0) {
        player.x = 0
    } else if (player.y < 0) {
        player.y = 0
    } else if (player.x + player.width > game.width) {
        player.x = game.width - player.width
    } else if (player.y + player.height > game.height) {
        player.y = game.height - player.height
    }
}

// game loop function
const gameLoop = () => {
    // first, clear canvas
    ctx.clearRect(0, 0, game.width, game.height)
    // then, detect if the player is outside the bounds of the canvas and reset them if necessary
    detectEdge()
    // set up handler for interactables
    interactables.forEach(interactables => {
        collisionChecker(interactables)
    })
    // // render interactables
    interactables.forEach(interactables => {
        interactables.render()
    })
    // scorer.render()
    // then, render the player
    player.render()
}

// add event listener for key presses
document.addEventListener('DOMContentLoaded', function () {
    console.log(`DOM content loaded`)
    document.addEventListener('keydown', movementHandler)
    setInterval(gameLoop, 60)
})