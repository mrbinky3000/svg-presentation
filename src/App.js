import React from 'react';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <svg
          className="svg"
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100%" height="100%" fill="#efefef"/>
        </svg>
      </div>
    );
  }
}

export default App;
