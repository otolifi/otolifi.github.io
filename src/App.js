import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'react-bootstrap';
import TDCNavbar from "./components/TDCNavbar";
import TDCCanvas from "./components/TDCCanvas";
import TDCAbout from './components/TDCAbout';
import TDCContact from './components/TDCContact';
import TDCServices from './components/TDCServices';


function App() {
  document.title = 'TridiCAD'
  return (
    <Router>
      <Container fluid="md">
        <TDCNavbar></TDCNavbar>
        <Switch>
          <Route path="/about">
            <TDCAbout />
          </Route>
          <Route path="/services">
            <TDCServices/>
          </Route>
          <Route path="/portfolio">
            <Portfolio/>
          </Route>
          <Route path="/contact">
            <TDCContact/>
          </Route>
          <Route path="/canvas">
            <TDCCanvas/>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}
function Home() {
  return (<div className="main">
    <h2>Home</h2>
  </div>
  )}

function Portfolio() {
  return (<div className="main">
  <h2>Portfolio</h2>
</div>
)}

export default App;
