import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { DashboardPage } from "./pages/dashboard";
import { PortfolioBuilderPage } from "./pages/portfolio-builder";
import { IntegrationsPage } from "./pages/integrations";
import { SettingsPage } from "./pages/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "portfolio-builder", Component: PortfolioBuilderPage },
      { path: "integrations", Component: IntegrationsPage },
      { path: "settings", Component: SettingsPage },
      { path: "settings/:tab", Component: SettingsPage },
    ],
  },
]);
