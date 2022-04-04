import {
  HoverProvider,
  ProviderResult,
  Hover,
  TextDocument,
  Position,
  CancellationToken,
} from "vscode";
import I18nTransformer from "../utils/I18nKeyDetector";
import I18nLocalesDetector from "../utils/I18nLocalesDetector";

class I18nHoverProvider implements HoverProvider {
  provideHover(
    document: TextDocument,
    position: Position,
    _token: CancellationToken
  ): ProviderResult<Hover> {
    const range = I18nTransformer.getRangeOfI18nKeyAtPosition(
      position,
      document
    );
    if (range) {
      const word = I18nTransformer.getI18nKeyAtRangeFromDocument(
        range,
        document
      );
      return new Hover(
        I18nLocalesDetector.getI18nTranslation(word).map((item) =>
          item.join(": ")
        )
      );
    }
    return null;
  }
}

export default I18nHoverProvider;
