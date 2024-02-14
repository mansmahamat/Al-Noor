import WidgetModule from "./src/WidgetModule";

export function reloadAll(): void {
  return WidgetModule.reloadAll();
}
export function setItem(appGroup: string, key: string, value: any): void;
export function setItem(
  appGroup: string,
  key?: string,
  value?: any
): (key: string, value: any) => void;

export function setItem(appGroup: string, key?: string, value?: any) {
  if (typeof key !== "undefined" && typeof value !== "undefined") {
    return WidgetModule.setItem(value, key, appGroup);
  }
  return (key: string, value: any) =>
    WidgetModule.setItem(value, key, appGroup);
}

export function getItem(appGroup: string, key: string): string;
export function getItem(
  appGroup: string,
  key?: string
): (key: string) => string;

export function getItem(appGroup: string, key?: string) {
  if (typeof key !== "undefined") {
    return WidgetModule.getItem(key, appGroup);
  }
  return (key: string) => WidgetModule.getItem(key, appGroup);
}

export function setArray(appGroup: string, key: string, value: any[]): void;
export function setArray(
  appGroup: string,
  key?: string,
  value?: any[]
): (key: string, value: any[]) => void;

export function setArray(appGroup: string, key?: string, value?: any[]) {
  if (typeof key !== "undefined" && typeof value !== "undefined") {
    return WidgetModule.setItem(JSON.stringify(value), key, appGroup);
  }
  return (key: string, value: any[]) =>
    WidgetModule.setItem(JSON.stringify(value), key, appGroup);
}

export function getArray(appGroup: string, key: string): any[];
export function getArray(
  appGroup: string,
  key?: string
): (key: string) => any[];

export function getArray(appGroup: string, key?: string) {
  if (typeof key !== "undefined") {
    const value = WidgetModule.getItem(key, appGroup);
    return value ? JSON.parse(value) : [];
  }
  return (key: string) => {
    const value = WidgetModule.getItem(key, appGroup);
    return value ? JSON.parse(value) : [];
  };
}
