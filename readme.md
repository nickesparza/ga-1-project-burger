Project Burger

One-sentence pitch: Make as many burgers as you can against the ticking clock and score more and more points as you race to satisfy a series of extremely demanding customers.

Anticipated technologies: HTML, CSS, JavaScript, Canvas, Bootstrap

User Stories

The user should be able to:
1. Load the game and be presented with a start screen that includes instructions on how to play
2. Click on the screen or press a button to begin the game
3. Use WASD or the arrow keys to move a character up, down, left, or right on a grid system.
4. See a visual representation of the burger to be made - the ingredients in proper order.
5. Navigate a maze of obstacles that block different routes.
6. Interact with various ingredient stations around the arena that apply the specific ingredient to the burger.
7. See the added ingredients visually on their current order as it is built.
8. Interact with the service window to offload the finished burger.
9. Receive points for completing a successful order, with a multiplier for difficult or large combinations.
10. Receive a failure message upon delivering a burger that does not have all the required elements.
11. Interact with a garbage can to clear the current burger stack if they make a mistake.
12. See a timer that ticks down from some time to 0.
13. Finish the game automatically once the timer hits 0.
14. Transition to a results screen where they are shown stats for:
    successful orders
    unsuccessful orders
    their point total
15. Be able to press a button or click the screen to restart the game or return to title.

Feature List
1. Playable character that can move on a grid
2. Generate a random burger combo and push to objective window
3. Areas with collision that cannot be passed through (maze)
4. Ingredient tiles that add an ingredient to the player's burger once per interaction
5. Pass/fail check upon delivering to service window
6. Point allocation with multiplier based on number of ingredients past 2 or 3
7. Timer that ends the game when it reaches 0
8. Menu functionality for starting/restarting the game and displaying results

Current Anticipated Challenges:
1. Getting ingredient to add only once while inside an ingredient tile
2. How to check/compare player combo with objective combo (exact order of ingredients? any order?)
3. How do display ingredients visually on the canvas relative to the player and the burger stack
4. Getting images to load in canvas and apply collision