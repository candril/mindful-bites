import CalendarPage from "./pages/CalendarPage";
import { Redirect, Route, Switch } from "wouter";
import WelcomePage from "./pages/Welcome";
import AgendaPage from "./pages/AgendaPage";
import { AuthenticatedRoute } from "./WithUser";
import MealStatsPage from "./pages/MealStatsPage";

function App() {
  return (
    <Switch>
      <Route path="/:token" nest>
        <AuthenticatedRoute>
          <Switch>
            <Route path="/calendar">
              <CalendarPage />
            </Route>

            <Route path="/agenda">
              <AgendaPage />
            </Route>

            <Route path="/stats">
              <MealStatsPage />
            </Route>

            <Route>
              <Redirect to="/calendar" />
            </Route>
          </Switch>
        </AuthenticatedRoute>
      </Route>

      <Route path="/">
        <WelcomePage />
      </Route>

      <Route>NOT FOUND</Route>
    </Switch>
  );
}

export default App;
