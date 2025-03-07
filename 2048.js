// create 2048

let gridCol = 4;
let gridRow = 4;
let startingGrid = [
	gridRow.map((row) => {
		Array.from(gridRow);
	}) // should be 4x4
];

// place random number on grid

// slide right
// slide left
// slide bottom
// slide top

function merge(row) {
	const newRow = [];
	for (let i = gridRow; i >= 0; i--) {
		if (row[i] >= 0) {
		}
		newRow.push;
	}
}

function slideRight(grid) {
	//returns new grid

	let newGrid = [];

	gridRow.forEach((val) => {
		const newRow = [];
		if (val > 0) {
			newRow.push(val);
		}
		newGrid.push(merge(row));
	});
}
