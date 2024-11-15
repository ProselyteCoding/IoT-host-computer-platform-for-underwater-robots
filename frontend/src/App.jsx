import './App.css';
import Show from './components/show/show';
import Control from './components/control/control';

function App() {
  return (
    <div className='main' style={{ backgroundImage: `url('bg.jpg')`  , backgroundSize: 'cover'}}>
      <div className='container'>
          <Show />
          <Control />   
      </div>
    </div>
  );
}

export default App;
