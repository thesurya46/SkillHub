import { useState } from 'react';
import { Puzzle, Trophy, Clock, ArrowLeft, Play, RotateCcw, Zap, Check } from 'lucide-react';

export default function PuzzleGames() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  const puzzleGames = [
    {
      id: 1,
      name: '2048 Puzzle',
      description: 'Combine numbers to reach 2048',
      category: 'Logic',
      difficulty: 'Medium',
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 2,
      name: 'Sliding Puzzle',
      description: 'Arrange tiles in correct order',
      category: 'Spatial',
      difficulty: 'Medium',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 3,
      name: 'Crossword Mini',
      description: 'Fill in the crossword grid',
      category: 'Word',
      difficulty: 'Hard',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 4,
      name: 'Jigsaw Puzzle',
      description: 'Complete the picture puzzle',
      category: 'Visual',
      difficulty: 'Easy',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 5,
      name: 'Tetris Block',
      description: 'Clear lines by arranging blocks',
      category: 'Spatial',
      difficulty: 'Medium',
      color: 'from-red-500 to-rose-500',
    },
    {
      id: 6,
      name: 'Maze Solver',
      description: 'Find the path through the maze',
      category: 'Logic',
      difficulty: 'Medium',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 7,
      name: 'Nonogram',
      description: 'Reveal pictures using number clues',
      category: 'Logic',
      difficulty: 'Hard',
      color: 'from-slate-700 to-slate-900',
    },
    {
      id: 8,
      name: 'Tower of Hanoi',
      description: 'Move disks to solve the puzzle',
      category: 'Strategy',
      difficulty: 'Medium',
      color: 'from-yellow-500 to-amber-500',
    },
    {
      id: 9,
      name: 'Connect Dots',
      description: 'Connect all dots without crossing lines',
      category: 'Logic',
      difficulty: 'Easy',
      color: 'from-lime-500 to-green-500',
    },
    {
      id: 10,
      name: 'Word Search',
      description: 'Find hidden words in the grid',
      category: 'Word',
      difficulty: 'Easy',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 11,
      name: 'Minesweeper',
      description: 'Flag all mines without triggering them',
      category: 'Logic',
      difficulty: 'Hard',
      color: 'from-gray-600 to-gray-800',
    },
    {
      id: 12,
      name: 'Lights Out',
      description: 'Turn off all lights in the grid',
      category: 'Logic',
      difficulty: 'Medium',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  // 2048 Game
  const Game2048 = () => {
    const [grid, setGrid] = useState(() => initializeGrid());
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    function initializeGrid() {
      const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
      addNewTile(newGrid);
      addNewTile(newGrid);
      return newGrid;
    }

    function addNewTile(grid) {
      const emptyCells = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid[i][j] === 0) emptyCells.push({ i, j });
        }
      }
      if (emptyCells.length > 0) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4;
      }
    }

    const handleMove = (direction) => {
      const newGrid = JSON.parse(JSON.stringify(grid));
      let moved = false;
      let newScore = score;

      if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < 4; i++) {
          const row = direction === 'left' ? newGrid[i] : newGrid[i].reverse();
          const { newRow, rowScore, rowMoved } = compressRow(row);
          if (direction === 'right') newRow.reverse();
          newGrid[i] = newRow;
          newScore += rowScore;
          if (rowMoved) moved = true;
        }
      } else {
        for (let j = 0; j < 4; j++) {
          const col = newGrid.map(row => row[j]);
          const column = direction === 'up' ? col : col.reverse();
          const { newRow, rowScore, rowMoved } = compressRow(column);
          if (direction === 'down') newRow.reverse();
          for (let i = 0; i < 4; i++) {
            newGrid[i][j] = newRow[i];
          }
          newScore += rowScore;
          if (rowMoved) moved = true;
        }
      }

      if (moved) {
        addNewTile(newGrid);
        setGrid(newGrid);
        setScore(newScore);
      }
    };

    function compressRow(row) {
      const filtered = row.filter(val => val !== 0);
      const newRow = [];
      let rowScore = 0;
      let rowMoved = false;

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          newRow.push(filtered[i] * 2);
          rowScore += filtered[i] * 2;
          i++;
          rowMoved = true;
        } else {
          newRow.push(filtered[i]);
        }
      }

      while (newRow.length < 4) newRow.push(0);
      if (JSON.stringify(row) !== JSON.stringify(newRow)) rowMoved = true;
      return { newRow, rowScore, rowMoved };
    }

    const getTileColor = (value) => {
      const colors = {
        0: 'bg-slate-200',
        2: 'bg-yellow-100 text-yellow-800',
        4: 'bg-yellow-200 text-yellow-900',
        8: 'bg-orange-300 text-white',
        16: 'bg-orange-400 text-white',
        32: 'bg-orange-500 text-white',
        64: 'bg-red-400 text-white',
        128: 'bg-red-500 text-white',
        256: 'bg-red-600 text-white',
        512: 'bg-yellow-500 text-white',
        1024: 'bg-yellow-600 text-white',
        2048: 'bg-yellow-700 text-white',
      };
      return colors[value] || 'bg-slate-900 text-white';
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Score: {score}</div>
          <button
            onClick={() => {
              setGrid(initializeGrid());
              setScore(0);
              setGameOver(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 smooth-transition"
          >
            <RotateCcw size={16} />
            New Game
          </button>
        </div>

        <div className="inline-block bg-slate-300 p-4 rounded-2xl">
          <div className="grid grid-cols-4 gap-3">
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold smooth-transition ${getTileColor(cell)}`}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          <div></div>
          <button
            onClick={() => handleMove('up')}
            className="px-6 py-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 smooth-transition"
          >
            ↑
          </button>
          <div></div>
          <button
            onClick={() => handleMove('left')}
            className="px-6 py-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 smooth-transition"
          >
            ←
          </button>
          <button
            onClick={() => handleMove('down')}
            className="px-6 py-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 smooth-transition"
          >
            ↓
          </button>
          <button
            onClick={() => handleMove('right')}
            className="px-6 py-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 smooth-transition"
          >
            →
          </button>
        </div>
      </div>
    );
  };

  // Sliding Puzzle
  const SlidingPuzzle = () => {
    const [tiles, setTiles] = useState(() => shuffle([...Array(8).keys()].map(i => i + 1).concat(0)));
    const [moves, setMoves] = useState(0);

    function shuffle(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    const handleTileClick = (index) => {
      const emptyIndex = tiles.indexOf(0);
      const row = Math.floor(index / 3);
      const col = index % 3;
      const emptyRow = Math.floor(emptyIndex / 3);
      const emptyCol = emptyIndex % 3;

      if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
          (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
        const newTiles = [...tiles];
        [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
        setTiles(newTiles);
        setMoves(moves + 1);
      }
    };

    const isSolved = tiles.every((tile, i) => tile === (i === 8 ? 0 : i + 1));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Moves: {moves}</div>
          <button
            onClick={() => {
              setTiles(shuffle([...Array(8).keys()].map(i => i + 1).concat(0)));
              setMoves(0);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 smooth-transition"
          >
            <RotateCcw size={16} />
            Shuffle
          </button>
        </div>

        <div className="inline-block">
          <div className="grid grid-cols-3 gap-2 bg-slate-300 p-4 rounded-2xl">
            {tiles.map((tile, index) => (
              <button
                key={index}
                onClick={() => handleTileClick(index)}
                className={`w-24 h-24 rounded-xl text-2xl font-bold smooth-transition ${
                  tile === 0
                    ? 'bg-slate-400 cursor-default'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 cursor-pointer'
                }`}
              >
                {tile !== 0 && tile}
              </button>
            ))}
          </div>
        </div>

        {isSolved && (
          <div className="text-center p-6 bg-green-100 rounded-xl bounce-in">
            <div className="text-2xl font-bold text-green-800 mb-2">🎉 Congratulations!</div>
            <div className="text-green-700">Solved in {moves} moves!</div>
          </div>
        )}
      </div>
    );
  };

  // Maze Solver
  const MazeSolver = () => {
    const [maze, setMaze] = useState(() => generateMaze());
    const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
    const [moves, setMoves] = useState(0);

    function generateMaze() {
      const size = 10;
      const grid = Array(size).fill(null).map(() => Array(size).fill(1));

      // Create a simple path
      for (let i = 0; i < size; i++) {
        grid[i][Math.floor(size / 2)] = 0;
      }
      for (let j = 0; j < size; j++) {
        grid[Math.floor(size / 2)][j] = 0;
      }

      // Add some random openings
      for (let i = 0; i < 15; i++) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (!(x === 0 && y === 0) && !(x === size - 1 && y === size - 1)) {
          grid[y][x] = 0;
        }
      }

      grid[0][0] = 0; // Start
      grid[size - 1][size - 1] = 0; // End
      return grid;
    }

    const handleMove = (dx, dy) => {
      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;

      if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length && maze[newY][newX] === 0) {
        setPlayerPos({ x: newX, y: newY });
        setMoves(moves + 1);
      }
    };

    const isWon = playerPos.x === maze[0].length - 1 && playerPos.y === maze.length - 1;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Moves: {moves}</div>
          <button
            onClick={() => {
              setMaze(generateMaze());
              setPlayerPos({ x: 0, y: 0 });
              setMoves(0);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 smooth-transition"
          >
            <RotateCcw size={16} />
            New Maze
          </button>
        </div>

        <div className="inline-block bg-slate-200 p-4 rounded-2xl">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${maze[0].length}, minmax(0, 1fr))` }}>
            {maze.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-8 h-8 rounded ${
                    x === playerPos.x && y === playerPos.y
                      ? 'bg-blue-500'
                      : x === maze[0].length - 1 && y === maze.length - 1
                      ? 'bg-green-500'
                      : cell === 0
                      ? 'bg-white'
                      : 'bg-slate-800'
                  }`}
                />
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          <div></div>
          <button
            onClick={() => handleMove(0, -1)}
            className="px-6 py-4 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 smooth-transition"
          >
            ↑
          </button>
          <div></div>
          <button
            onClick={() => handleMove(-1, 0)}
            className="px-6 py-4 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 smooth-transition"
          >
            ←
          </button>
          <button
            onClick={() => handleMove(0, 1)}
            className="px-6 py-4 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 smooth-transition"
          >
            ↓
          </button>
          <button
            onClick={() => handleMove(1, 0)}
            className="px-6 py-4 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 smooth-transition"
          >
            →
          </button>
        </div>

        {isWon && (
          <div className="text-center p-6 bg-green-100 rounded-xl bounce-in">
            <div className="text-2xl font-bold text-green-800 mb-2">🎉 You Win!</div>
            <div className="text-green-700">Completed in {moves} moves!</div>
          </div>
        )}
      </div>
    );
  };

  const renderGame = () => {
    if (!selectedGame) return null;

    switch (selectedGame.id) {
      case 1:
        return <Game2048 />;
      case 2:
        return <SlidingPuzzle />;
      case 6:
        return <MazeSolver />;
      default:
        return (
          <div className="text-center py-12">
            <Puzzle size={64} className="mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600">This puzzle is coming soon!</p>
          </div>
        );
    }
  };

  if (selectedGame) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedGame(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 smooth-transition"
        >
          <ArrowLeft size={20} />
          Back to Puzzles
        </button>

        <div className={`bg-gradient-to-br ${selectedGame.color} rounded-2xl p-8 text-white shadow-2xl`}>
          <div className="flex items-center gap-4 mb-4">
            <Puzzle size={40} className="float" />
            <div>
              <h2 className="text-3xl font-bold">{selectedGame.name}</h2>
              <p className="text-white/80">{selectedGame.description}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">
              {selectedGame.category}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">
              {selectedGame.difficulty}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {renderGame()}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <Puzzle className="float" size={48} />
          <div>
            <h1 className="text-4xl font-bold">Puzzle Games</h1>
            <p className="text-slate-300 mt-2">
              Challenge yourself with classic and modern puzzle games
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <Trophy className="mb-2 text-yellow-400" size={24} />
            <div className="text-2xl font-bold">{totalScore}</div>
            <div className="text-sm text-slate-300">Total Score</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <Puzzle className="mb-2 text-green-400" size={24} />
            <div className="text-2xl font-bold">{puzzleGames.length}</div>
            <div className="text-sm text-slate-300">Puzzles Available</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <Zap className="mb-2 text-blue-400" size={24} />
            <div className="text-2xl font-bold">New</div>
            <div className="text-sm text-slate-300">More Coming Soon</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {puzzleGames.map((game, index) => (
          <div
            key={game.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden card-hover cursor-pointer scale-in"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => setSelectedGame(game)}
          >
            <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
              <Puzzle size={48} className="text-white float" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{game.name}</h3>
              <p className="text-slate-600 text-sm mb-4">{game.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    {game.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      game.difficulty === 'Easy'
                        ? 'bg-green-100 text-green-700'
                        : game.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {game.difficulty}
                  </span>
                </div>
                <Play size={20} className="text-slate-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
