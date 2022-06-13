# CaveGeneration
In this project a cave is generated through cellular automaton. A cellular automaton (CA) is a collection of cells arranged in a grid of specified shape, such that each cell changes state as a function of time, according to a defined set of rules driven by the states of neighboring cells.

# Logic
Each cell in the grid can be in either of one states - WALL or PATH.

Step 1 - Initialize a grid of cells. Randomly assign a state to the cell.<br>
Step 2 - Loop through the cells using the following logic and store the new cell state.

If a cell is a path and has 5 or more wall neighbours, then change to a wall.<br>
If a cell is a wall and has less than 4 neighbours, then change to a path.<br>
![Cave Cell Logic](https://user-images.githubusercontent.com/38834548/173402810-09833a3f-fba7-4fc2-8c89-bdd074532d7e.png)

Step 3 - Change to the new state.<br>
Step 4 - Rinse and Repeat Step 2 and 3 as much you like to smoothen out the cave.<br>

# Removing Unconnected Caverns
The above method will give us a lot of caverns which will not be connected to each other. There are two ways to tackle this, either remove the caverns or connect them. To remove the caverns we will do a flood fill search on which cavern is the largest, and remove the rest.

Step 1 - Loop through all PATH cells.
         If a PATH cell is not marked as searched then check its 4 adjacent neighbours and store the cell in an array.
         Else if a cell is either marked or is a WALL, return out.
Step 2 - Loop through the 4 neigbours using Step 1.

![Flood Fill Search](https://user-images.githubusercontent.com/38834548/173407878-6c3603a6-2db9-49dd-a1e4-73f827ca3b4b.png)

Step 3 - Once the grid has been looped through, check the largest array. Turn every cell to WALL that is not present in this array.<br>
![Biggest Cave](https://user-images.githubusercontent.com/38834548/173407918-013b9466-1692-4aeb-8006-072fc9ec5865.png)
