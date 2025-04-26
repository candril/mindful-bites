import CalendarPage from "./pages/CalendarPage";
import { Route, Switch } from "wouter";
import WelcomePage from "./pages/Welcome";
import AgendaPage from "./pages/AgendaPage";
import { AuthenticatedRoute } from "./WithUser";

function App() {
  return (
    <Switch>
      <Route path="/:token" nest>
        <AuthenticatedRoute>
          <Switch>
            <Route path="/calendar" nest>
              <CalendarPage />
            </Route>

            <Route path="/agenda" nest>
              <AgendaPage />
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
