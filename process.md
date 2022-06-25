Dev Diary

Friday, 6/17
Spent class today getting the browser window set up. Added the canvas and different windows for score, objective, and the timer. Not sure about my approach to pushing UI elements outside of the canvas at this point, but it saves real estate for gameplay so I think it'll be ok. Also got a character spawning in and moving around, plus collision with the canvas boundaries. My goals for tomorrow are to plan out a class of "generators" that give the player an ingredient.

Saturday, 6/18
Got all the gameplay functionality working. Generators now check if the player has their ingredient, and if it doesn't, it pushes that ingredient to an array inside the player object. If the player gets all the ingredients present in a separate ingredients array, the last scorer sets the player's "scoreable" value to true. Built a separate Scorer class that runs a function to check the player's scoreable value and gives them points or chastises them for not getting all the ingredients. Messed around with collision a lot and couldn't figure it out. Also realized that I'm going to need something to manage game states, but I can't think through it right now.

Sunday 6/19
Woke up with an idea for a game state manager and implemented it. Seems like it works pretty well for my purposes. I'm seeing a lot of talk about how setInterval is not the optimal way to show animations and that requestAnimationFrame is the new thing to do, but I don't think I need that quite yet. I can't figure it out very well anyway, but it might be useful for repeated animations down the road.

Monday 6/20
The game is playable from start to finish! It now loads into the titleManager when the game starts, waits for a keypress to start the game, counts down from a timer to 0, then transitions after a short delay to the results screen. I also implemented a system to visually show the burger ingredients being added to the player. I don't know if this is a long-term solution, but I think most of it will be useable even if I change to images or something. Feeling very good about my progress so far, but will definitely need help on figuring out collision and drawing a level when class resumes. After that, it's all visuals (animations, splash screens, characters, level art, etc.) and then stretch goals.

Tuesday 6/21
Collision, collision, collision. I tried very hard to resolve these bugs without doing math, but was unsuccessful. Instead I implemented the UI for showing the target burger and spruced up the UI a little using CSS and a custom font. That part looks good, it's just the collision now that's keeping me from the goal.

Wednesday 6/22
More collision. This is taking a frustrating amount of time. I did finally find an example project online that could be what I need to get past it, but it's not working for me yet. I hate using code I don't fully understand so I'm spending time really digging in to why it does what it does.

Thursday 6/23
Woke up and suddenly understood how the collision detection worked, so I implemented that FINALLY. Images were broken and flickering but with a little experimentation I got those working as well by declaring the new objects outside of the render loop. Added my first round of artwork to the game and now all that's left is to pretty up the rest of it!

Friday 6/24
I created all the artwork and started adding it to the game. I wound up having to move the image variable declarations out of the playManager and into the gameManager scope to ensure they were loading in time. Images sure are slow! A few more bug fixes, including resetting successful/failed orders, and I'm calling the MVP of Burger Rush complete. Over the weekend I'm going to try and mess around with randomizing burger ingredients, as well as maybe adding some music.

Saturday 6/25
Adding randomized burgers was a bit more complicated than I expected. The implementation itself was fairly simple: I created a separate array for the objective and iterated over the array with all the ingredients using a random number to decide if they made it into the objective array. The draw function for the objective was already set up to accept this so it was just a matter of changing a variable name. I weighted the burger patty slightly higher than the other ingredients but it is still very funny every time the randomizer picks a burger combo with no burger. I also set up a multiplier for the score, so the more ingredients show up on an objective, the more points it's worth.

The issues arose when trying to check for the correct combination of ingredients. Since array's can't be directly compared I had to set up another forEach iterator inside the generator class to check that the player's ingredient array both included all the same ingredients as the objective and was the same length, otherwise you could add more ingredients on top of the objective and still score. After that, I had to change the Scorer's function because it didn't know what to do when the burger ingredients were wrong but the number of ingredients was right. I think I caught all the edge cases.

After that I added a Trash class to delete ingredients, added some music, and that covers a lot of the stretch goals I had for myself. I'm super proud of what I've managed to do in the short time we had, even if collision really set me back a few days. I'm reminding myself that I'm not getting into this business to make games and none of the employers I'm interested in are going to care about my ability to code boxes that bump into each other. The important thing is I was able to solve the problem in a reasonable amount of time, AND I can explain how it works to anyone who asks. I've tried to be very meticulous with my comments so anyone looking at the code can understand my methodology. Now all that's left is cleaning up the js file and I think we can go gold on this one.