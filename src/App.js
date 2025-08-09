import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PaymentComponent from './pages/Addmision';


function App() {
    return (
        <Router>
            <nav>
                <Link to='/'></Link>
            </nav>
            <Routes>
                <Route path='/' element={<PaymentComponent />} />
            </Routes>
        </Router>
    );
}

export default App;
