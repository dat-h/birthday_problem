1. Game Overview
Title: Birthday Problem
Genre: Point-and-Click Adventure
Perspective: Third Person
Target Platform: Web (HTML5)

2. Core Gameplay Mechanics
Player Actions: Player will navigate through different scenes identifying items to look at, pick up and use to solve puzzles and escape the room. 

Goals/Objectives: The player aims to solve puzzles to find the pass codes to escape the room.

3. Art & Audio Requirements
Style: Pixel art

Assets:  

Background images for each scene. 
Sprite images for items in the scene that you can interact with. 

Audio:

Background music (bg.mp3)
Voices (Dialogue)

4. Technical Requirements
Programming Language: JavaScript
Libraries/Frameworks: Phaser.js

Game Story:

🕵️‍♂️ Story Premise
You wake up in a strange bedroom. You don’t know who you are, where you are, or how you got here. A dull, throbbing headache pounds behind your eyes. The windows are boarded shut from the inside. The door is locked tight with no key in sight. A thick silence hangs in the air, broken only by the occasional tick of an antique wall clock. On the nightstand, a note reads only:

“You’ll find the truth in the box. But first, remember who you are.”

The box is padlocked and ornate, sitting innocently on the desk in the corner. You can’t open it. Not yet.

🧱 Scene: The Bedroom
The room feels both familiar and alien—like a memory of a place you once lived, but distorted by time and trauma.

✨ Room Overview
Dimensions: Roughly 12' x 14', dimly lit by a flickering lamp on the nightstand.

Color Palette: Muted grays and dusty blues. Shadows cling to the edges of furniture. Warm light flickers from a single bulb.

Lighting: A broken chandelier overhead, a desk lamp with a frayed cord, and a strange pulsating glow behind the closet door.

🛏️ The Bed
Large, four-post with rumpled sheets.

A hidden object under the mattress gives a clue—perhaps a torn photo or a rusted key fragment.

Scratched into the headboard: “Trust the mirror.”

🧥 Scene: The Closet
Deep, half-open, and filled with old clothing of varying sizes and eras—some don’t even seem modern.

A mannequin with a cracked porcelain face wears a trench coat with a monogrammed handkerchief in the pocket: "R.H."

There’s a false panel in the back of the closet, sealed with screws—tools must be found elsewhere.

Inside the closet, you’ll eventually discover:

A flashlight (dead batteries).

A dusty shoebox with labeled teeth molds.

A mirror that doesn’t reflect properly—it shows a slightly different version of the room, sometimes showing things that aren’t really there.

🪞 The Mirror
Mounted above a dresser.

It's out of sync with reality—the reflection sometimes lags, or shows objects differently.

The player can use it to see "hidden" messages or ghostly overlays that point to secrets in the room (e.g. invisible ink, footprints).

📦 The Locked Box (The MacGuffin)
Ornate metal box with 3 dials—each representing a different puzzle to solve.

Rumored to contain your name, a truth you’ve forgotten, or something more dangerous.

It reacts when certain objects are nearby, giving audio or visual clues.

📚 The Desk
Contains a locked drawer with a torn-out journal page describing recurring dreams and a memory loop.

A drawer with a broken key stuck in the lock. You’ll need a substitute tool.

A record player with a warped vinyl that plays backward clues when spun manually.

🧸 Miscellaneous Clues Around the Room
A teddy bear with a zipper mouth—inside is a note with a nonsensical poem that hints at puzzle mechanics.

A wall clock with missing hands—hidden in the closet.

A box of photographs with faces scratched out, except for yours—recognizable by a mirror clue.

Scratches on the walls that, when connected, resemble a constellation or map.

🔒 Core Puzzle Progression
Power Puzzle: Find batteries for the flashlight → use it to see hidden UV writing on the wall.

Identity Puzzle: Piece together torn photos, clothes, and the monogram to guess your name or initials.

Mirror Puzzle: Use the mirror's alternate reality to reveal hidden compartments or fake-out objects.

Time Puzzle: Restore the wall clock with the missing hands → set it to a time shown in the mirror to unlock a mechanical drawer.

Sound Puzzle: Play the record backwards → decode the cryptic whisper to get the lockbox combination.


State management (Menu, Restart Game)

The player can access a menu to pause the game at any time.  The menu shows options to quit, restart and mute or adjust the volume of the sound.


5. Deployment Plan
Testing method: Browser-based demo
Packaging: Bundle all assets/code
Distribution: GitHub page
