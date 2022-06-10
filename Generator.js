// State for the cells.
const State = {
	WALL: 0,
	PATH: 1
}

let Cells = [];
let CellSize = 5;
let Offset = 50;

let XSize = 360; // Number of cells in X.
let YSize = 165; // Number of cells in Y.

let Smoothening = 10;

// Sets up the simulation.
function setup()
{
	createCanvas(XSize * CellSize + (Offset * 2), YSize * CellSize + (Offset * 2)); // Create Canvas.
	background(180); // Color background.
	
	DrawInputsText(); // Draw the text for the input boxes.
	DrawInputBoxes(); // Draw the Input boxes to take the inputs.
}

// Initialize cells.
function Init()
{
	for (let y = 0; y < YSize; y++)
	{
		Cells[y] = [];

		for (let x = 0; x < XSize; x++)
		{
			if (x == 0 || x == XSize - 1 || y == 0 || y == YSize - 1)
			{
				Cells[y][x] = new Cell(x, y, State.WALL);
			}
			else
			{
				// Cells have a random chance of either being born alive or dead.
				let livingChance = Math.random(1);
	
				Cells[y][x] = new Cell(x, y, livingChance > 0.5 ? 1 : 0);
			}
		}
	}
}

// Draws the text for the input boxes.
function DrawInputsText()
{
    text('X:', 10, 20);
    text('Y:', 150, 20);
    text('Cell Size:', 300, 20);
    text('Smoothening:', 475, 20);
}

// Draws the input boxes.
function DrawInputBoxes()
{
	// Take X Size.
    let inputXSize = createInput(360, int);
    inputXSize.size(100, 25);
    inputXSize.position(35, 8);

	// Take Y Size.
    let inputYSize = createInput(160, int);
    inputYSize.size(100, 25);
    inputYSize.position(180, 8);

	// Take Cell Size.
    let inputCellSize = createInput(5, int);
    inputCellSize.size(100, 25);
    inputCellSize.position(360, 8);

	// Take Smoothening.
    let inputSmooth = createInput(50, int);
    inputSmooth.size(100, 25);
    inputSmooth.position(560, 8);

	// Generate cave.
    let generateButton = createButton('Generate!');
    generateButton.size(100, 32);
    generateButton.position(700, 8);
    generateButton.mousePressed(function()
    {
		clear();
		UpdateInputs();
		createCanvas(XSize * CellSize + (Offset * 2), YSize * CellSize + (Offset * 2)); // Resize canvas.
		background(180); // Color background.

		DrawInputsText(); // Draw the text for the input boxes.
		Init(); // Initialize cells.
		SmoothenCave(); // Smoothen the cave.
    });

	let removeCavernsButton = createButton('Remove Caverns!');
    removeCavernsButton.size(100, 32);
    removeCavernsButton.position(825, 8);
    removeCavernsButton.mousePressed(function()
    {
		if (Cells.length > 0)
		{
			RemoveCaverns();
			DrawCells();
		}
    });

	function UpdateInputs()
	{
		XSize = Number(inputXSize.value());
        YSize = Number(inputYSize.value());
        CellSize = Number(inputCellSize.value());
		Smoothening = Number(inputSmooth.value());
	}
}

function SmoothenCave()
{
	// Update States of all the cells.
	for (let i = 0; i < Smoothening; i++)
		UpdateCells();	
	
	// Remove isolated caves.
	// RemoveCaverns();

	RemoveCaverns();

	let startNode = Cells[Math.floor(Math.random() * YSize)][Math.floor(Math.random() * XSize)];
	let endNode = Cells[Math.floor(Math.random() * YSize)][Math.floor(Math.random() * XSize)];

	while (startNode.state == State.WALL)
	{
		startNode = Cells[Math.floor(Math.random() * YSize)][Math.floor(Math.random() * XSize)];
	}

	while (endNode.state == State.WALL)
	{
		endNode = Cells[Math.floor(Math.random() * YSize)][Math.floor(Math.random() * XSize)];
	}

	let aStar = new AStar(startNode, endNode, Cells);
	let path = aStar.GeneratePath();
	let closedSet = aStar.GetClosedSet();
	let openSet = aStar.GetOpenSet();

	// Draw the cells.
	DrawCells(path, closedSet, openSet, startNode, endNode);
}

