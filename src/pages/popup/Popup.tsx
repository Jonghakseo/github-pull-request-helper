import React, { useEffect, useState } from "react";
import "@pages/popup/Popup.css";
import DropdownSelect from "@pages/popup/components/DropdownSelect";
import { ToastConfig } from "@src/shared/toast-config";
import {
  IConfigStorage,
  ToastConfigStorageBuilder,
} from "@src/shared/toast-config-storage";

const Popup = () => {
  const [storage, setStorage] = useState<IConfigStorage<ToastConfig>>();

  useEffect(() => {
    ToastConfigStorageBuilder.getStore().then(setStorage);
  }, []);

  return (
    <main className="App">
      {storage && (
        <section className="config-wrapper">
          <label>
            Click Copy Style
            <DropdownSelect<ToastConfig["copyStyle"]>
              defaultValue={storage.get("copyStyle")}
              onChangeOption={(value) => {
                storage.set("copyStyle", value);
              }}
              options={[
                {
                  label: "[hash](url)",
                  value: "commit-hash-markdown",
                },
                {
                  label: "[commit name](url)",
                  value: "commit-name-markdown",
                },
                {
                  label: "url",
                  value: "just-url",
                },
              ]}
            />
          </label>
          <label>
            Position
            <DropdownSelect<ToastConfig["position"]>
              defaultValue={storage.get("position")}
              onChangeOption={(value) => {
                storage.set("position", value);
              }}
              options={[
                {
                  label: "top-right",
                  value: "top-right",
                },
                {
                  label: "top-center",
                  value: "top-center",
                },
                {
                  label: "top-left",
                  value: "top-left",
                },
                {
                  label: "bottom-right",
                  value: "bottom-right",
                },
                {
                  label: "bottom-center",
                  value: "bottom-center",
                },
                {
                  label: "bottom-left",
                  value: "bottom-left",
                },
              ]}
            />
          </label>
          <label>
            Type
            <DropdownSelect<ToastConfig["type"]>
              defaultValue={storage.get("type")}
              onChangeOption={(value) => {
                storage.set("type", value);
              }}
              options={[
                {
                  label: "success",
                  value: "success",
                },
                {
                  label: "info",
                  value: "info",
                },
                {
                  label: "warning",
                  value: "warning",
                },
                {
                  label: "error",
                  value: "error",
                },
                {
                  label: "default",
                  value: "default",
                },
              ]}
            />
          </label>
          <label>
            Theme
            <DropdownSelect<ToastConfig["theme"]>
              defaultValue={storage.get("theme")}
              onChangeOption={(value) => {
                storage.set("theme", value);
              }}
              options={[
                {
                  label: "light",
                  value: "light",
                },
                {
                  label: "colored",
                  value: "colored",
                },
                {
                  label: "dark",
                  value: "dark",
                },
              ]}
            />
          </label>
          <label>
            Delay (ms)
            <input
              defaultValue={storage.get("delay")}
              type="number"
              min={0}
              step={100}
              onChange={(event) => {
                storage.set("delay", Number(event.target.value));
              }}
            />
          </label>
          <label>
            Draggable
            <input
              type="checkbox"
              defaultChecked={storage.get("draggable")}
              onChange={(event) => {
                storage.set("draggable", event.target.checked);
              }}
            />
          </label>
          <label>
            Auto Close (ms)
            <input
              defaultValue={storage.get("autoClose") || undefined}
              type="number"
              min={0}
              step={100}
              placeholder="0 = disabled"
              onChange={(event) => {
                storage.set("autoClose", Number(event.target.value) || false);
              }}
            />
          </label>
          <label>
            Close On Click
            <input
              type="checkbox"
              defaultChecked={storage.get("closeOnClick")}
              onChange={(event) => {
                storage.set("closeOnClick", event.target.checked);
              }}
            />
          </label>
          <label>
            Pause On Focus Loss
            <input
              type="checkbox"
              defaultChecked={storage.get("pauseOnFocusLoss")}
              onChange={(event) => {
                storage.set("pauseOnFocusLoss", event.target.checked);
              }}
            />
          </label>
          <label>
            Hide Progress Bar
            <input
              type="checkbox"
              defaultChecked={storage.get("hideProgressBar")}
              onChange={(event) => {
                storage.set("hideProgressBar", event.target.checked);
              }}
            />
          </label>
          <label>
            Pause On Hover
            <input
              type="checkbox"
              defaultChecked={storage.get("pauseOnHover")}
              onChange={(event) => {
                storage.set("pauseOnHover", event.target.checked);
              }}
            />
          </label>
        </section>
      )}
    </main>
  );
};

export default Popup;
