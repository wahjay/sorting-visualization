import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar/Navbar';
import Bar from './components/Bar/Bar';
import {
  countingSort,
  heapSort,
  quickSort,
  mergeSort,
  bubbleSort,
  insertionSort,
  reset,
  timeId,
} from './components/Algorithm/Algorithm';
import './App.css';

// return array of nums [1...N]
const getNums = (N) => {
  return [...Array(N).keys()].map(x => x = x + 10);
}

// shuffle the given array
// Fisher-Yates shuffle.
// The idea is to walk the array in the reverse order
// and swap each element with a random one before it.
const shuffle = (A) => {
  for (let i = A.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [A[i], A[j]] = [A[j], A[i]];
  }
}

const MAX = 220;

const Algos = {
  'Bubble Sort': bubbleSort,
  'Quick Sort': quickSort,
  'Merge Sort': mergeSort,
  'Heap Sort': heapSort,
  'Insertion Sort': insertionSort,
  'Counting Sort': countingSort,
};

function App() {
  const [nums, setNums] = useState([]);
  const barsRef = useRef([]);
  const [generate, setGenerate] = useState(false);
  const [running, setRunning] = useState(false);
  const [algo, setAlgo] = useState('Bubble Sort');
  const [size, setSize] = useState(70);
  const [speed, setSpeed] = useState(5);
  const [delay, setDelay]= useState(null);

  // this useEffect is for randomly generating bars
  useEffect(() => {
    if(running) return;
    if(barsRef.current.length > 0) {
      barsRef.current.forEach(bar => reset(bar));
    }

    setDelay(null);
    let A = getNums(MAX);
    shuffle(A);
    A = A.slice(0, size);
    barsRef.current = A.map((h,i) => barsRef.current[i] = React.createRef());
    setNums(A);
  }, [generate, size]);

  const update = (ref, val) => {
    ref.current.style.height = `${val * 3}px`;
    ref.current.textContent = val;
  }

  const resetConfig = () => {
    barsRef.current.forEach(bar => reset(bar));
    setDelay(null);
    setRunning(false);
    clearTimeout(timeId);
    setSize(70);
    setSpeed(5);
  }

  const start = async () => {
    setDelay(null);
    // reset bar colors
    barsRef.current.forEach(bar => reset(bar));

    // map the speed of scale [1,10] to [1000ms, 10ms]
    let adjustedSpeed = Math.floor((100 / speed) * Math.abs(speed - 11));

    setRunning(true);
    let start = new Date().getTime();
    await Algos[algo](barsRef.current, update, adjustedSpeed);
    let end = new Date().getTime();
    setDelay(end-start);
    setRunning(false);
  }

  return (
    <div className="app">
      <Navbar
        generate={() => setGenerate(generate => !generate)}
        selectAlgo={setAlgo}
        algo={algo}
        running={running}
        onStart={start}
        reset={() => resetConfig()}
        size={size}
        setSize={setSize}
        speed={speed}
        setSpeed={setSpeed}
      />
      <div className="content">
        {
          nums.map((h, i) =>
            <Bar
              barRef={barsRef.current[i]}
              key={i}
              height={h}
              width={800 / (nums.length + 15)}
            />
          )
        }
      </div>
      <div className="delay">
        {delay ? ('Finished in ' + (delay/1000).toFixed(2) + ' s') : ''}
      </div>
    </div>
  );
}

export default App;
