import * as vscode from "vscode";
import UserConf from "./conf";
import I18nHoverProvider from "./core/I18nHoverProvider";
import I18nLocalesDetector from "./utils/I18nLocalesDetector";

function initI18n() {
  let fileSystemWatcher: vscode.FileSystemWatcher;

  let watchFile = () => {
    fileSystemWatcher?.dispose();
    fileSystemWatcher = vscode.workspace.createFileSystemWatcher(
      `**/${UserConf.getLocales()}/*.json`
    );
    fileSystemWatcher.onDidChange(I18nLocalesDetector.init);
  };
  I18nLocalesDetector.init();
  watchFile();
  vscode.workspace.onDidChangeConfiguration(() => {
    I18nLocalesDetector.init();
    watchFile();
  });
}

export async function activate(context: vscode.ExtensionContext) {
  // init i18n resource
  initI18n();
  // register I18nHoverProvider
  let hover = vscode.languages.registerHoverProvider(
    ["javascript", "javascriptreact", "typescriptreact", "typescript"],
    new I18nHoverProvider()
  );
  context.subscriptions.push(hover);
}

export function deactivate() {}
