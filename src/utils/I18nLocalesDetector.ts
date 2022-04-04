import fs from "fs";
import { workspace, Uri } from "vscode";
import UserConf from "../conf";

const workspacefs = workspace.fs;

interface ILocales {
  [lng: string]: { [key: string]: string };
}

export let locales: ILocales = {};

class I18nLocalesDetector {
  constructor() {
    this.init = this.init.bind(this);
    this.getI18nLocales = this.getI18nLocales.bind(this);
    this.readI18nLocales = this.readI18nLocales.bind(this);
    this.getI18nTranslation = this.getI18nTranslation.bind(this);
  }
  public init() {
    this.readI18nLocales().then((res) => {
      locales = res;
    });
  }
  public getI18nLocales() {
    return locales;
  }
  public getI18nTranslation(key: string) {
    return Object.entries(locales).map(([lng, obj]) => [lng, obj?.[key]]);
  }
  /**
   * find a i18n.translation call at position and return its range
   * @param position position to look for the i18n call
   * @param document current document
   */
  public async readI18nLocales(): Promise<ILocales> {
    const workspaceFolders = workspace.workspaceFolders;
    const lngsConf = UserConf.getLanguageIds();
    const localesConf = UserConf.getLocales();

    const result: ILocales = {};
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return result;
    }
    for (const workspaceFolder of workspaceFolders) {
      const localeDir = Uri.joinPath(workspaceFolder.uri, localesConf);
      const localeFiles = await workspacefs.readDirectory(localeDir);
      for (let [localeFile] of localeFiles) {
        const localeFilePath = Uri.joinPath(localeDir, localeFile);
        const lng = /(.*).json/.exec(localeFile)?.[1];
        if (!lng || (lngsConf.length && !lngsConf.includes(lng))) {
          continue;
        }
        const content = fs.readFileSync(localeFilePath.fsPath, {
          encoding: "utf-8",
        });
        result[lng] = JSON.parse(content);
      }
    }
    return result;
  }
}
export default new I18nLocalesDetector();
