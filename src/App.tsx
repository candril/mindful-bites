import CalendarPage from "./pages/CalendarPage";
import { Redirect, Route, Switch } from "wouter";
import WelcomePage from "./pages/Welcome";
import AgendaPage from "./pages/AgendaPage";
import { AuthenticatedRoute } from "./WithUser";
import StatisticsPage from "./pages/StatisticsPage";
import AboutPage from "./pages/AboutPage";
import { Toaster } from "./components/ui/sonner";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
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
                <StatisticsPage />
              </Route>

              <Route path="/about">
                <AboutPage />
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

      <Toaster richColors position="bottom-center" />
    </ErrorBoundary>
  );
}

export default App;
