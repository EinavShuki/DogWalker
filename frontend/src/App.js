// import Footer from "./components/Footer";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DogWalkerScreen from "./screens/DogWalkerScreen";
import { AuthProvider } from "./contexts/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PrivateRoute from "./PrivateRoute";
import UpdateScreen from "./screens/UpdateScreen";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
import { StorageProvider } from "./contexts/StorageContext";
import { DbProvider } from "./contexts/DbContext";
import HomeScreen from "./screens/HomeScreen";
import UpdateUserDetails from "./screens/UpdateUserDetails";
import DogWalkerSearchScreen from "./screens/DogWalkerSearchScreen";
import SignUpScreen from "./screens/SignUpScreen";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main>
          <Switch>
            <Route path="/" component={HomeScreen} exact />
            <Route path="/dogWalker" component={DogWalkerScreen} />

            <Route path="/login" component={LoginScreen} />
            <Route path="/signup" component={SignUpScreen} />
            <Route path="/forget-password" component={ForgetPasswordScreen} />
            <StorageProvider>
              <DbProvider>
                <Route
                  path="/searchingdogWalker"
                  component={DogWalkerSearchScreen}
                />
                <PrivateRoute path="/profile" component={ProfileScreen} />
                <PrivateRoute
                  path="/user-details"
                  component={UpdateUserDetails}
                />
                <PrivateRoute path="/update" component={UpdateScreen} />
              </DbProvider>
            </StorageProvider>
          </Switch>
        </main>
        {/* <Footer /> */}
      </AuthProvider>
    </Router>
  );
}

export default App;
