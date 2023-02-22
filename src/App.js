import { Outlet, Link } from 'react-router-dom'
import './App.scss'
import Nav from './containers/Nav.jsx'

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1 className="haggard-font"><Link to="/">Haggard</Link></h1>
            </header>
            <hr />
            <Outlet />
            <footer>
                <Nav />
            </footer>
        </div>
  );
}

export default App;
