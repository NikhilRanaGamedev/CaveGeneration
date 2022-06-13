class CaveGenerator
{
    constructor(_xSize, _ySize, _cellSize, _offset, _cells)
    {
        this.XSize = _xSize;
        this.YSize = _ySize;
        this.CellSize = _cellSize;
        this.Offset = _offset;
        this.Cells = _cells;
    }

    // Initialize cells.
    Init()
    {
        for (let y = 0; y < this.YSize; y++)
        {
            this.Cells[y] = [];

            for (let x = 0; x < this.XSize; x++)
            {
                if (x == 0 || x == this.XSize - 1 || y == 0 || y == this.YSize - 1)
                {
                    this.Cells[y][x] = new Cell(x, y, State.WALL);
                }
                else
                {
                    // Cells have a random chance of either being born alive or dead.
                    let livingChance = Math.random(1);
        
                    this.Cells[y][x] = new Cell(x, y, livingChance > 0.5 ? 1 : 0);
                }
            }
        }
    }

    // Update the cells state.
    UpdateCells()
    {
        // First loop - Check each cell state. Don't update the states yet.
        for (let y = 0; y < this.YSize; y++)
        {
            for (let x = 0; x < this.XSize; x++)
            {
                // Avoid edge cells.
                if (x != 0 && x != this.XSize - 1 && y != 0 && y != this.YSize - 1)
                    this.Cells[y][x].CheckState(this.Cells);
            }
        }

        // Second loop - Update the cell states.
        for (let y = 0; y < this.YSize; y++)
        {
            for (let x = 0; x < this.XSize; x++)
            {
                this.Cells[y][x].UpdateState();
            }
        }
    }

    SmoothenCave(_smoothIterations, _removeCaverns)
    {
        // Update States of all the cells.
        for (let i = 0; i < _smoothIterations; i++)
            this.UpdateCells();	
        
        // Remove isolated caves.
        if (_removeCaverns)
            this.RemoveCaverns();

        // Draw the cells.
        this.DrawCells();
    }

    // Draw the cells
    DrawCells()
    {
        strokeWeight(0);

        for (let y = 0; y < this.YSize; y++)
        {
            for (let x = 0; x < this.XSize; x++)
            {
                if (this.Cells[y][x].state == State.WALL)
                {
                    // Draw a white square if cell is unwalkable.
                    fill('black');
                    square(x * this.CellSize + this.Offset, y * this.CellSize + this.Offset, this.CellSize);
                }
                else
                {
                    // Draw a white square if cell is walkable.
                    fill('white');
                    square(x * this.CellSize + this.Offset, y * this.CellSize + this.Offset, this.CellSize);
                }
            }
        }
    }

    RemoveCaverns()
    {
        let mainCave = [];

        // Find all the caverns.
        for (let y = 0; y < this.YSize; y++)
        {
            for (let x = 0; x < this.XSize; x++)
            {
                if (this.Cells[y][x].state == State.PATH)
                {
                    let cavernList = [];
                    this.FloodFill(cavernList, this.Cells[y][x]);
                    
                    if (cavernList.length > mainCave.length)
                        mainCave = cavernList;
                }
            }
        }

        // Remove the isolated caverns.
        for (let y = 0; y < this.YSize; y++)
        {
            for (let x = 0; x < this.XSize; x++)
            {
                if (!mainCave.includes(this.Cells[y][x]))
                {
                    this.Cells[y][x].state = State.WALL;
                }
            }
        }
    }

    // Flood Fill all the connected cells i.e. find the connected caverns.
    FloodFill(cavernList, cell)
    {
        if (cell.state == State.WALL || cell.checked == true)
        {
            return;
        }
        
        cell.checked = true;

        if (cell.x - 1 >= 0)
        {
            cavernList.push(this.Cells[cell.y][cell.x - 1]);
            this.FloodFill(cavernList, this.Cells[cell.y][cell.x - 1]);
        }

        if (cell.x + 1 < this.Cells[0].length)
        {
            cavernList.push(this.Cells[cell.y][cell.x + 1]);
            this.FloodFill(cavernList, this.Cells[cell.y][cell.x + 1]);
        }

        if (cell.y - 1 >= 0)
        {
            cavernList.push(this.Cells[cell.y - 1][cell.x]);
            this.FloodFill(cavernList, this.Cells[cell.y - 1][cell.x]);
        }

        if (cell.y + 1 < this.Cells.length)
        {
            cavernList.push(this.Cells[cell.y + 1][cell.x]);
            this.FloodFill(cavernList, this.Cells[cell.y + 1][cell.x]);
        }
    }

    FindRandomPath()
    {
        let startNode = this.Cells[Math.floor(Math.random() * this.YSize)][Math.floor(Math.random() * this.XSize)];
        let endNode = this.Cells[Math.floor(Math.random() * this.YSize)][Math.floor(Math.random() * this.XSize)];

        while (startNode.state == State.WALL)
        {
            startNode = this.Cells[Math.floor(Math.random() * this.YSize)][Math.floor(Math.random() * this.XSize)];
        }

        while (endNode.state == State.WALL)
        {
            endNode = this.Cells[Math.floor(Math.random() * this.YSize)][Math.floor(Math.random() * this.XSize)];
        }

        let aStar = new AStar(startNode, endNode, this.Cells);
        let path = aStar.GeneratePath();
        let closedSet = aStar.GetClosedSet();
        let openSet = aStar.GetOpenSet();

        this.DrawPath(path, closedSet, openSet);
        this.DrawStartEnd(startNode, endNode);
    }

    DrawPath(path, closedSet, openSet)
    {
        for (let y = 0; y < this.YSize; y++)
        {
            for (let x = 0; x < this.XSize; x++)
            {
                if (this.Cells[y][x].state == State.PATH)
                {
                    strokeWeight(0);

                    if (path && path.includes(this.Cells[y][x]))
                    {
                        fill('blue');
                        square(x * this.CellSize + this.Offset, y * this.CellSize + this.Offset, this.CellSize);
                    }
                    else if (closedSet && closedSet.includes(this.Cells[y][x]))
                    {
                        fill('yellow');
                        square(x * this.CellSize + this.Offset, y * this.CellSize + this.Offset, this.CellSize);
                    }
                    else if (openSet && openSet.includes(this.Cells[y][x]))
                    {
                        fill('pink');
                        square(x * this.CellSize + this.Offset, y * this.CellSize + this.Offset, this.CellSize);
                    }
                }
            }
        }
    }

    DrawStartEnd(startNode, endNode)
    {
        strokeWeight(0);

        fill(0, 255, 0);
        square(startNode.x * this.CellSize + this.Offset, startNode.y * this.CellSize + this.Offset, this.CellSize);
        fill(255, 0, 0);
        square(endNode.x * this.CellSize + this.Offset, endNode.y * this.CellSize + this.Offset, this.CellSize);
    }
}