class Cell
{
    constructor(x, y, state)
    {
        this.x = x;
        this.y = y;
        this.state = state;
        this.stateToChangeTo = state;
        this.checked = false;

        this.gCost = 0;
        this.hCost = 0;
        this.fCost = 0;
        this.parent = 0;
    }

    // Check state of cell and change it if needed.
    CheckState(list)
    {
        // Check all 8 neighbours for this cell.
        let walls = this.CheckNeighbours(list);

        if (this.state == State.PATH && walls >= 5)
        {
            this.stateToChangeTo = State.WALL;
        }
        else if (walls < 4)
        {
            this.stateToChangeTo = State.PATH;
        }
    }

    // Update the state of the cell.
    UpdateState()
    {
        this.state = this.stateToChangeTo;
    }
    
    // Check the state of the 8 neighbours of this cell.
    CheckNeighbours(list)
    {
        let neighbours = 0;

        let up = this.y - 1;
        let down = this.y + 1;
        let left = this.x - 1;
        let right = this.x + 1;
        
        if (up >= 0)
        {
            if (left >= 0)
                list[up][left].state == State.WALL ? neighbours++ : neighbours; // Top Left
            
            list[up][this.x].state == State.WALL ? neighbours++ : neighbours; // Top
            
            if (right < list[0].length)
                list[up][right].state == State.WALL ? neighbours++ : neighbours; // Top Right
        }

        if (left >= 0)
            list[this.y][left].state == State.WALL ? neighbours++ : neighbours; // Left
        
        if (right < list[0].length)
            list[this.y][right].state == State.WALL ? neighbours++ : neighbours; // Right

        if (down < list.length)
        {
            if (left >= 0)
                list[down][left].state == State.WALL ? neighbours++ : neighbours; // Bottom Left

            list[down][this.x].state == State.WALL ? neighbours++ : neighbours; // Bottom

            if (right < list[0].length)
                list[down][right].state == State.WALL ? neighbours++ : neighbours; // Bottom Right
        }

        return neighbours;
    }
}