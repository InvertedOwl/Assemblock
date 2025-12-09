# Assemblock
## Intro
In high school, I created a visual based block programming language called "IdiotScript". This language was pretty bare bones, and often didn't work right, but it challenged me in all the right ways and made me learn so much about everything relating to web development. I tried (and failed) to do authentication among other hurdles. Now, with more concrete knowledge on all things authentication, react, and django, I intend to remake this visual programming language from the ground up in a much better way. I also intend to add features I always intended to add but never figured out how.
## General Idea
Assemblock will be a visual based block programming language similar to scratch. It will have functionality of a lot of basic programming languages (such as assembly). I tend to create the tool to be used for fun but also for learning! A lot of the base flow will carry heavily from assembly, such as jumps, stack, etc. The programmer will have to manage all these systems but in a nicer simpler environment like a block based language. 

## Feature list
- Functioning block programming mechanics
	- Moving blocks around
	- Snapping blocks
	- Managing block order
	- Jumps
	- (Maybe a middleware chain style chain system for the functionality?)
	- 16 Registers
- Running blocks
- At least 20 blocks.
- Simple UI, but effective UI
- Authentication system
	- Logging in
	- Signing out
- Sharing scripts
	- Need to be signed in
	- Can choose unlisted or public
	- Sends and saved scripts to the server via authentication
- Global script pages
	- Browse other peoples scripts
	- Like/Favorite scripts
	- Preview of the script (Not sure how to o this)
- Favorite script pages
	- View all liked/Favorited scripts
	- Be able to unfavorite

## Technical Challenges
I will face many technical challenges while creating this app.
Each item with a star is an item I need to look into further to be able to complete it.
- * Moving blocks around
- * Storing a chain of events stored in blocks.
- Authentication
- * Storing arbitrary data (the scripts) safely
- * Simple but effective UI
- Multiple pages
- Sharing scripts

## Requirements
I do want to point out that requirements 1 and 2 contradict each other.
1. You should build a single-page application using React with Django as the backend.
2. Your app should be multiple pages (using client-side routing)

It is saying I need to build a single page app, but also a multiple page app!

Either way, my app satisfies the requirements listed
- You should build a single-page application using React with Django as the backend.
	- My app will use react and django to function.
- Your app should be multiple pages (using client-side routing)
	- My app will contain multiple pages, such as logging in, sharing scripts, viewing scripts, etc.
- Your app should require authentication (this is given to you in the starter code)
	- My app will be able to use authentication to be able to save, publish, and view scripts
- Your app must be useful
	- My app intends to teach people assembly in an easy package, which I will say is fairly useful!
- Your app should have a consistent, intentional design.
	- The design will be simple, and geometric, but consistent. This is because I am not good at art or design.
- Your app must use the backend and the database in a meaningful way.
	- My app will use the backend to save and load scripts that have been published or saved by the user
	- It will then recall these from the backend when needed.


## Group Members
Just me!
- A02396436, Wesley Olson
