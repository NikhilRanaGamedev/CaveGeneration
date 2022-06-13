// State for the cells.
const State = {
	WALL: 0,
	PATH: 1
}

let Cells = []; // Array to store cells.
let CellSize = 5; // Size of each cell.
let Offset = 50; // Offset in X and Y. Shifts the draw point of the screen from top left corner.

let XSize = 360; // Number of cells in X.
let YSize = 160; // Number of cells in Y.

let Smoothening = 15; // How Smooth the cave is.

// Sets up the simulation.
function setup()
{
	createCanvas(XSize * CellSize + (Offset * 2), YSize * CellSize + (Offset * 2)); // Create Canvas.
	background(180); // Color background.
	
	DrawInputsText(); // Draw the text for the input boxes.
	DrawInputBoxes(); // Draw the Input boxes to take the inputs.
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
    let inputSmooth = createInput(15, int);
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

		let caveGenerator = new CaveGenerator(XSize, YSize, CellSize, Offset, Cells);
		caveGenerator.Init(); // Initialize cells.
		caveGenerator.SmoothenCave(Smoothening); // Smoothen the cave.

		function UpdateInputs()
		{
			XSize = Number(inputXSize.value());
			YSize = Number(inputYSize.value());
			CellSize = Number(inputCellSize.value());
			Smoothening = Number(inputSmooth.value());
		}
    });
}