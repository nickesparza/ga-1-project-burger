// global variables
// canvas element
const canvas = document.getElementById('canvas')
// context
const ctx = canvas.getContext('2d')
// computed styles
canvas.setAttribute('width', getComputedStyle(canvas)['width'])
canvas.setAttribute('height', getComputedStyle(canvas)['height'])

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// gameStateManager that runs when DOM loads
const gameStateManager = () => {
    // scope variables
    // text style for context
    ctx.font = '32px Helvetica'
    // score
    let score = 0
    // timer
    let timer = 10
    // successful orders
    let successOrders = 0
    // failed orders
    let failedOrders = 0
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // titleManager function that starts interval when game state runs
    const titleManager = () => {
        console.log(`titleManager running`)
        // setInterval for anonymous title manager that is saved to a variable and starts immediately
        const titleID = setInterval(() => {
            // render functions for title screen, animated elements?
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'white'
            ctx.fillText('Burger Rush: Press W to begin', 175, 275)
        }, 60)
        // includes listener for W keypress that ends interval using return from setInterval and starts playManager
        document.addEventListener('keydown', function () {
            clearInterval(titleID)
            console.log(`titleManager interval cleared`)
            playManager()
        }, {once: true})
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // playManager function that runs when triggered from titleManager event listener
    const playManager = () => {
        console.log(`playManager running`)
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
                // function to draw burger ingredients in order of acquisition
                this.drawBurger = function (array) {
                    let stackPosition = 35
                    ctx.fillStyle = 'brown'
                    ctx.fillRect(this.x + 15, this.y + 40, 20, 5)
                    array.forEach(ingredient => {
                        if (array[0] === ingredient) {
                            ctx.fillStyle = ingredient.color
                            ctx.fillRect(this.x + 15, this.y + stackPosition, 20, 5)
                            stackPosition -= 5
                        } else {
                            ctx.fillStyle = ingredient.color
                            ctx.fillRect(this.x + 15, this.y + stackPosition, 20, 5)
                            stackPosition -= 5
                        }
                    ctx.fillStyle = 'brown'
                    ctx.fillRect(this.x + 15, this.y + stackPosition, 20, 5)
                    })
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
                        score += 10
                        successOrders += 1
                        player.ingredients.length = 0
                        console.log(`Players ingredient list is now ${player.ingredients}`)
                        console.log(`You scored a point`)
                    } else if (player.ingredients.length > 0 && player.ingredients.length < ingArray.length) {
                        player.ingredients.length = 0
                        failedOrders += 1
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
            constructor(x, y, ingredient, color) {
                this.x = x,
                this.y = y,
                this.width = 50,
                this.height = 50,
                // attribute that determines what ingredient the generator gives
                this.ingredient = ingredient,
                this.color = color,
                // function to give ingredients
                this.giveIngredient = function () {
                    // if player does not 'have' ingredient, give it to them
                    if (!player.ingredients.includes(this)) {
                        player.ingredients.push(this)
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
                    ctx.fillStyle = this.color
                    ctx.fillRect(this.x + 15, this.y + 25, 20, 5)
                }
            }
        }
        // instantiate a player object
        let player = new Player(50, 50)

        // instantiate a generator object
        let tomato = new Generator(400, 300, 'tomato', 'red')
        let cheese = new Generator(600, 100, 'cheese', '#fcba03')
        let lettuce = new Generator(200, 500, 'lettuce', '#18db18')
        let mustard = new Generator(750, 300, 'mustard', '#e8f00e')
        let patty = new Generator(450, 450, 'patty', '#633313')
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
        // function to detect edge collision and reset player to in-bounds
        const detectEdge = () => {
            if (player.x < 0) {
                player.x = 0
            } else if (player.y < 0) {
                player.y = 0
            } else if (player.x + player.width > canvas.width) {
                player.x = canvas.width - player.width
            } else if (player.y + player.height > canvas.height) {
                player.y = canvas.height - player.height
            }
        }
        // setInterval for anonymous play manager function that is saved to a variable and starts immediately
        const playID = setInterval(() => {
            // render and collision and scoring functions that push information to DOM elements
            ctx.clearRect(0, 0, canvas.width, canvas.height)
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
            player.drawBurger(player.ingredients)
        }, 60)
        // listener for key presses
        document.addEventListener('keydown', movementHandler)
        // includes function to clear interval on play when timer hits zero and start resultsManager
        setTimeout(() => {
            clearInterval(playID)
            console.log(`playManager interval cleared`)
            ctx.fillStyle = 'white'
            ctx.fillText(`Round Over!`, 300, 350)
            setTimeout(resultsManager, 2000)
        }, timer * 1000)
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // resultsManager function that runs when triggered from endGame function inside of playManager
    const resultsManager = () => {
        console.log(`resultsManager running`)
        // setInterval for anonymous results manager function that is saved to a variable and starts immediately
        const resultsID = setInterval(() => {
            // renders score screen, successes, and failures
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'white'
            ctx.fillText('Round Over', 175, 180)
            ctx.fillText(`Your Score: ${score}`, 175, 225)
            ctx.fillText(`Successful Orders: ${successOrders}`, 175, 325)
            ctx.fillText(`Failed Orders: ${failedOrders}`, 175, 450)
            ctx.fillText(`Press any key to return to title`, 175, 500)
        }, 60)
        // includes event listener for W keypress that ends interval using return from setInterval and starts titleManager again
        document.addEventListener('keydown', function () {
            clearInterval(resultsID)
            console.log(`resultsManager interval cleared`)
            titleManager()
        }, {once: true})
    }
    // call titleManager to begin loop
    titleManager()
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// event listener to run gameStateManager when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    gameStateManager()
    console.log(`gameStateManager running`)
})