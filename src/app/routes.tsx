import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { DashboardPage } from "./pages/dashboard";
import { PortfolioBuilderPage } from "./pages/portfolio-builder";
import { GitHubSyncPage } from "./pages/github-sync";
import { SettingsPage } from "./pages/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "portfolio-builder", Component: PortfolioBuilderPage },
      { path: "github-sync", Component: GitHubSyncPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
