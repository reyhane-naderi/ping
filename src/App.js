import './App.css'
import React from 'react';
import './index.css';
import Ping from './Ping'
import Footer from './Footer'
import NavPillsExample from './Header.js'
function App() {
  return (
    <div className=" container-fluid">
    
      <NavPillsExample/>
     
<Ping />

<Footer/>
    </div>
  );
}

export default App;
