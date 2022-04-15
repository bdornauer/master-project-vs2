import './css/App.css';
import {Welcome} from "./components/Welcome";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Header} from "./components/Header";
import {WebController} from "./components/WebController";

function App() {

    return (
        <div className="App">
            <Header/>
            {/*<Welcome/>*/}
            <WebController/>
        </div>
    );
}

export default App;
