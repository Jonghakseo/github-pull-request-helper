import refresh from "virtual:reload-on-update-in-background-script";
import { sendMessageToClient } from "@src/shared/message";
import { defaultToastConfig } from "@src/shared/toast-config";

refresh("pages/background");
const storageKey = "pr-commit-noti-toast-config";

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => console.log("Port disconnected"));
  port.onMessage.addListener(async (message: Message) => {
    switch (message.type) {
      case "loadConfig":
        chrome.storage.sync.get([storageKey], (result) => {
          sendMessageToClient(port, {
            type: "loadConfig",
            data: result[storageKey] ?? defaultToastConfig,
          });
        });
        break;
      case "saveConfig":
        void chrome.storage.sync.set({ [storageKey]: message.data });
    }
  });
});
