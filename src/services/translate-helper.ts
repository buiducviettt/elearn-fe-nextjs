import { GET } from "./http";
import { TBaseResponse } from "@/types/response";

export const translateHelperService = {
    // Dịch từ
    translateWord(word: string) {
        return GET(
            `/v1/translation/translate-word?word=${encodeURIComponent(word)}`
        );
    },
    // Dịch câu
    translateSentence(sentence: string) {
        return GET(
            `/v1/translation/translate-sentence?sentence=${encodeURIComponent(
                sentence
            )}`
        );
    },
    // Lấy thông tin từ điển
    dictionaryInfo(word: string) {
        return GET(
            `/v1/translation/dictionary-info?word=${encodeURIComponent(word)}`
        );
    },
};
