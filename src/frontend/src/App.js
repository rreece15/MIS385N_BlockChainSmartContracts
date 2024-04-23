// App.js
import React from 'react';
import Gallery from './components/Gallery'; // Import the Gallery component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'; // Import the Router components
import ItemPage from './components/ItemPage'; // Import the ItemPage component
// import AccountPage from './components/AccountPage'; // Import the AccountPage component

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Gallery/>} />
          <Route path="/item/:id" element={<ItemPage/>} />
          {/* <Route path="/account" component={<AccountPage/>}/> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;