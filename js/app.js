const game = document.getElementById('canvas')

game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

console.log(`game width ${game.width}`)
console.log(`game height ${game.height}`)

const ctx = game.getContext('2d')