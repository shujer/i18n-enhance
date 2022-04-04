import { workspace, WorkspaceConfiguration } from "vscode";

class UserConf {
  private configuation: WorkspaceConfiguration;
  constructor() {
    this.configuation = workspace.getConfiguration("vscode-i18n-kit");
    workspace.onDidChangeConfiguration(() => {
      this.configuation = workspace.getConfiguration("vscode-i18n-kit");
    });
  }
  /**
   * @desc get i18n local files {lng}.json
   * @returns string
   */
  getLocales() {
    return this.configuation.get("locales", "assets/strings/i18n");
  }
  /**
   * @desc get i18n supported languages
   * @returns Array
   */
  getLanguageIds() {
    return this.configuation.get("lng", "en,id")?.split(",") || [];
  }
}

export default new UserConf();
