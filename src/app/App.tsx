import { RouterProvider } from "react-router";
import { router } from "./routes";
import { GitHubProvider } from "./context/GitHubContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <GitHubProvider>
      <Toaster position="bottom-right" richColors />
      <RouterProvider router={router} />
    </GitHubProvider>
  );
}
