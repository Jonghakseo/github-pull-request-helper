import { createRoot } from "react-dom/client";
import App from "@pages/content/components/App/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "chrome-extension-github-pull-request-helper-content-view-root";
document.body.append(root);

createRoot(root).render(<App />);
