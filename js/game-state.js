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
    let timer = 60
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
        timer = 60
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
                this.speed = 25,
                this.direction = {
                    up: false,
                    down: false,
                    left: false,
                    right: false
                },
                this.width = 50,
                this.height = 50,
                this.image = '/imgs/testImage.bmp',
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
            // add methods to smooth out player movement
            // setDirection unlocks player position
            setDirection = function (key) {
                // console.log(`this is the key that was pressed ${key}`)
                if (key.toLowerCase() == 'w') { this.direction.up = true }
                if (key.toLowerCase() == 'a') { this.direction.left = true }
                if (key.toLowerCase() == 's') { this.direction.down = true }
                if (key.toLowerCase() == 'd') { this.direction.right = true }
            }
            // unsetDirection will be keyup event to stop direction from being true
            unSetDirection = function (key) {
                if (key.toLowerCase() == 'w') { this.direction.up = false }
                if (key.toLowerCase() == 'a') { this.direction.left = false }
                if (key.toLowerCase() == 's') { this.direction.down = false }
                if (key.toLowerCase() == 'd') { this.direction.right = false }
            }
            movePlayer = function () {
                // move player looks at the direction and sends the object in the true direction
                if (this.direction.up) {
                    if (getTile(this.x + 25, this.y - 25) !== 1 && getTile(this.x, this.y - 25) !== 1) {
                        this.y -= this.speed
                    }
                    if (this.y <= 0) {
                        this.y = 0
                    }
                }
                if (this.direction.left) {
                    if (getTile((this.x - 25) + 1, this.y) !== 1 && getTile((this.x - 25) + 1, this.y + 25) !== 1) {
                        this.x -= this.speed
                      }
                    if (this.x <= 0) {
                        this.x = 0
                    }
                }
                if (this.direction.down) {
                    if (getTile((this.x + 25) - 1, (this.y + 50)) !== 1 && getTile((this.x + 25) + 1, (this.y + 50)) !== 1) {
                        this.y += this.speed
                    }
                    if (this.y + this.height >= canvas.height) {
                        this.y = canvas.height - this.height
                    }
                }
                if (this.direction.right) {
                    if (getTile(((this.x + this.width) + 1), this.y) !== 1 && getTile(((this.x + this.width) + 1), this.y + 25) !== 1) {
                        this.x += this.speed;
                      }
                    if (this.x + this.width >= canvas.width) {
                        this.x = canvas.width - this.width
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
                        correctOrIncorrect('#09e030')
                        player.scoreable = false
                        score += 100
                        successOrders += 1
                        player.ingredients.length = 0
                        scoreUI.innerHTML = `${score}`
                        // console.log(`Players ingredient list is now ${player.ingredients}`)
                        console.log(`You scored a point`)
                    // if they don't, delete ingredients and display error message
                    } else if (player.ingredients.length > 0 && player.ingredients.length < ingArray.length) {
                        correctOrIncorrect('red')
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
                } else if (interactable instanceof Scorer) {
                    interactable.checkIngredients()
                }
            }
        }
        // instantiate a player object
        let player = new Player(150, 100)

        // instantiate generator objects
        let tomato = new Generator(400, 300, 'tomato', 'red')
        let cheese = new Generator(250, 200, 'cheese', '#fcba03')
        let lettuce = new Generator(50, 450, 'lettuce', '#18db18')
        let mustard = new Generator(700, 300, 'mustard', '#e8f00e')
        let patty = new Generator(500, 500, 'patty', '#633313')
        let scorer = new Scorer(50, 50)

        // arrays for checking ingredients and interactables
        const ingArray = [patty, cheese, lettuce, tomato, mustard]
        const interactables = [tomato, cheese, lettuce, mustard, patty, scorer]

        // two-dimensional array to determine where to draw walls
        const mapArray = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1],
            [1,1,0,0,0,0,0,0,1,0,0,0,1,1,0,1],
            [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,0,0,1,0,1,1,1,1,1,0,0,0,1,1],
            [1,1,0,0,1,1,1,1,1,1,1,0,0,0,1,1],
            [1,1,0,0,1,1,1,1,0,1,0,0,0,0,0,1],
            [1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,1],
            [1,1,0,0,1,1,1,0,0,0,1,1,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ]
        
        function drawMap(){
            ctx.fillStyle = "gray";
            for (let row = 0; row < mapArray.length; row++) {
              for (let col = 0; col < mapArray[0].length; col++) {
                if (mapArray[row][col] === 1) {
                  ctx.fillRect(col * 50, row * 50, 50, 50);
                }
              }
            }
          }

        function getTile(x, y){
            return(mapArray[Math.floor(y / 50)][Math.floor(x / 50)]);
          }

        // call draw function for map
        // drawMap()
        // iterator for rendering the objective burger in the objective window
        const drawObjective = () => {
            ctxTarget.clearRect(0, 0, objectiveWindow.width, objectiveWindow.height)
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
        const correctOrIncorrect = (color) => {
            const window = document.getElementById('objective')
            window.style.backgroundColor = color
            ctxTarget.fillStyle = color
            ctxTarget.fillRect(0, 0, 180, 280)
            setTimeout(drawObjective, 500)
            setTimeout(() => { window.style.backgroundColor = 'black' }, 500)
        }
        // setInterval for anonymous play manager function that is saved to a variable and starts immediately
        const playID = setInterval(() => {
        // const playID = requestAnimationFrame(() => {
            // first clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // then, draw the map
            drawMap()
            // set up handler for interactables to check collision and render
            interactables.forEach(interactable => {
                collisionChecker(interactable)
                interactable.render()
            })
            // then, render the player
            player.render()
            // finally, render the current burger stack on top of the player
            player.drawBurger(player.ingredients)
            player.movePlayer()
        }, 60)
        // two new event listeners are needed, for keyup and keydown
        document.addEventListener('keydown', (e) => {
            // when the key is down, set the direction to true according to the function
            player.setDirection(e.key)
        })

        document.addEventListener('keyup', (e) => {
            // needs to make sure it only applies to the keys we listed in unSetDirection
            if (['w', 'a', 's', 'd'].includes(e.key)) {
                player.unSetDirection(e.key)
            }
        })
        document.addEventListener('keydown', (e) => {
            if (e.key == 'f') {
                console.log(`player X ${player.x} player Y ${player.y} player lastX ${player.lastX} player lastY ${player.lastY}`)
            }
        })
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