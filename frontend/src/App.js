import Footer from "./components/Footer";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EnterScreen from "./screens/EnterScreen";
import { AuthProvider } from "./contexts/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PrivateRoute from "./components/PrivateRoute";
import UpdateScreen from "./screens/UpdateScreen";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main>
          <Switch>
            <Route path="/" component={EnterScreen} exact />
            <Route path="/login" component={LoginScreen} />
            <PrivateRoute path="/profile" component={ProfileScreen} />
            <PrivateRoute path="/forget-password" component={ForgetPassword} />
            <PrivateRoute path="/update" component={UpdateScreen} />
          </Switch>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
