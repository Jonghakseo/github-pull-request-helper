import { defaultToastConfig, ToastConfig } from "@src/shared/toast-config";

class ConfigStorage<Data extends Record<string, unknown>> {
  private readonly data: Data;
  private readonly update: (data: Data) => void = () => undefined;

  constructor(key: string, defaultData: Data) {
    const saved = localStorage.getItem(key);

    if (!saved) {
      this.data = defaultData;
    } else {
      this.data = JSON.parse(saved) ?? defaultData;
    }

    this.update = (data) => {
      localStorage.setItem(key, JSON.stringify(data));
    };
  }

  public set(key: keyof Data, value: Data[keyof Data]): void {
    this.data[key] = value;
    this.update(this.data);
  }

  public get<Key extends keyof Data>(key: Key): Data[Key] {
    return this.data[key];
  }
}

export class ToastConfigStorageBuilder {
  private static instance: ConfigStorage<ToastConfig>;
  private static storageKey = "noti-commit-toast-config";

  static getStore(): ConfigStorage<ToastConfig> {
    if (!ToastConfigStorageBuilder.instance) {
      ToastConfigStorageBuilder.instance = new ConfigStorage<ToastConfig>(
        this.storageKey,
        defaultToastConfig
      );
    }
    return ToastConfigStorageBuilder.instance;
  }
}
