import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    gameContainerRef.current?.focus();
  };

  useEffect(() => {
    if (hasStarted && !gameOver && !isPaused) {
      gameContainerRef.current?.focus();
    }
  }, [hasStarted, gameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLButtonElement && !gameContainerRef.current?.contains(e.target))
      ) {
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      if (e.key === ' ' || e.key === 'Escape') {
        if (hasStarted) setIsPaused((p) => !p);
        else setHasStarted(true);
        return;
      }

      if (isPaused || !hasStarted) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused, hasStarted]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 1;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const currentSpeed = Math.max(40, INITIAL_SPEED - Math.floor(score / 5) * 10);
    const gameLoop = setInterval(moveSnake, currentSpeed);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, isPaused, hasStarted, score, highScore, generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto font-['VT323'] text-2xl">
      <div className="w-full flex justify-between items-center mb-4 bg-[#050505] border-4 border-[#0ff] p-4">
        <div className="flex flex-col">
          <span className="text-[#f0f]">MEM_ALLOC</span>
          <span className="text-4xl text-white">{score.toString().padStart(4, '0')}</span>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => hasStarted ? setIsPaused(!isPaused) : setHasStarted(true)}
            className="px-4 py-2 bg-[#f0f] text-[#050505] border-2 border-[#f0f] hover:bg-[#050505] hover:text-[#f0f] transition-none"
          >
            {!hasStarted || isPaused ? 'RESUME_OP' : 'HALT_OP'}
          </button>
          <button 
            onClick={resetGame}
            className="px-4 py-2 bg-[#0ff] text-[#050505] border-2 border-[#0ff] hover:bg-[#050505] hover:text-[#0ff] transition-none"
          >
            FORCE_REBOOT
          </button>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[#f0f]">PEAK_MEM</span>
          <span className="text-4xl text-white">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div 
        ref={gameContainerRef}
        className="relative bg-[#050505] border-4 border-[#f0f] p-1 focus:outline-none"
        tabIndex={0}
      >
        <div 
          className="grid bg-[#050505]"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(100vw - 2rem, 500px)',
            height: 'min(100vw - 2rem, 500px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`
                  w-full h-full border-[1px] border-[#0ff]/20
                  ${isHead ? 'bg-[#fff]' : ''}
                  ${isBody ? 'bg-[#0ff]' : ''}
                  ${isFood ? 'bg-[#f0f] animate-pulse' : ''}
                `}
              />
            );
          })}
        </div>

        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-[#050505]/90 flex flex-col items-center justify-center z-20 border-4 border-[#0ff] m-1">
            {!hasStarted && !gameOver && (
              <>
                <h2 className="text-5xl text-[#f0f] mb-4 bg-[#0ff] text-[#050505] px-4 py-2">
                  AWAITING_INPUT
                </h2>
                <p className="text-[#0ff] mb-8 text-xl">INPUT: [ARROWS] OR [W,A,S,D]</p>
                <button 
                  onClick={() => setHasStarted(true)}
                  className="px-6 py-2 bg-[#f0f] text-[#050505] text-3xl hover:bg-[#050505] hover:text-[#f0f] border-4 border-[#f0f]"
                >
                  EXECUTE_SEQUENCE
                </button>
              </>
            )}

            {isPaused && hasStarted && !gameOver && (
              <>
                <h2 className="text-5xl text-[#0ff] mb-8 bg-[#f0f] text-[#050505] px-4 py-2">
                  SYS.SUSPENDED
                </h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2 bg-[#0ff] text-[#050505] text-3xl hover:bg-[#050505] hover:text-[#0ff] border-4 border-[#0ff]"
                >
                  RESUME_SEQUENCE
                </button>
              </>
            )}

            {gameOver && (
              <>
                <h2 className="text-6xl text-white bg-[#f0f] px-4 py-2 mb-2 animate-pulse">
                  FATAL_EXCEPTION
                </h2>
                <p className="text-[#0ff] text-3xl mb-8">
                  CORE_DUMP: {score} BYTES
                </p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 bg-[#0ff] text-[#050505] text-3xl hover:bg-[#050505] hover:text-[#0ff] border-4 border-[#0ff]"
                >
                  RESTART_NODE
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