// Update the cells state.
function UpdateCells()
{
	// First loop - Check each cell state. Don't update the states yet.
	for (let y = 0; y < YSize; y++)
	{
		for (let x = 0; x < XSize; x++)
		{
			// Avoid edge cells.
			if (x != 0 && x != XSize - 1 && y != 0 && y != YSize - 1)
				Cells[y][x].CheckState(Cells);
		}
	}

	// Second loop - Update the cell states.
	for (let y = 0; y < YSize; y++)
	{
		for (let x = 0; x < XSize; x++)
		{
			Cells[y][x].UpdateState();
		}
	}
}

// Draw the cells
function DrawCells(path, closedSet, openSet, startNode, endNode)
{
	console.log(startNode);
	console.log(endNode);

	for (let y = 0; y < YSize; y++)
	{
		for (let x = 0; x < XSize; x++)
		{
			if (Cells[y][x].state == State.WALL)
			{
				// Draw a white square if cell is unwalkable.
				fill('black');
				square(x * CellSize + Offset, y * CellSize + Offset, CellSize);
			}
			else
			{
				// Draw a white square if cell is walkable.
				if (path && path.includes(Cells[y][x]))
					fill('blue');
				else if (closedSet && closedSet.includes(Cells[y][x]))
					fill('yellow');
				else if (openSet && openSet.includes(Cells[y][x]))
					fill('pink');
				else
					fill('white');
				
				if (Cells[y][x] == startNode)
					fill(0, 255, 0);
				else if (Cells[y][x] == endNode)
					fill(255, 0, 0);

				strokeWeight(0);
				square(x * CellSize + Offset, y * CellSize + Offset, CellSize);
			}
		}
	}
}

function RemoveCaverns()
{
	let mainCave = [];

	// Find all the caverns.
	for (let y = 0; y < YSize; y++)
	{
		for (let x = 0; x < XSize; x++)
		{
			if (Cells[y][x].state == State.PATH)
			{
				let cavernList = [];
				FloodFill(cavernList, Cells[y][x]);
				
				if (cavernList.length > mainCave.length)
					mainCave = cavernList;
			}
		}
	}

	// Remove the isolated caverns.
	for (let y = 0; y < YSize; y++)
	{
		for (let x = 0; x < XSize; x++)
		{
			if (!mainCave.includes(Cells[y][x]))
			{
				Cells[y][x].state = State.WALL;
			}
		}
	}
}

// Flood Fill all the connected cells i.e. find the connected caverns.
function FloodFill(cavernList, cell)
{
	if (cell.state == State.WALL || cell.checked == true)
	{
		return;
	}
	
	cell.checked = true;

	if (cell.x - 1 >= 0)
	{
		cavernList.push(Cells[cell.y][cell.x - 1]);
		FloodFill(cavernList, Cells[cell.y][cell.x - 1]);
	}

	if (cell.x + 1 < Cells[0].length)
	{
		cavernList.push(Cells[cell.y][cell.x + 1]);
		FloodFill(cavernList, Cells[cell.y][cell.x + 1]);
	}

	if (cell.y - 1 >= 0)
	{
		cavernList.push(Cells[cell.y - 1][cell.x]);
		FloodFill(cavernList, Cells[cell.y - 1][cell.x]);
	}

	if (cell.y + 1 < Cells.length)
	{
		cavernList.push(Cells[cell.y + 1][cell.x]);
		FloodFill(cavernList, Cells[cell.y + 1][cell.x]);
	}
}