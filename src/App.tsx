import CalendarPage from "./pages/CalendarPage";
import { Route, Switch } from "wouter";
import WelcomePage from "./pages/Welcome";

function App() {
  return (
    <Switch>
      <Route path="/calendar/:token">
        <CalendarPage />
      </Route>

      <Route path="/">
        <WelcomePage />
      </Route>

      <Route>NOT FOUND</Route>
    </Switch>
  );
}

export default App;
