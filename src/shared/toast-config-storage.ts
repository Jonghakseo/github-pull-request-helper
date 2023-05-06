import { ToastConfig } from "@src/shared/toast-config";
import { sendMessageToBackground } from "@src/shared/message";

export interface IConfigStorage<Data extends Record<string, unknown>> {
  set(key: keyof Data, value: Data[keyof Data]): void;
  get<Key extends keyof Data>(key: Key): Data[Key];
}
class ConfigStorage<Data extends Record<string, unknown>>
  implements IConfigStorage<Data>
{
  private readonly data: Data;
  private readonly update: (data: Data) => void = () => undefined;

  private constructor(data: Data, update: (data: Data) => void) {
    this.data = data;
    this.update = update;
  }

  static async init<Data extends Record<string, unknown>>(): Promise<
    ConfigStorage<Data>
  > {
    return new Promise((resolve) => {
      sendMessageToBackground({
        message: { type: "loadConfig", data: null },
        handleSuccess: (result) => {
          const store = new ConfigStorage(result, (data) =>
            sendMessageToBackground({
              message: { type: "saveConfig", data },
            })
          );
          resolve(store);
        },
      });
    });
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

  static async getStore(): Promise<ConfigStorage<ToastConfig>> {
    if (!ToastConfigStorageBuilder.instance) {
      ToastConfigStorageBuilder.instance =
        await ConfigStorage.init<ToastConfig>();
    }
    return ToastConfigStorageBuilder.instance;
  }
}
