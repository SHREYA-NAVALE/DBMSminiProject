import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { SignIn } from './Components/SignIn';
import { Dashboard } from './Components/Dashboard';
import { Transactions } from './Components/Transactions';
import { Budgets } from './Components/Budgets';
import { Home } from './Components/Home';
import './App.css';

function App() {
  return (
    <Router> {/* Router wraps the entire application */}
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/transactions' element={<Transactions />} />
          <Route path='/budgets' element={<Budgets />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
