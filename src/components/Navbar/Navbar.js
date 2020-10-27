import React from 'react';
import { Dropdown } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slider from '@material-ui/core/Slider';
import './Navbar.css';

export default function Navbar({
  generate,
  algo,
  selectAlgo,
  running,
  onStart,
  reset,
  pause,
  size,
  setSize,
  speed,
  setSpeed
}) {

  const handleSizeChange = (e, val) => {
    if(running) return;
    setSize(val);
  };

  const handleSpeedChange = (e, val) => {
    if(running) return;
    setSpeed(val);
  }

  return (
    <div
      className="navbar"
    >
      <div className="control">
        <button className="generate" onClick={generate}>New Array</button>
        <button className="reset" onClick={reset}>Reset</button>
        {/*<button className="pause" onClick={pause}>Stop</button>*/}
      </div>
        <div className="navbar-mid">
          <div className="navbar-mid-size">
            <span>Size</span>
            <Slider
              value={size}
              onChange={handleSizeChange}
              min={10}
              max={150}
              step={1}
              color='secondary'
              aria-labelledby="continuous-slider"
              valueLabelDisplay="auto"
            />
          </div>
          <div className="navbar-mid-speed">
            <span>Speed</span>
            <Slider
              value={speed}
              onChange={handleSpeedChange}
              min={1}
              max={10}
              step={1}
              color='secondary'
              aria-labelledby="continuous-slider"
              valueLabelDisplay="auto"
            />
          </div>
        </div>
      <div className="navbar-right">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {algo}
          </Dropdown.Toggle>

          <Dropdown.Menu id="dropdown-menu">
            <Dropdown.Item onSelect={() => selectAlgo('Heap Sort')} >Heap Sort</Dropdown.Item>
            <Dropdown.Item onSelect={() => selectAlgo('Quick Sort')}>Quick Sort</Dropdown.Item>
            <Dropdown.Item onSelect={() => selectAlgo('Merge Sort')} >Merge Sort</Dropdown.Item>
            <Dropdown.Item onSelect={() => selectAlgo('Bubble Sort')} >Bubble Sort</Dropdown.Item>
            <Dropdown.Item onSelect={() => selectAlgo('Insertion Sort')} >Insertion Sort</Dropdown.Item>
            <Dropdown.Item onSelect={() => selectAlgo('Counting Sort')} >Counting Sort</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <div className="loading">
          {running ?
            <CircularProgress
              disableShrink
              color="secondary"
              size={25}
            /> :
            <button onClick={onStart}>
              Sort
            </button>
          }
        </div>
      </div>
    </div>
  );
}
