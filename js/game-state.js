// global variables
// game canvas element
const canvas = document.getElementById('canvas')
// game context
const ctx = canvas.getContext('2d')
// computed styles
canvas.setAttribute('width', getComputedStyle(canvas)['width'])
canvas.setAttribute('height', getComputedStyle(canvas)['height'])

// game canvas element
const objectiveWindow = document.getElementById('target')
// game context
const ctxTarget = objectiveWindow.getContext('2d')
// computed styles
objectiveWindow.setAttribute('width', getComputedStyle(objectiveWindow)['width'])
objectiveWindow.setAttribute('height', getComputedStyle(objectiveWindow)['height'])

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// gameStateManager that runs when DOM loads
const gameStateManager = () => {
    // scope variables
    // score
    let score = 0
    const scoreUI = document.getElementById('score')
    scoreUI.innerHTML = `${score}`
    // timer
    let timer = 10
    const timerUI = document.getElementById('timer')
    timerUI.innerHTML = `${timer}`
    const countDown = (timer) => {
        timerUI.innerHTML = `${timer}`
        const timerID = setInterval(() => {
            timer -= 1
            timerUI.innerHTML = `${timer}`
        }, 1000)
        setTimeout(() => {
            clearInterval(timerID)
            // console.log(`time's up`)
            return timer
        }, timer * 1000)
    }
    const resetUI = () => {
        timer = 10
        timerUI.innerHTML = `${timer}`
        score = 0
        scoreUI.innerHTML = `${score}`
    }
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
                // text style for context
            ctx.font = '32px Helvetica'
            ctx.fillStyle = 'white'
            ctx.fillText('Burger Rush: Press any key to begin', 50, 100)
            ctx.font = '24px Helvetica'
            ctx.fillText('Move with WASD or arrow keys', 50, 325)
            ctx.fillText('Collect all the ingredients and deliver them to the service window', 50, 375)
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
                this.lastX = null,
                this.lastY = null,
                this.width = 50,
                this.height = 50,
                this.image = '/imgs/testImage.bmp',
                // empty starting array to fill with ingredients
                this.ingredients = [],
                // variable which becomes true when all ingredients have been added to ingredients array
                this.scoreable = false,
                this.render = function () {
                    // const playerImage = new Image()
                    // playerImage.src = this.image
                    // playerImage.onload = () => {
                    //     ctx.drawImage(playerImage, this.x, this.y)
                    // }
                    ctx.fillStyle = 'green'
                    ctx.fillRect(this.x, this.y, this.width, this.height)
                }
                // function to draw burger ingredients in order of acquisition
                this.drawBurger = function (array) {
                    // set variable for where within player graphicto begin stack
                    let stackPosition = 35
                    // set bottom bun color and draw
                    ctx.fillStyle = 'brown'
                    ctx.fillRect(this.x + 15, this.y + 40, 20, 5)
                    // iterate through ingredients array to grab attributes
                    array.forEach(ingredient => {
                        // if this is the first ingredient, draw it at origin
                        if (array[0] === ingredient) {
                            ctx.fillStyle = ingredient.color
                            ctx.fillRect(this.x + 15, this.y + stackPosition, 20, 5)
                            stackPosition -= 5
                        } else {
                        // I may not need this, will test later
                            ctx.fillStyle = ingredient.color
                            ctx.fillRect(this.x + 15, this.y + stackPosition, 20, 5)
                            stackPosition -= 5
                        }
                    // draw top bun that stays on top of burger stack
                    ctx.fillStyle = 'brown'
                    ctx.fillRect(this.x + 15, this.y + stackPosition, 20, 5)
                    })
                }
            }
        }
        // define class for generic wall object that player cannot move through
        class Wall {
            constructor(x, y, width, height) {
                this.x = x,
                this.y = y,
                this.width = width,
                this.height = height,
                this.image = 'imgs/textImage.png',
                this.render = function () {
                    // ctx.fillStyle = 'gray'
                    // ctx.fillRect(this.x, this.y, this.width, this.height)
                    const wallImage = new Image()
                    wallImage.src = this.image
                    wallImage.onload = () => {
                        ctx.drawImage(wallImage, this.x, this.y)
                    }
                }
                this.blockPlayer = function () {
                    if (player.x === this.x && player.y === this.y) {
                        player.y = player.lastY
                        player.x = player.lastX
                    }
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
                        scoreUI.innerHTML = `${score}`
                        // console.log(`Players ingredient list is now ${player.ingredients}`)
                        console.log(`You scored a point`)
                    // if they don't, delete ingredients and display error message
                    } else if (player.ingredients.length > 0 && player.ingredients.length < ingArray.length) {
                        player.ingredients.length = 0
                        failedOrders += 1
                        console.log(`You screwed up! Not all ingredients were added`)
                    }
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
                        // console.log(`Player has obtained ${this.ingredient}`)
                        // console.log(player.ingredients)
                    }
                    // check for all ingredients and make player scoreable
                    if (player.ingredients.length === ingArray.length && player.scoreable === false) {
                        player.scoreable = true
                        // console.log(`player can now score a point`)
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
                    player.lastY = player.y
                    player.lastX = player.x
                    player.y -= 50
                    // console.log(`player's last Y position: ${player.lastY}`)
                    // console.log(`player's current Y position: ${player.y}`)
                    // console.log(`player's current X position: ${player.x}`)
                    break
                case (65): // A
                case (37): // left arrow
                    // this moves the player left
                    player.lastX = player.x
                    player.lastY = player.y
                    player.x -= 50
                    // console.log(`player's last X position: ${player.lastX}`)
                    // console.log(`player's current X position: ${player.x}`)
                    // console.log(`player's current Y position: ${player.y}`)
                    break
                case (83): // S
                case (40): // down arrow
                    // this moves the player down
                    player.lastY = player.y
                    player.lastX = player.x
                    player.y += 50
                    // console.log(`player's last Y position: ${player.lastY}`)
                    // console.log(`player's current Y position: ${player.y}`)
                    // console.log(`player's current X position: ${player.x}`)
                    break
                case (68): // D
                case (39): // right arrow
                    // this moves the player right
                    player.lastX = player.x
                    player.lastY = player.y
                    player.x += 50
                    // console.log(`player's last X position: ${player.lastX}`)
                    // console.log(`player's current X position: ${player.x}`)
                    // console.log(`player's current Y position: ${player.y}`)
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
        // instantiate a player object
        let player = new Player(50, 50)

        // instantiate generator objects
        let tomato = new Generator(400, 300, 'tomato', 'red')
        let cheese = new Generator(250, 200, 'cheese', '#fcba03')
        let lettuce = new Generator(50, 450, 'lettuce', '#18db18')
        let mustard = new Generator(700, 300, 'mustard', '#e8f00e')
        let patty = new Generator(500, 500, 'patty', '#633313')
        let scorer = new Scorer(100, 0)

        // arrays for checking ingredients and interactables
        const ingArray = [patty, cheese, lettuce, tomato, mustard]
        const interactables = [tomato, cheese, lettuce, mustard, patty, scorer]
        
        // array to determine placement of wall objects
        const mapArray = [1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,2,
                          1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,2,
                          1,1,0,0,0,0,0,0,1,0,0,0,1,1,0,2,
                          1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,
                          1,1,0,0,1,0,1,1,1,1,1,0,0,0,1,2,
                          1,1,0,0,1,1,1,1,1,1,1,0,0,0,1,2,
                          1,1,0,0,1,1,1,1,0,1,0,0,0,0,0,2,
                          1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,2,
                          1,1,0,0,1,1,1,0,0,0,1,1,0,0,0,2,
                          1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,2,
                          1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,2,
                          1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        
        // empty array to store all wall objects once they are created
        const wallObj = []
        // function for drawing the map
        const drawMap = () => {
            let mapX = 0
            let mapY = 0
            let counter = 0
            mapArray.forEach(square => {
                if (square === 1) {
                    wallObj.push(new Wall(mapX, mapY, 50, 50))
                    counter++
                    mapX += 50
                    // console.log(mapX)
                } else if (square === 2) {
                    wallObj.push(new Wall(mapX, mapY, 50, 50))
                    counter++
                    mapY += 50
                    mapX = 0
                    // console.log(mapX)
                } else {
                    mapX += 50
                    // console.log(mapX)
                }
                // console.log(counter)
            })
        }
        // call draw function for map
        drawMap()

        // iterator for rendering the objective burger in the objective window
        const drawObjective = () => {
            let stackPosition = 200
            ctxTarget.fillStyle = "brown"
            ctxTarget.fillRect(30, 225, 120, 20)
            ctxTarget.fillRect(30, 75, 120, 20)
            ingArray.forEach(ingredient => {
                ctxTarget.fillStyle = ingredient.color
                ctxTarget.fillRect(30, stackPosition, 120, 20)
                stackPosition -= 25
            })
        }
        drawObjective()
        // setInterval for anonymous play manager function that is saved to a variable and starts immediately
        const playID = setInterval(() => {
        // const playID = requestAnimationFrame(() => {
            // render and collision and scoring functions that push information to DOM elements
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // then, draw the map
            wallObj.forEach(wall => {
                wall.blockPlayer()
                wall.render()
            })
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
            // then, render the player
            player.render()
            // finally, render the current burger stack on top of the player
            player.drawBurger(player.ingredients)
        }, 60)
        // listener for key presses
        document.addEventListener('keydown', movementHandler)
        // includes function to clear interval on play when timer hits zero and start resultsManager
        countDown(timer)
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
            resetUI()
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