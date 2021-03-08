import Footer from "./components/Footer";
import Header from "./components/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import EnterScreen from "./screens/EnterScreen";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Route path="/" component={EnterScreen} exact />
      </main>
      <Footer />
    </Router>
  );
}

export default App;
