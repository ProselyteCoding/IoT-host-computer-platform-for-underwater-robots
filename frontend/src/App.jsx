import './App.css';
import Show from './components/show/show';
import Control from './components/control/control';
import React, {useState, useEffect} from'react';


function App() {
  return (
    <div className='container'>
      <Show />
      <Control />

    </div>
  );
}

export default App;
