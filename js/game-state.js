// global variables
// canvas element
const canvas = document.getElementById('canvas')
// context
const ctx = canvas.getContext('2d')
// computed styles
canvas.setAttribute('width', getComputedStyle(canvas)['width'])
canvas.setAttribute('height', getComputedStyle(canvas)['height'])

// gameStateManager that runs when DOM loads
const gameStateManager = () => {
    // scope variables
    // score
    let score = 0
    // timer
    let timer = 5
    // successful orders
    let successOrders = 0
    // failed orders
    let failedOrders = 0
    // titleManager function that starts interval when game state runs
    const titleManager = () => {
        console.log(`titleManager running`)
        // setInterval for anonymous title manager that is saved to a variable and starts immediately
        const titleID = setInterval(() => {
            // render functions for title screen, animated elements?
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'red'
            ctx.fillRect(375, 275, 50, 50)
        }, 60)
        // includes listener for W keypress that ends interval using return from setInterval and starts playManager
        document.addEventListener('keydown', function () {
            clearInterval(titleID)
            console.log(`titleManager interval cleared`)
            playManager()
        }, {once: true})
    }
    // playManager function that runs when triggered from titleManager event listener
    const playManager = () => {
        console.log(`playManager running`)
        // setInterval for anonymous play manager function that is saved to a variable and starts immediately
        const playID = setInterval(() => {
            // render and collision and scoring functions that push information to DOM elements
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'blue'
            ctx.fillRect(375, 275, 50, 50)
        }, 60)
        // includes function to clear interval on play when timer hits zero and start resultsManager
        setTimeout(() => {
            clearInterval(playID)
            console.log(`playManager interval cleared`)
            resultsManager()
        }, timer * 1000)
    }
    // resultsManager function that runs when triggered from endGame function inside of playManager
    const resultsManager = () => {
        console.log(`resultsManager running`)
        // setInterval for anonymous results manager function that is saved to a variable and starts immediately
        const resultsID = setInterval(() => {
            // renders score screen, successes, and failures
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'green'
            ctx.fillRect(375, 275, 50, 50)
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
// event listener to run gameStateManager when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    gameStateManager()
    console.log(`gameStateManager running`)
})