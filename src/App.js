import './css/App.css';
import {Welcome} from "./components/Welcome";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Header} from "./components/Header";

function App() {
    return (
        <div className="App">
            <Header/>
            <Welcome/>
        </div>
    );
}

export default App;
