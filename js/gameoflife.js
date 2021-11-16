function seed() {
  const argArray = args = [].slice.call(arguments);
  return argArray
}

function same([x, y], [j, k]) {
  if (x === j & y === k) {
    return true
  }
  return false
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some((c) => same(c, cell));
}

const printCell = (cell, state) => {
  let bool = contains.call(state, cell);
  if (bool) return "\u25A3";
  else return "\u25A2";
};

const corners = (state = []) => {
  if (state.length === 0) {
    return {
      topright: [0, 0],
      bottomleft: [0, 0]
    }
  }

  const xs = state.map(([x, _]) => x);
  const ys = state.map(([_, y]) => y);

  return {
    topright: [Math.max(...xs), Math.max(...ys)],
    bottomleft: [Math.min(...xs), Math.min(...ys)]
  }
};

const printCells = (state) => {
  const { bottomleft, topright } = corners(state);
  let accumulator = "";

  for (let y = topright[1]; y >= bottomleft[1]; y--) {
    let row = [];

    for (x = bottomleft[0]; x <= topright[0]; x++) {
      row.push(printCell([x, y], state));
    }

    accumulator += row.join(" ") + "\n";

  }

  return accumulator;
};

const getNeighborsOf = ([x, y]) => [
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  [x - 1, y], [x + 1, y], [x - 1, y - 1], [x, y - 1], [x + 1, y - 1]
];

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter((n) => contains.bind(state)(n));
};

const willBeAlive = (cell, state) => {
  const livingneighbors = getLivingNeighbors(cell, state);

  return (
    livingneighbors.length === 3 || (contains.call(state, cell) && livingneighbors.length === 2)
  );
};

const calculateNext = (state) => {
  const { bottomleft, topright } = corners(state);
  let res = [];

  for (let y = topright[1] + 1; y >= bottomleft[1] - 1; y--) {
    for (let x = bottomleft[0] - 1; x <= topright[0] + 1; x++) {
      res = res.concat(willBeAlive([x, y], state) ? [[x, y]] : []);
    }
  }

  return res;
};

const iterate = (state, iterations) => {
  const states = [state];

  for (let i = 0; i < iterations; i++) {
    states.push(calculateNext(states[states.length - 1]));

  }

  return states;
};

const main = (pattern, iterations) => {
  const res = iterate(startPatterns[pattern], iterations);
  res.forEach(r => console.log(printCells(r)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;