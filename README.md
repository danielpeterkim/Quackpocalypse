# Quackpocalypse: The Web Game

Welcome to **Quackpocalypse**, an online game inspired by the mechanics of Pandemic, set at the Stevens Institute of Technology. In this digital adaptation, players collaborate in real time to prevent a chaotic uprising led by ducks on campus.

To run, use command "npm start" over the whole programs, it will concurrently run the front end and backend.


There is no seed file as our information is stored in Firebase. It would also be not very useful as with our security, it would be difficult to access all of the instances.

The best way for this program to run is on seperate computers. You would get the room code and be able to play the game from seperate machines.
In order to run on a single computer, the user must create two instances. THe most sure proof way to do this is to create incognito tabs on two seperate types of browsers. Due to our security features, using the same browser/window for the 2 instances would result in the inability to access the boardgame. 




For rules and features, please look at the inspiration Pandemic the baord game. https://images-cdn.zmangames.com/us-east-1/filer_public/25/12/251252dd-1338-4f78-b90d-afe073c72363/zm7101_pandemic_rules.pdf


For this project, we planned to use:
React
Tailwind CSS 
Firebase
Vercel
WebRTC

Unfortunately, we came to find out that Vercel and WebRTC are incompatable as Vercel does not offer support for websockets.
We hope that the tech oversight is factored lightly as we were unaware of these incompatabilties.

For future considerations, we would use 
