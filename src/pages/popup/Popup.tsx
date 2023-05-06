import React from "react";
import "@pages/popup/Popup.css";
import DropdownSelect from "@pages/popup/components/DropdownSelect";
import { ToastConfig } from "@src/shared/toast-config";
import { ToastConfigStorageBuilder } from "@src/shared/toast-config-storage";

const toastConfigConfigStorage = ToastConfigStorageBuilder.getStore();

const Popup = () => {
  return (
    <main className="App">
      <section className="config-wrapper">
        <label>
          Click - Copy Style
          <DropdownSelect<ToastConfig["copyStyle"]>
            defaultValue={toastConfigConfigStorage.get("copyStyle")}
            onChangeOption={(value) => {
              toastConfigConfigStorage.set("copyStyle", value);
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
            defaultValue={toastConfigConfigStorage.get("position")}
            onChangeOption={(value) => {
              toastConfigConfigStorage.set("position", value);
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
            defaultValue={toastConfigConfigStorage.get("type")}
            onChangeOption={(value) => {
              toastConfigConfigStorage.set("type", value);
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
            defaultValue={toastConfigConfigStorage.get("theme")}
            onChangeOption={(value) => {
              toastConfigConfigStorage.set("theme", value);
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
            defaultValue={toastConfigConfigStorage.get("delay")}
            type="number"
            min={0}
            step={100}
            onChange={(event) => {
              toastConfigConfigStorage.set("delay", Number(event.target.value));
            }}
          />
        </label>
        <label>
          Draggable
          <input
            type="checkbox"
            defaultChecked={toastConfigConfigStorage.get("draggable")}
            onChange={(event) => {
              toastConfigConfigStorage.set("draggable", event.target.checked);
            }}
          />
        </label>
        <label>
          Auto Close (ms)
          <input
            defaultValue={
              toastConfigConfigStorage.get("autoClose") || undefined
            }
            type="number"
            min={0}
            step={100}
            placeholder="0 = disabled"
            onChange={(event) => {
              toastConfigConfigStorage.set(
                "autoClose",
                Number(event.target.value) || false
              );
            }}
          />
        </label>
        <label>
          Close On Click
          <input
            type="checkbox"
            defaultChecked={toastConfigConfigStorage.get("closeOnClick")}
            onChange={(event) => {
              toastConfigConfigStorage.set(
                "closeOnClick",
                event.target.checked
              );
            }}
          />
        </label>
        <label>
          Pause On Focus Loss
          <input
            type="checkbox"
            defaultChecked={toastConfigConfigStorage.get("pauseOnFocusLoss")}
            onChange={(event) => {
              toastConfigConfigStorage.set(
                "pauseOnFocusLoss",
                event.target.checked
              );
            }}
          />
        </label>
        <label>
          Hide Progress Bar
          <input
            type="checkbox"
            defaultChecked={toastConfigConfigStorage.get("hideProgressBar")}
            onChange={(event) => {
              toastConfigConfigStorage.set(
                "hideProgressBar",
                event.target.checked
              );
            }}
          />
        </label>
        <label>
          Pause On Hover
          <input
            type="checkbox"
            defaultChecked={toastConfigConfigStorage.get("pauseOnHover")}
            onChange={(event) => {
              toastConfigConfigStorage.set(
                "pauseOnHover",
                event.target.checked
              );
            }}
          />
        </label>
      </section>
    </main>
  );
};

export default Popup;
