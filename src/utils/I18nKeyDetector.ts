import { Position, Range, TextDocument } from "vscode";

class I18nTransformer {
  /**
   * find a i18n.translation call at position and return its range
   * @param position position to look for the i18n call
   * @param document current document
   */
  public static getRangeOfI18nKeyAtPosition(
    position: Position,
    document: TextDocument
  ): Range | undefined {
    let i18nCallRegex = /(tUpper|i18n.t)[\(\s]+[\"\'][\w-\.\/]+[\"\'\.]\)?/g;
    return document.getWordRangeAtPosition(position, i18nCallRegex);
  }

  /**
   * get the i18n key as text from i18n call range
   * @param range range where i18n call occurs
   * @param document current document
   */
  public static getI18nKeyAtRangeFromDocument(
    range: Range,
    document: TextDocument
  ): string {
    return document
      .getText(range)
      .replace(/\"|\'|(tUpper|i18n.t)[\(\s]+|\)/g, "");
  }
}

export default I18nTransformer;
