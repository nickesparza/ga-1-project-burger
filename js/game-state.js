// global variables
// game canvas element
const canvas = document.getElementById('canvas')
// game context
const ctx = canvas.getContext('2d')
// computed styles
canvas.setAttribute('width', getComputedStyle(canvas)['width'])
canvas.setAttribute('height', getComputedStyle(canvas)['height'])

// objective canvas element
const objectiveWindow = document.getElementById('target')
// objective window context
const ctxTarget = objectiveWindow.getContext('2d')
// objective window computed styles
objectiveWindow.setAttribute('width', getComputedStyle(objectiveWindow)['width'])
objectiveWindow.setAttribute('height', getComputedStyle(objectiveWindow)['height'])

// audio element
const music = document.getElementById('music')

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// gameStateManager that runs when DOM loads that loads titleManager first
const gameStateManager = () => {
    // scope variables
    // declaring image objects for the game art
    ///////////////////////////////////////////
    canvas.style.backgroundColor = '#475aa1'
    let playerImage = new Image()
    playerImage.src = 'imgs/chef.png'
    let wallImage = new Image()
    wallImage.src = 'imgs/kitchen_counter.png'
    let genImage = new Image()
    genImage.src = 'imgs/gen_generic.png'
    let scorImage = new Image()
    scorImage.src = 'imgs/scorer.png'
    let trashImage = new Image()
    trashImage.src = 'imgs/trash_can.png'
    let ingTomato = new Image()
    ingTomato.src = 'imgs/ing_tomato.png'
    let ingCheese = new Image()
    ingCheese.src = 'imgs/ing_cheese.png'
    let ingBurg = new Image()
    ingBurg.src = 'imgs/ing_burgpatty.png'
    let ingOnion = new Image()
    ingOnion.src = 'imgs/ing_onion.png'
    let ingPickles = new Image()
    ingPickles.src = 'imgs/ing_pickles.png'
    let ingLettuce = new Image()
    ingLettuce.src = 'imgs/ing_lettuce.png'
    let stackTomato = new Image()
    stackTomato.src = 'imgs/stack_tomato.png'
    let stackCheese = new Image()
    stackCheese.src = 'imgs/stack_cheese.png'
    let stackBurg = new Image()
    stackBurg.src = 'imgs/stack_burg.png'
    let stackLettuce = new Image()
    stackLettuce.src = 'imgs/stack_lettuce.png'
    let stackOnion = new Image()
    stackOnion.src = 'imgs/stack_onion.png'
    let stackPickles = new Image()
    stackPickles.src = 'imgs/stack_pickles.png'
    let bunBot = new Image()
    bunBot.src = 'imgs/bun_bot.png'
    let bunTop = new Image()
    bunTop.src = 'imgs/bun_top.png'
    let uiGameOver = new Image()
    uiGameOver.src = 'imgs/gameOver.png'
    let titleScreen = new Image()
    titleScreen.src = 'imgs/title_screen.png'
    let resultsScreen = new Image()
    resultsScreen.src = 'imgs/results_screen.png'
    //////////////////////////////////////////
    //////////end of asset list///////////////
    // score
    let score = 0
    // push score to DOM
    const scoreUI = document.getElementById('score')
    scoreUI.innerHTML = `${score}`
    // timer
    let timer = 90
    const timerUI = document.getElementById('timer')
    timerUI.innerHTML = `${timer}`
    // successful orders
    let successOrders = 0
    // failed orders
    let failedOrders = 0
    // multiplier
    let multiplier = 1

///////////////////////////////////////////TITLE SCREEN MANAGER//////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // titleManager function that starts interval when game state runs
    const titleManager = () => {
        // console.log(`titleManager running`)
        music.setAttribute('src', '')
        ctxTarget.clearRect(0, 0, objectiveWindow.width, objectiveWindow.height)
        // setInterval for anonymous title manager that is saved to a variable and starts immediately
        const titleID = setInterval(() => {
            // render functions for title screen
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(titleScreen, 0, 0)
        }, 60)
        // includes listener for keypress that ends interval using return from titleID and starts playManager
        document.addEventListener('keydown', function (e) {
            if (e.key == 'w') {
                clearInterval(titleID)
                // console.log(`titleManager interval cleared`)
                playManager()
                this.removeEventListener('keydown', arguments.callee)
            }
            
        })
    }
///////////////////////////////////////////////GAMEPLAY MANAGER//////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // playManager function that runs when triggered from titleManager event listener
    const playManager = () => {
        // console.log(`playManager running`)
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
                // empty starting array to fill with ingredients
                this.ingredients = [],
                // variable which becomes true when all ingredients have been added to ingredients array
                this.scoreable = false                
            }
            // function to draw burger ingredients in order of acquisition
            drawBurger = function (array) {
                // set variable for where within player graphicto begin stack
                let stackPosition = 30
                // set bottom bun color and draw
                ctx.drawImage(bunBot, this.x + 12, this.y + stackPosition, 25, 10)
                // iterate through ingredients array to grab attributes
                array.forEach(ingredient => {
                    // if this is the first ingredient, draw it at origin
                    if (array[0] === ingredient) {
                        ctx.fillStyle = ingredient.color
                        ctx.fillRect(this.x + 15, this.y + stackPosition, 20, 5)
                        stackPosition -= 5
                    } else {
                    // if it's not the first ingredient, draw it above the previous ingredient
                        ctx.fillStyle = ingredient.color
                        ctx.fillRect(this.x + 15, this.y + stackPosition, 20, 5)
                        stackPosition -= 5
                    }
                })
                // draw top bun that stays on top of burger stack
                ctx.drawImage(bunTop, this.x + 12, this.y + stackPosition - 5, 25, 10)
            }
            
            // player render function
            render = function () {
                ctx.drawImage(playerImage, this.x, this.y, this.width, this.height)
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
                // function for checking player movement against the 2D map
                const getTile = (x, y) => {
                    return(mapArray[Math.floor(y / 50)][Math.floor(x / 50)]);
                }
                // move player looks at the direction and sends the object in the true direction
                if (this.direction.up) {
                    // if the coordinates specified by getTile correspond to an array index with a 1 (meaning a solid block), do nothing, otherwise let the player move
                    if (getTile(this.x + 25, this.y - 25) !== 1 && getTile(this.x, this.y - 25) !== 1) {
                        this.y -= this.speed
                    }
                    if (this.y <= 0) {
                        this.y = 0
                    }
                }
                if (this.direction.left) {
                    if (getTile((this.x - this.speed) + 1, this.y) !== 1 && getTile((this.x - 25) + 1, this.y + 25) !== 1) {
                        this.x -= this.speed
                      }
                    if (this.x <= 0) {
                        this.x = 0
                    }
                }
                if (this.direction.down) {
                    if (getTile((this.x + this.speed) - 1, (this.y + 50)) !== 1 && getTile((this.x + this.speed) + 1, (this.y + 50)) !== 1) {
                        this.y += this.speed
                    }
                    if (this.y + this.height >= canvas.height) {
                        this.y = canvas.height - this.height
                    }
                }
                if (this.direction.right) {
                    if (getTile(((this.x + this.width) + 1), this.y) !== 1 && getTile(((this.x + this.width) + 1), this.y + this.speed) !== 1) {
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
                this.height = 50
            }
            // function to check ingredients
            checkIngredients = function () {
                // if player has all ingredients, delete ingredients, increment score, and flash green objective
                if (player.scoreable === true) {
                    correctOrIncorrect('#09e030')
                    player.scoreable = false
                    score += (100 * multiplier)
                    successOrders += 1
                    player.ingredients.length = 0
                    scoreUI.innerHTML = `${score}`
                // if they don't, delete ingredients and flash red objective
                // if they have no ingredients, do nothing, otherwise flash red
                } else if (player.ingredients.length > 0) {
                    correctOrIncorrect('red')
                    score -= (100 * multiplier)
                    failedOrders += 1
                    player.ingredients.length = 0
                    scoreUI.innerHTML = `${score}`
                    // console.log(`You screwed up! Not all ingredients were added`)
                }
            }
            render = function () {
                ctx.drawImage(scorImage, this.x, this.y)
            }
        }
        // define a "generator" class that sits on the grid and gives the player an ingredient
        class Generator {
            constructor(x, y, ingredient, stackRef, image, color) {
                this.x = x,
                this.y = y,
                this.width = 50,
                this.height = 50,
                // attribute that determines what ingredient the generator gives
                this.ingredient = ingredient,
                this.stackRef = stackRef,
                this.image = image,
                this.color = color             
            }
            // function to give ingredients
            giveIngredient = function () {
                // if player does not 'have' ingredient, give it to them
                if (!player.ingredients.includes(this)) {
                    player.ingredients.push(this)
                    // console.log(`Player has obtained ${this.ingredient}`)
                }
                // check for all ingredients and make player scoreable
                objArray.forEach(ingredient => {
                    // player becomes scoreable if and only if their ingredients array is the same length as the objective
                    // AND their array includes everything in the objective array
                    if (player.ingredients.length === objArray.length && player.ingredients.includes(ingredient)) {
                        player.scoreable = true
                    } else {
                        player.scoreable = false
                    }
                })
            }
            // function to render generator on screen
            render = function () {
                ctx.drawImage(genImage, this.x, this.y)
                ctx.drawImage(this.image, this.x, this.y)
            }
        }
        // trash can class to delete ingredients
        class Trash {
            constructor(x, y) {
                this.x = x,
                this.y = y
            }
            // function for garbage object to delete player's current ingredients
            deleteStack = function () {
                if (player.ingredients.length > 0) {
                    player.ingredients.length = 0
                }
            }
            render = function () {
                ctx.drawImage(trashImage, this.x, this.y)
            }
        }

        // checker function for giving player an ingredient
        const collisionChecker = (interactable) => {
            if (player.x === interactable.x && player.y === interactable.y) {
                if (interactable instanceof Generator) {
                    interactable.giveIngredient()
                } else if (interactable instanceof Scorer) {
                    interactable.checkIngredients()
                } else if (interactable instanceof Trash) {
                    interactable.deleteStack()
                }
            }
        }
        // instantiate a player object
        let player = new Player(150, 100)

        // instantiate interactable objects
        // ingredients
        let tomato = new Generator(400, 300, 'tomato', stackTomato, ingTomato, 'red')
        let cheese = new Generator(250, 200, 'cheese', stackCheese, ingCheese, 'yellow')
        let lettuce = new Generator(50, 450, 'lettuce', stackLettuce, ingLettuce, '#5eff00')
        let onion = new Generator(700, 300, 'onion', stackOnion, ingOnion, 'white')
        let patty = new Generator(500, 500, 'patty', stackBurg, ingBurg, 'brown')
        let pickles = new Generator(650, 50, 'pickles', stackPickles, ingPickles, 'green')
        // scorer
        let scorer = new Scorer(50, 50)
        // two trash cans
        let leftTrash = new Trash(250, 450)
        let rightTrash = new Trash(700, 100)

        // arrays for checking ingredients and interactables
        const objArray = []
        const ingArray = [patty, cheese, lettuce, tomato, onion, pickles]
        const interactables = [tomato, cheese, lettuce, onion, patty, pickles, scorer, leftTrash, rightTrash]

        // two-dimensional array to determine where to draw walls
        const mapArray = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,1,1,1,1,1,0,0,0,0,1,1],
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

        // function to draw the map based on the 2D level array
        function drawMap(){
            for (let row = 0; row < mapArray.length; row++) {
                for (let col = 0; col < mapArray[0].length; col++) {
                    if (mapArray[row][col] === 1) {
                    ctx.drawImage(wallImage, col * 50, row * 50);
                    }
                }
            }
        }

        // function for rendering the objective burger in the objective window
        const setObjective = () => {
            ctxTarget.clearRect(0, 0, objectiveWindow.width, objectiveWindow.height)
            let stackPosition = 200
            // clear current objective array
            objArray.length = 0
            // for each possible ingredient, give a 50% chance of it being included in the objective. Weight the burger more heavily
            ingArray.forEach(ingredient => {
                if (ingredient === patty && Math.random() > 0.3) {
                    objArray.push(ingredient)
                } else if (Math.random() > 0.5) {
                    objArray.push(ingredient)
                }
            })
            if (objArray.length === 0) {
                ingArray.forEach(ingredient => {
                    objArray.push(ingredient)
                })
            }
            multiplier = objArray.length
            // iterates over elements in the ingredients array to avoid including things that aren't ingredients
            objArray.forEach(ingredient => {
                ctxTarget.drawImage(ingredient.stackRef, 30, stackPosition, 120, 20)
                stackPosition -= 25
            })
            ctxTarget.drawImage(bunBot, 30, 225)
            ctxTarget.drawImage(bunTop, 30, stackPosition)
        }

        // set objective on game start
        setObjective()

        // function to flash the objective window for correct or incorrect combinations
        const correctOrIncorrect = (color) => {
            const window = document.getElementById('objective')
            window.style.backgroundColor = color
            ctxTarget.fillStyle = color
            ctxTarget.fillRect(0, 0, 180, 280)
            setTimeout(setObjective, 500)
            setTimeout(() => { window.style.backgroundColor = 'black' }, 500)
        }
        // function to set timer and clear playManager interval when it hits 0
        const countDown = (timer) => {
            timerUI.innerHTML = `${timer}`
            const timerID = setInterval(() => {
                timer -= 1
                timerUI.innerHTML = `${timer}`
                if (timer <= 10) {
                    timerUI.style.color = 'red'
                }
                if (timer === 0) {
                    clearInterval(playID)
                    // console.log(`playManager interval cleared`)
                    ctx.drawImage(uiGameOver, 150, 100)
                    setTimeout(resultsManager, 2000)
                }
            }, 1000)
            // set timeout for timer to clear its interval when it hits zero
            setTimeout(() => {
                clearInterval(timerID)
                return timer
            }, timer * 1000)
        }
/////////////////////////////////////////GAME LOOP BELOW/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // setInterval for anonymous play manager function that is saved to a variable and starts immediately
        const playID = setInterval(() => {
        // const playID = requestAnimationFrame(() => {
            // first clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // then, draw the map
            drawMap()
            // check interactables for collision and render
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
/////////////////////////////////////////END GAME LOOP///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // two event listeners for keyup and keydown
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

        // set music
        music.setAttribute('src', 'audio/S31-Winning-the-Race.ogg')
        music.volume = 0.3
        // call countDown function to begin timer
        countDown(timer)
    }
///////////////////////////////////////////////RESULTS SCREEN MANAGER////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // resultsManager function that runs when triggered from timer function inside of playManager
    const resultsManager = () => {
        // console.log(`resultsManager running`)
        // function to reset the timer and score when the player returns from the resultsManager to titleManager
        const resetUI = () => {
            ctxTarget.clearRect(0, 0, objectiveWindow.width, objectiveWindow.height)
            timer = 90
            timerUI.style.color = 'white'
            timerUI.innerHTML = `${timer}`
            score = 0
            scoreUI.innerHTML = `${score}`
            successOrders = 0
            failedOrders = 0
        }
        // setInterval for anonymous results manager function that is saved to a variable and starts immediately
        const resultsID = setInterval(() => {
            // renders score screen, successes, and failures
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // text style for context
            ctx.font = '48px PressStart2P'
            ctx.fillStyle = 'white'
            ctx.drawImage(resultsScreen, 0, 0)
            ctx.fillText(`${successOrders}`, 410, 375)
            ctx.fillText(`${failedOrders}`, 410, 440)
            ctx.fillText(`${score}`, 410, 510)
        }, 60)
        // includes event listener for keypress that ends interval using return from resultsID and starts titleManager again
        document.addEventListener('keydown', function (e) {
            if (e.key == 'w') {
                clearInterval(resultsID)
                // console.log(`resultsManager interval cleared`)
                resetUI()
                titleManager()
                this.removeEventListener('keydown', arguments.callee)
            }
        })
    }
    // call titleManager to begin loop
    titleManager()
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// event listener to run gameStateManager when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    gameStateManager()
    // console.log(`gameStateManager running`)
})