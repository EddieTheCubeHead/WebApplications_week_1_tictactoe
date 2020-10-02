import "./styles.css";

var board_display = document.getElementById("board");
var game_over = false;
var current_player = 1;
var board = [];
var clock = 0; // milliseconds
var timer = false;

// Creating markers for X, O and empty
// Could just use strings but this in my opinion serves as good practice
// as I am rather new with javascript
const marking = {
  X: "X", // p1
  O: "O", // p2
  Empty: ""
};
Object.freeze(marking);

// A function to create a new board to start a game
function create_board() {
  if (timer) {
    reset_clock();
  }

  board = [];

  while (board_display.rows.length > 0) {
    board_display.deleteRow(0);
  }

  for (var i = 0; i < 5; i++) {
    board.push([
      marking.Empty,
      marking.Empty,
      marking.Empty,
      marking.Empty,
      marking.Empty
    ]);
  }

  document.getElementById("turn_indicator").innerHTML =
    "Player 1 (X), please begin.";
  document.getElementById("reset_button").innerHTML = "Reset board";
  game_over = false;
  current_player = 1;

  draw_board();
}

// A function for drawing the board after row or column amount has changed
function draw_board() {
  for (var row = 0; row < board.length; row++) {
    if (board_display.rows[row] === undefined) {
      var new_row = board_display.insertRow(row);
      new_row.id = row;
    }

    for (var column = 0; column < board[row].length; column++) {
      if (board_display.rows[row].cells[column] === undefined) {
        var new_cell = board_display.rows[row].insertCell(column);
        new_cell.innerHTML = board[row][column];
        new_cell.id = row + ";" + column;
        new_cell.setAttribute("class", "cell");
        new_cell.addEventListener("click", function () {
          on_cell_click(this.id);
        });
      } else {
        board_display.rows[row].cells[column].innerHTML = board[row][column];
        board_display.rows[row].cells[
          column
        ].style.background = get_player_color(board[row][column]);
      }
    }
  }
  board_display.style.width = board[0].length * 62 + "px";
}

// A function to process clicks on the board
function on_cell_click(id) {
  if (!timer) {
    timer = setInterval(tick_clock, 50);
  } else {
    clock = 0;
  }

  var row = id.split(";")[0];
  var column = id.split(";")[1];

  if (board[row][column] !== marking.Empty || game_over) {
    return;
  }

  board[row][column] = get_current_player_mark();
  check_victory(row, column);
  update_current_player();

  if (
    row >= 3 &&
    column >= 3 &&
    row < board.length - 3 &&
    column < board[0].length - 3
  ) {
    board_display.rows[row].cells[column].innerHTML = board[row][column];
    board_display.rows[row].cells[column].style.background = get_player_color(
      board[row][column]
    );
  } else {
    while (row < 3) {
      board.unshift(Array(board[0].length).fill(marking.Empty));
      row++;
    }

    while (column < 3) {
      board.forEach((board_row) => pad_left(board_row));
      column++;
    }

    while (row >= board.length - 3) {
      board.push(Array(board[0].length).fill(marking.Empty));
    }

    while (column >= board[0].length - 3) {
      board.forEach((board_row) => pad_right(board_row));
    }

    draw_board();
  }
}

function get_current_player_mark() {
  return current_player % 2 === 0 ? marking.O : marking.X;
}

function get_player_color(marking) {
  switch (marking) {
    case "X":
      return "rgb(124, 252, 0)";
    case "O":
      return "rgb(250, 128, 114)";
    default:
      return "rgb(255, 255, 255)";
  }
}

function update_current_player() {
  current_player = current_player === 1 ? 2 : 1;
  if (!game_over) {
    document.getElementById("turn_indicator").innerHTML =
      "Player " +
      current_player +
      " (" +
      get_current_player_mark() +
      "), your turn.";
  }
}

function pad_left(row) {
  row.unshift(marking.Empty);
}

function pad_right(row) {
  row.push(marking.Empty);
}

function check_victory(row, column) {
  const start_row = row;
  const start_column = column;
  var longest = 1;

  column--;

  // Horizontal check left
  while (column >= 0 && board[row][column] === get_current_player_mark()) {
    longest++;
    column--;
  }

  column = +start_column + +1;

  // Horizontal check right
  while (
    column < board[row].length &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    column++;
  }

  if (longest >= 5) {
    declare_victory();
    return;
  }

  longest = 1;
  row--;
  column = start_column;

  // Vertical check up
  while (row >= 0 && board[row][column] === get_current_player_mark()) {
    longest++;
    row--;
  }

  row = +start_row + +1;

  // Vertical check down
  while (
    row < board.length &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    row++;
  }

  if (longest >= 5) {
    declare_victory();
    return;
  }

  longest = 1;
  column = start_column - 1;
  row = start_row - 1;

  // Diagonal check up left
  while (
    row >= 0 &&
    column >= 0 &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    column--;
    row--;
  }

  column = +start_column + +1;
  row = +start_row + +1;

  // Diagonal check down right
  while (
    row >= 0 &&
    row < board.length &&
    column < board[row].length &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    column++;
    row++;
  }

  if (longest >= 5) {
    declare_victory();
    return;
  }

  longest = 1;
  column = start_column - 1;
  row = +start_row + +1;

  // Diagonal check up right
  while (
    row >= 0 &&
    row < board.length &&
    column < board[row].length &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    column--;
    row++;
  }

  column = +start_column + +1;
  row = start_row - 1;

  // Diagonal check down left
  while (
    row >= 0 &&
    row < board.length &&
    column >= 0 &&
    board[row][column] === get_current_player_mark()
  ) {
    longest++;
    column++;
    row--;
  }

  if (longest >= 5) {
    declare_victory();
    return;
  }
}

function declare_victory() {
  reset_clock();
  game_over = true;
  document.getElementById("turn_indicator").innerHTML =
    "Congratulations player " +
    current_player +
    " (" +
    get_current_player_mark() +
    "), you win!";

  alert("Player " + current_player + " won!");
  document.getElementById("reset_button").innerHTML = "Play again";
}

function tick_clock() {
  clock += 50;
  if (clock >= 10000) {
    clock = 0;
    update_current_player();
  }
  var percentage = (clock / 10000) * 100;
  document.getElementById("timer_progress").style.width = percentage + "%";
}

function reset_clock() {
  clearInterval(timer);
  timer = false;
  clock = 0;
  document.getElementById("timer_progress").style.width = "0%";
}

// Enabling the reset functionality
document.getElementById("reset_button").addEventListener("click", create_board);

create_board();
