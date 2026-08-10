import React, { useState, useEffect, useRef } from "react";
import { Progress } from "antd";
import MyButton from "@/bases/MyButton";
import MyIconButton from "@/bases/MyIconButton";
import MyTooltip from "@/bases/MyTooltip";
import toastHandler from "@/utils/toastHandler";
import { Skeleton, Modal, Spin } from "antd";
import { translationService } from "@/services/translation";
import { translationSentenceService } from "@/services/translation-sentence";
import { translationWordService } from "@/services/translation-word";
import MyEmpty from "@/bases/MyEmpty";
import { CheckCircleFilled, SoundOutlined } from "@ant-design/icons";

type SentenceWords = string[];
type Paragraph = SentenceWords[];

interface Structure {
    translation_id?: number | string;
    content?: string;
    id?: number | string;
}
interface Form {
    getFieldValue: (field: string) => any;
    setFieldsValue: (fields: Record<string, any>) => void;
    setFieldValue?: (field: string, value: any) => void;
}

interface TranslationSectionProps {
    structure: Structure;
    indexStructure: number;
    form: Form;
    splitContentToSentencesAndWords: (content: string) => Paragraph[];
}

interface TranslationActionsProps {
    onReload: () => void;
    onDelete: () => void;
    disabled?: boolean;
}

interface TranslationSentence {
    id: number | string;
    words: (string | { id?: string | number; word: string })[];
    explanation?: string;
}

interface TranslationParagraph {
    sentences: TranslationSentence[];
}

const TranslationActions: React.FC<TranslationActionsProps> = ({
    onReload,
    onDelete,
    disabled,
}) => (
    <div className="translation-gr flex gap-2">
        <MyTooltip title="Tạo lại bản dịch">
            <MyIconButton
                icon="ADD"
                color="GREEN"
                style={{ padding: "8px" }}
                onClick={onReload}
                disabled={disabled}
            />
        </MyTooltip>
        <MyTooltip title="Xóa bản dịch">
            <MyIconButton
                icon="DELETE"
                color="RED"
                style={{ padding: "8px" }}
                onClick={onDelete}
                disabled={disabled}
            />
        </MyTooltip>
    </div>
);

const parseTranslation = (translation: string): TranslationParagraph[] => {
    const paragraphs: TranslationParagraph[] = [];
    if (!translation) return paragraphs;
    const div = document.createElement("div");
    div.innerHTML = translation;
    const paraNodes = div.querySelectorAll(".translation-paragraph");
    paraNodes.forEach((paraNode) => {
        const sentences: TranslationSentence[] = [];
        const sentenceNodes = paraNode.querySelectorAll(
            ".translation-sentence"
        );
        sentenceNodes.forEach((sentenceNode) => {
            const sentenceId =
                sentenceNode.getAttribute("data-sentence_id") || "";
            const wordNodes =
                sentenceNode.querySelectorAll(".translation-word");
            const words: { id?: string; word: string }[] = [];
            wordNodes.forEach((wordNode) => {
                words.push({
                    id: wordNode.getAttribute("data-word_id") || undefined,
                    word: wordNode.textContent || "",
                });
            });
            sentences.push({ id: sentenceId, words, explanation: undefined });
        });
        paragraphs.push({ sentences });
    });
    return paragraphs;
};

const TranslationSection: React.FC<TranslationSectionProps> = ({
    structure,
    indexStructure,
    form,
    splitContentToSentencesAndWords,
}) => {
    const [translationLoading, setTranslationLoading] =
        useState<boolean>(false);
    const translationDoneRef = useRef(false);
    const [tempTranslation, setTempTranslation] = useState<
        TranslationParagraph[] | undefined
    >(undefined);
    const [sentenceExplanations, setSentenceExplanations] = useState<
        Record<string, string>
    >({});
    const [savingSentenceId, setSavingSentenceId] = useState<
        string | number | null
    >(null);
    const [editingSentenceId, setEditingSentenceId] = useState<
        string | number | null
    >(null);
    const [translationHtml, setTranslationHtml] = useState<string>("");
    const [isFetchingTranslation, setIsFetchingTranslation] = useState(false);
    const [deletingTranslation, setDeletingTranslation] = useState(false);
    const MIN_LOADING_TIME = 3 * 60 * 1000;
    const percentRef = useRef(0);
    const finishedRef = useRef(false);
    const [progressVisible, setProgressVisible] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const progressTimer = useRef<NodeJS.Timeout | null>(null);

    const [editingValue, setEditingValue] = useState<string>("");
    const [editingWord, setEditingWord] = useState(false);
    const [editWordFields, setEditWordFields] = useState<any>({});
    const loadingSentences = useRef<Record<string, boolean>>({});
    const [wordDictionaryCache, setWordDictionaryCache] = useState<
        Record<string, any>
    >({});

    const [loadingParagraphs, setLoadingParagraphs] = useState<
        Paragraph[] | null
    >(null);
    const [wordModal, setWordModal] = useState<{
        open: boolean;
        word: string;
        data?: any;
        loading?: boolean;
        originSentence?: string;
        translatedSentence?: string;
    }>({
        open: false,
        word: "",
        data: null,
        loading: false,
        originSentence: "",
        translatedSentence: "",
    });
    useEffect(() => {
        async function fetchTranslation() {
            if (structure?.translation_id) {
                setIsFetchingTranslation(true);
                try {
                    const res = await translationService.get(
                        structure.translation_id
                    );
                    const translation = res?.payload?.data;
                    console.log("API trả về:", translation);
                    if (translation?.content) {
                        setTranslationHtml(translation.content);
                        setTempTranslation(undefined);
                    }
                } catch (err) {
                    setTranslationHtml("");
                } finally {
                    setIsFetchingTranslation(false);
                }
            }
        }
        if (structure?.translation_id) {
            fetchTranslation();
        }
    }, [structure?.translation_id]);
    // Lấy nghĩa cho các câu chưa có
    useEffect(() => {
        let paragraphs: TranslationParagraph[] = [];
        try {
            if (tempTranslation) {
                paragraphs = tempTranslation;
            } else if (translationHtml) {
                paragraphs = JSON.parse(translationHtml);
            }
        } catch {
            paragraphs = parseTranslation(translationHtml || "");
        }
        const sentenceIds: (string | number)[] = [];
        paragraphs.forEach((para) => {
            para.sentences.forEach((sentence) => {
                if (
                    sentence.id &&
                    sentenceExplanations[sentence.id] === undefined
                ) {
                    sentenceIds.push(sentence.id);
                }
            });
        });
        sentenceIds.forEach((id) => {
            fetchSentenceExplanation(id);
        });
        // eslint-disable-next-line
    }, [tempTranslation, translationHtml]);

    const startProgress = () => {
        setProgressVisible(true);
        setProgressPercent(0);
        percentRef.current = 0;
        finishedRef.current = false;
        translationDoneRef.current = false;
        if (progressTimer.current) clearInterval(progressTimer.current);

        const interval = MIN_LOADING_TIME / 95;
        progressTimer.current = setInterval(() => {
            percentRef.current += 1;
            setProgressPercent(percentRef.current);
            if (percentRef.current >= 95) {
                clearInterval(progressTimer.current!);
                finishedRef.current = true;
                // Nếu dịch đã xong thì finish luôn
                if (translationDoneRef.current) {
                    setProgressPercent(100);
                    setTimeout(() => setProgressVisible(false), 500);
                }
            }
        }, interval);
    };

    const finishProgress = () => {
        translationDoneRef.current = true;
        if (percentRef.current >= 95) {
            setProgressPercent(100);
            setTimeout(() => setProgressVisible(false), 500);
        } else {
            // Nếu chưa tới 95%, cho chạy nhanh lên 100%
            if (progressTimer.current) clearInterval(progressTimer.current);
            const current = percentRef.current;
            const step = () => {
                if (percentRef.current < 100) {
                    percentRef.current += 5;
                    setProgressPercent(percentRef.current);
                    setTimeout(step, 20);
                } else {
                    setProgressPercent(100);
                    setTimeout(() => setProgressVisible(false), 500);
                }
            };
            step();
        }
    };
    // Hàm lấy nghĩa câu
    const fetchSentenceExplanation = async (sentenceId: string | number) => {
        if (!sentenceId || loadingSentences.current[sentenceId]) return "";
        loadingSentences.current[sentenceId] = true;
        try {
            const res = await translationSentenceService.get(sentenceId);
            let explanation = "";
            const payloadData = res?.payload?.data;
            if (payloadData) {
                explanation = payloadData?.explanation ?? "";
            }
            setSentenceExplanations((prev) => ({
                ...prev,
                [sentenceId]: explanation,
            }));
            return explanation;
        } catch {
            setSentenceExplanations((prev) => ({
                ...prev,
                [sentenceId]: "",
            }));
            return "";
        }
    };
    const handleEditClick = (sentenceId: string | number) => {
        setEditingSentenceId(sentenceId);
        setEditingValue(sentenceExplanations[sentenceId] || "");
    };
    // lưu câu
    const handleSaveEdit = async (sentenceId: string | number) => {
        setSavingSentenceId(sentenceId);
        try {
            await translationSentenceService.update(sentenceId, {
                explanation: editingValue,
            });
            setSentenceExplanations((prev) => ({
                ...prev,
                [sentenceId]: editingValue,
            }));
            // Cập nhật translationHtml với nghĩa câu mới
            let paragraphs: TranslationParagraph[] = [];
            try {
                if (tempTranslation) {
                    paragraphs = tempTranslation;
                } else if (translationHtml) {
                    paragraphs = JSON.parse(translationHtml);
                }
            } catch {
                paragraphs = parseTranslation(translationHtml || "");
            }
            // Gán lại explanation mới cho đúng câu
            paragraphs.forEach((para) => {
                para.sentences.forEach((sentence) => {
                    if (sentence.id === sentenceId) {
                        sentence.explanation = editingValue;
                    }
                });
            });
            // Lưu lại vào translationHtml (dạng JSON)
            const newHtml = JSON.stringify(paragraphs);
            setTranslationHtml(newHtml);
            // Gọi API update translation content
            if (structure?.translation_id) {
                await translationService.update(structure.translation_id, {
                    content: newHtml,
                });
            }
            toastHandler.success("Cập nhật dịch nghĩa thành công!");
        } catch {
            toastHandler.error("Cập nhật dịch nghĩa thất bại!");
        }
        setEditingSentenceId(null);
        setEditingValue("");
        setSavingSentenceId(null);
    };
    // chỉnh từ
    const handleEditWord = () => {
        setEditingWord(true);
        setEditWordFields({
            content: wordModal.data?.content || "",
            explanation: wordModal.data?.explanation || "",
            phonetic: wordModal.data?.phonetic || "",
            part_of_speech: wordModal.data?.part_of_speech || "",
            related_words: Array.isArray(wordModal.data?.related_words)
                ? wordModal.data.related_words.join(", ")
                : wordModal.data?.related_words || "",
            examples: Array.isArray(wordModal.data?.examples)
                ? wordModal.data.examples
                      .map(
                          (ex: any) =>
                              `${ex.definition || ""}|${ex.example || ""}|${
                                  ex.example_vietnamese || ""
                              }`
                      )
                      .join("\n")
                : "",
        });
    };

    // lưu từ
    const handleSaveWordEdit = async () => {
        if (!wordModal.data?.id) return;
        try {
            await translationWordService.update(wordModal.data.id, {
                id: wordModal.data.id,
                sentence_id: wordModal.data.sentence_id,
                content: editWordFields.content,
                explanation: editWordFields.explanation,
                phonetic: editWordFields.phonetic,
                part_of_speech: editWordFields.part_of_speech,
                related_words: Array.isArray(editWordFields.related_words)
                    ? editWordFields.related_words
                    : editWordFields.related_words
                          .split(",")
                          .map((w: string) => w.trim())
                          .filter((w: string) => w),
                examples: Array.isArray(editWordFields.examples)
                    ? editWordFields.examples
                    : editWordFields.examples
                          .split("\n")
                          .map((line: string) => {
                              const [definition, example, example_vietnamese] =
                                  line.split("|");
                              return {
                                  definition,
                                  example,
                                  example_vietnamese,
                              };
                          })
                          .filter((ex: any) => ex.example),
            });
            toastHandler.success("Cập nhật từ điển thành công!");
            setWordDictionaryCache((prev) => ({
                ...prev,
                [wordModal.data.id]: {
                    id: wordModal.data.id,
                    sentence_id: wordModal.data.sentence_id,
                    content: editWordFields.content,
                    explanation: editWordFields.explanation,
                    phonetic: editWordFields.phonetic,
                    part_of_speech: editWordFields.part_of_speech,
                    related_words: Array.isArray(editWordFields.related_words)
                        ? editWordFields.related_words
                        : editWordFields.related_words
                              .split(",")
                              .map((w: string) => w.trim())
                              .filter((w: string) => w),
                    examples: Array.isArray(editWordFields.examples)
                        ? editWordFields.examples
                        : editWordFields.examples
                              .split("\n")
                              .map((line: string) => {
                                  const [
                                      definition,
                                      example,
                                      example_vietnamese,
                                  ] = line.split("|");
                                  return {
                                      definition,
                                      example,
                                      example_vietnamese,
                                  };
                              })
                              .filter((ex: any) => ex.example),
                },
            }));
            setEditingWord(false);
            setWordModal({ ...wordModal, open: false });
        } catch {
            toastHandler.error("Cập nhật từ điển thất bại!");
        }
    };

    // chỉnh từ
    const handleWordClick = async (
        wordId?: string | number,
        sentenceId?: string | number,
        wordDisplay?: string
    ) => {
        if (!wordId || !sentenceId) return;

        // Lấy dữ liệu câu từ cache hoặc gọi lại API
        const sentenceData = {
            content: "",
            explanation: "",
        };
        if (sentenceExplanations[sentenceId] !== undefined) {
            // Đã có nghĩa câu trong cache
            sentenceData.explanation = sentenceExplanations[sentenceId];
            // Tìm content câu từ tempTranslation hoặc translationHtml
            let paragraphs: TranslationParagraph[] = [];
            try {
                if (tempTranslation) {
                    paragraphs = tempTranslation;
                } else if (translationHtml) {
                    paragraphs = JSON.parse(translationHtml);
                }
            } catch {
                paragraphs = parseTranslation(translationHtml || "");
            }
            for (const para of paragraphs) {
                for (const sentence of para.sentences) {
                    if (sentence.id === sentenceId) {
                        sentenceData.content = sentence.words
                            .map((w) => (typeof w === "string" ? w : w.word))
                            .join(" ");
                        break;
                    }
                }
            }
        } else {
            // Nếu chưa có thì gọi lại API lấy câu
            try {
                const res = await translationSentenceService.get(sentenceId);
                const payloadData = res?.payload?.data;
                sentenceData.content = payloadData?.content ?? "";
                sentenceData.explanation = payloadData?.explanation ?? "";
            } catch {
                // fallback
            }
        }

        // Nếu đã có dữ liệu từ điển trong cache thì dùng luôn, không gọi lại API
        if (wordDictionaryCache[wordId]) {
            setWordModal({
                open: true,
                word:
                    wordDictionaryCache[wordId]?.content ||
                    wordDictionaryCache[wordId]?.word ||
                    wordDisplay ||
                    "",
                data: wordDictionaryCache[wordId],
                loading: false,
                originSentence: sentenceData.content,
                translatedSentence: sentenceData.explanation,
            });
            return;
        }

        setWordModal({
            open: true,
            word: wordDisplay || "",
            data: null,
            loading: true,
            originSentence: sentenceData.content,
            translatedSentence: sentenceData.explanation,
        });

        try {
            const dictRes = await translationWordService.get(wordId);
            const dictData = dictRes?.payload?.data ?? dictRes?.payload ?? null;
            setWordDictionaryCache((prev) => ({
                ...prev,
                [wordId]: dictData,
            }));
            setWordModal({
                open: true,
                word: dictData?.content,
                data: dictData,
                loading: false,
                originSentence: sentenceData.content,
                translatedSentence: sentenceData.explanation,
            });
        } catch (err) {
            setWordModal({
                open: true,
                word: wordDisplay || "",
                data: null,
                loading: false,
                originSentence: sentenceData.content,
                translatedSentence: sentenceData.explanation,
            });
        }
    };

    function removeInputInline(html: string): string {
        return html.replace(
            /<span[^>]*class=["']input-Inline["'][^>]*>.*?<\/span>/g,
            ""
        );
    }

    const handleCreateTranslation = async (): Promise<void> => {
        startProgress();
        setTranslationLoading(true);

        // Thêm log thời gian bắt đầu
        const startTime = Date.now();
        console.log(
            "Bắt đầu dịch lúc:",
            new Date(startTime).toLocaleTimeString()
        );

        // Nếu có translation_id thì xóa bản dịch cũ trước
        if (structure?.translation_id) {
            try {
                await translationService.delete(structure.translation_id);
            } catch (err) {
                // Có thể log hoặc bỏ qua lỗi xóa
                console.warn("Không thể xóa bản dịch cũ:", err);
            }
        }

        const cleanedContent = removeInputInline(structure?.content || "");
        let paragraphs = splitContentToSentencesAndWords(cleanedContent);

        paragraphs = paragraphs
            .map((para) =>
                para.filter(
                    (sentenceArr) =>
                        !sentenceArr.join(" ").includes("input-Inline")
                )
            )
            .filter((para) => para.length > 0);

        setLoadingParagraphs(paragraphs);

        try {
            const res = await translationService.create({
                content: structure?.content || "",
                questionnaire_id: form?.getFieldValue("questionnaire_id"),
            });
            const translation = res?.payload?.data;

            if (!translation?.id)
                throw new Error("Không lấy được translation id");

            const translationParagraphs: TranslationParagraph[] = [];
            for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
                const para = paragraphs[pIdx];

                // Tạo tất cả câu trong đoạn song song
                const sentenceResults = await Promise.all(
                    para.map((sentenceWords) =>
                        translationSentenceService.create({
                            translation_id: translation.id,
                            content: sentenceWords.join(" "),
                        })
                    )
                );

                // Tạo từ cho từng câu song song
                const sentences: TranslationSentence[] = await Promise.all(
                    sentenceResults.map(async (sentenceRes, sIdx) => {
                        const sentence = sentenceRes?.payload?.data;
                        if (!sentence?.id)
                            throw new Error("Không lấy được sentence id");
                        const words = await Promise.all(
                            para[sIdx].map(async (w) => {
                                try {
                                    const res =
                                        await translationWordService.create({
                                            sentence_id: sentence.id,
                                            content: w,
                                        });
                                    const wordItem = res?.payload?.data;
                                    // Thêm log id từ vừa tạo
                                    console.log(
                                        "Tạo từ:",
                                        w,
                                        "-> id:",
                                        wordItem?.id
                                    );
                                    return {
                                        id: wordItem.id,
                                        word: wordItem.content || w,
                                    };
                                } catch (err) {
                                    return { id: undefined, word: w };
                                }
                            })
                        );
                        // Gọi API dịch nghĩa câu ngay sau khi tạo câu
                        fetchSentenceExplanation(sentence.id);
                        return { id: sentence.id, words };
                    })
                );

                translationParagraphs[pIdx] = { sentences };
            }
            function renderTranslationHtml(
                paragraphs: TranslationParagraph[]
            ): string {
                return paragraphs
                    .map(
                        (para, idx) => `
<div class="translation-paragraph">
    <h3>Đoạn ${idx + 1}:</h3>
    ${para.sentences
        .map(
            (sentence, sIdx) => `
                <span class="translation-sentence" data-sentence_id="${
                    sentence.id
                }">
                    <span>
                        ${sentence.words
                            .map(
                                (wordObj) =>
                                    // Luôn là object, không còn string
                                    `<span class="translation-word" data-word_id="${
                                        (wordObj as any).id
                                    }">${(wordObj as any).word}</span>`
                            )
                            .join(" ")}
                    </span>
                </span>
            `
        )
        .join("")}
</div>
`
                    )
                    .join("");
            }
            const translationHtml = renderTranslationHtml(
                translationParagraphs
            );

            await translationService.update(translation.id, {
                content: translationHtml,
            });
            console.log("Translation after update:", {
                id: translation.id,
                content: translationHtml,
            });
            const oldArr = form.getFieldValue("questionnaire_structure") || [];
            const newArr = oldArr.map((item, idx) =>
                idx === indexStructure
                    ? {
                          ...item,
                          translation_id: translation.id,
                      }
                    : item
            );
            form.setFieldsValue({ questionnaire_structure: newArr });

            setLoadingParagraphs(null);
            toastHandler.success("Tạo bản dịch thành công!");
        } catch (error) {
            toastHandler.error("Tạo bản dịch thất bại!");
        } finally {
            setTranslationLoading(false);
            finishProgress();

            // Thêm log thời gian kết thúc và tổng thời gian
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            console.log(
                "Kết thúc dịch lúc:",
                new Date(endTime).toLocaleTimeString(),
                "| Tổng thời gian dịch (giây):",
                duration
            );
        }
    };

    const handleDeleteTranslation = async (): Promise<void> => {
        setDeletingTranslation(true); // Bắt đầu loading
        // Xóa translation trên server
        if (structure?.translation_id) {
            try {
                await translationService.delete(structure.translation_id);
            } catch (err) {
                toastHandler.error("Xóa bản dịch thất bại!");
            }
        }
        // Xóa translation_id trong structure
        const questionnaireStructure = form?.getFieldValue(
            "questionnaire_structure"
        );
        questionnaireStructure[indexStructure] = {
            ...questionnaireStructure[indexStructure],
            translation_id: null,
        };
        if (form?.setFieldValue) {
            form.setFieldValue(
                "questionnaire_structure",
                questionnaireStructure
            );
        }
        setTempTranslation(undefined);
        setTranslationHtml("");
        setDeletingTranslation(false); // Kết thúc loading
    };
    const handleReloadTranslation = async () => {
        setDeletingTranslation(true); // Disable nút khi reload
        if (structure?.translation_id) {
            try {
                await translationService.delete(structure.translation_id);
            } catch (err) {
                toastHandler.error("Xóa bản dịch cũ thất bại!");
            }
            // Xóa translation_id trong structure
            const questionnaireStructure = form?.getFieldValue(
                "questionnaire_structure"
            );
            questionnaireStructure[indexStructure] = {
                ...questionnaireStructure[indexStructure],
                translation_id: null,
            };
            if (form?.setFieldValue) {
                form.setFieldValue(
                    "questionnaire_structure",
                    questionnaireStructure
                );
            }
            setTempTranslation(undefined);
            setTranslationHtml("");
        }
        await handleCreateTranslation();
        setDeletingTranslation(false); // Kết thúc loading
    };
    const renderTranslation = (translation?: string) => {
        let paragraphs: TranslationParagraph[] = [];
        try {
            if (translation) {
                paragraphs = JSON.parse(translation);
            }
        } catch {
            paragraphs = parseTranslation(translation || "");
        }
        if (!paragraphs.length && translation) {
            paragraphs = parseTranslation(translation);
        }
        return (
            <div className="translation-prose p-4 max-h-[700px] overflow-auto space-y-4">
                {paragraphs.map((para, idx) => (
                    <div
                        key={idx}
                        className="translation-paragraph mb-2 p-4 rounded-lg border border-dashed border-green-200 bg-green-50"
                    >
                        <h3 className="font-semibold mb-2">Đoạn {idx + 1}:</h3>
                        {para.sentences
                            .filter(
                                (sentence) =>
                                    !sentence.words
                                        .map((w) =>
                                            typeof w === "string" ? w : w.word
                                        )
                                        .join(" ")
                                        .includes("input-Inline")
                            )
                            .map((sentence, sIdx) => (
                                <span
                                    key={sIdx}
                                    className="translation-sentence w-full flex flex-col mb-2 p-4 rounded border border-green-300 bg-green-100 hover:bg-green-200 transition-colors cursor-pointer"
                                    data-sentence_id={sentence.id}
                                >
                                    {/* Title + Edit button */}
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-green-700">
                                            Câu {sIdx + 1}
                                        </span>
                                        <MyButton
                                            size="small"
                                            onClick={() =>
                                                handleEditClick(sentence.id)
                                            }
                                            style={{ marginLeft: 8 }}
                                        >
                                            Chỉnh sửa
                                        </MyButton>
                                    </div>
                                    {/* Words */}
                                    <span className="flex flex-wrap gap-2 mb-2">
                                        {sentence.words.map((wordObj, wIdx) => {
                                            // Luôn lấy id từ wordObj nếu có
                                            const wordId =
                                                typeof wordObj === "string"
                                                    ? undefined
                                                    : wordObj.id;
                                            const wordText =
                                                typeof wordObj === "string"
                                                    ? wordObj
                                                    : wordObj.word;
                                            return (
                                                <span
                                                    key={wIdx}
                                                    className="translation-word px-3 py-1 rounded border border-green-300 bg-green-100 hover:bg-green-200 transition-colors cursor-pointer"
                                                    data-word_id={wordId}
                                                    onClick={() =>
                                                        handleWordClick(
                                                            wordId,
                                                            sentence.id,
                                                            wordText
                                                        )
                                                    }
                                                >
                                                    {wordText}
                                                </span>
                                            );
                                        })}
                                    </span>
                                    {/* ...existing code... */}
                                </span>
                            ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="relative">
            {progressVisible && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
                        <Progress
                            type="circle"
                            percent={progressPercent}
                            status={
                                progressPercent < 100 ? "active" : "success"
                            }
                            format={(percent) => `${percent}%`}
                        />
                        <div className="mt-4 font-semibold text-lg text-gray-700">
                            Đang tạo bản dịch...
                        </div>
                    </div>
                </div>
            )}
            {!structure?.translation_id ? (
                <div className="min-h-[300px] border border-gray-300 p-4">
                    {!translationLoading && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <MyEmpty />
                            <p className="mb-4 text-gray-500 text-base font-bold">
                                Chưa có bản dịch cho đoạn này.
                            </p>
                            <MyButton
                                type="primary"
                                loading={translationLoading}
                                onClick={handleCreateTranslation}
                            >
                                Tạo bản dịch
                            </MyButton>
                        </div>
                    )}
                    {translationLoading && (
                        <div className="translation border border-gray-300">
                            <div className="translation-head flex justify-between items-center gap-2 p-4 bg-gray-100 ">
                                <p className="translation-head-title text-xl font-bold">
                                    Đang tạo bản dịch...
                                </p>
                            </div>
                            <div className="translation-prose p-4 max-h-[700px] overflow-auto">
                                {(loadingParagraphs || []).map((para, pIdx) => (
                                    <div
                                        key={pIdx}
                                        className="translation-paragraph mb-2 p-4 rounded-lg border border-dashed border-green-200 bg-green-50"
                                    >
                                        <h3 className="font-semibold mb-2">
                                            Đoạn {pIdx + 1}:
                                        </h3>

                                        {(
                                            tempTranslation?.[pIdx]
                                                ?.sentences || []
                                        ).map((sentence, sIdx) => (
                                            <span
                                                key={sIdx}
                                                className="translation-sentence flex flex-col w-full mb-2 p-4 rounded border border-green-300 bg-green-100 hover:bg-green-200 transition-colors cursor-pointer"
                                                data-sentence_id={sentence.id}
                                            >
                                                <span className=" flex flex-wrap gap-2 mb-2">
                                                    {sentence.words.map(
                                                        (word, wIdx) => (
                                                            <span
                                                                key={wIdx}
                                                                className="translation-word px-3 py-1 rounded border border-green-300 bg-green-100 hover:bg-green-200 transition-colors cursor-pointer"
                                                                data-word_id={
                                                                    typeof word ===
                                                                    "string"
                                                                        ? wIdx
                                                                        : word.id
                                                                }
                                                                onClick={() =>
                                                                    handleWordClick(
                                                                        typeof word ===
                                                                            "string"
                                                                            ? wIdx.toString()
                                                                            : word.id,
                                                                        sentence.id,
                                                                        typeof word ===
                                                                            "string"
                                                                            ? word
                                                                            : word.word
                                                                    )
                                                                }
                                                            >
                                                                {typeof word ===
                                                                "string"
                                                                    ? word
                                                                    : word.word}
                                                            </span>
                                                        )
                                                    )}
                                                </span>
                                                <span
                                                    className="translation-sentence-bdy p-4 bg-white rounded border border-gray-200"
                                                    onDoubleClick={() =>
                                                        handleEditClick(
                                                            sentence.id
                                                        )
                                                    }
                                                >
                                                    <div className="head">
                                                        <p className="text-sm font-semibold mb-2">
                                                            Dịch nghĩa Câu:
                                                        </p>
                                                    </div>
                                                    <div className="bdy">
                                                        {sentenceExplanations[
                                                            sentence.id
                                                        ] !== undefined ? (
                                                            <span>
                                                                {sentenceExplanations[
                                                                    sentence.id
                                                                ] || (
                                                                    <span className="text-gray-400">
                                                                        Chưa có
                                                                        dịch
                                                                        nghĩa
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <Skeleton
                                                                active
                                                                paragraph={{
                                                                    rows: 1,
                                                                }}
                                                                title={false}
                                                                style={{
                                                                    margin: "8px 0",
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </span>
                                            </span>
                                        ))}
                                        {para
                                            .slice(
                                                tempTranslation?.[pIdx]
                                                    ?.sentences?.length || 0
                                            )
                                            .map((sentenceWords, sIdx) => (
                                                <span
                                                    key={
                                                        sIdx +
                                                        (tempTranslation?.[pIdx]
                                                            ?.sentences
                                                            ?.length || 0)
                                                    }
                                                    className="translation-sentence mr-2 w-full"
                                                >
                                                    <Skeleton.Input
                                                        active
                                                        style={{
                                                            width: 500,
                                                            maxWidth: "100%",
                                                            height: 30,
                                                            margin: "2px 0",
                                                        }}
                                                    />
                                                </span>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {tempTranslation && !translationLoading && (
                        <div className="translation border border-gray-300">
                            <div className="translation-head flex justify-between items-center gap-2 p-4 bg-gray-100 ">
                                <div className="flex gap-2 items-center">
                                    <p className="translation-head-title font-bold text-base">
                                        Bản dịch số{" "}
                                        {structure?.translation_id
                                            ? structure.translation_id
                                            : ""}
                                    </p>
                                    <span className="inline-flex items-center gap-2 px-4 py-1 rounded-2xl font-semibold text-green-700 bg-green-50 border border-green-200 shadow-sm ml-2">
                                        <CheckCircleFilled className="text-green-500 text-xl" />
                                        Đã dịch
                                    </span>
                                </div>
                                <TranslationActions
                                    onReload={() =>
                                        setTempTranslation(undefined)
                                    }
                                    onDelete={handleDeleteTranslation}
                                    disabled={
                                        deletingTranslation ||
                                        translationLoading
                                    }
                                />
                            </div>
                            {renderTranslation(JSON.stringify(tempTranslation))}
                        </div>
                    )}
                </div>
            ) : isFetchingTranslation ? (
                <div className="flex justify-center items-center py-10">
                    <Spin tip="Đang tải bản dịch..." size="large" />
                </div>
            ) : (
                <div className="translation border border-gray-300">
                    <div className="translation-head flex justify-between items-center gap-2 p-4 bg-gray-100 ">
                        <div className="flex gap-2 items-center">
                            <p className="translation-head-title font-bold text-base">
                                Bản dịch số{" "}
                                {structure?.translation_id
                                    ? structure.translation_id
                                    : ""}
                            </p>
                            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-2xl font-semibold text-green-700 bg-green-50 border border-green-200 shadow-sm ml-2">
                                <CheckCircleFilled className="text-green-500 text-xl" />
                                Đã dịch
                            </span>
                        </div>
                        <TranslationActions
                            onReload={() => setTempTranslation(undefined)}
                            onDelete={handleDeleteTranslation}
                            disabled={deletingTranslation || translationLoading}
                        />
                    </div>
                    {renderTranslation(
                        tempTranslation
                            ? JSON.stringify(tempTranslation)
                            : translationHtml
                    )}
                </div>
            )}

            <Modal
                open={wordModal.open}
                onCancel={() => {
                    setWordModal({ ...wordModal, open: false });
                    setEditingWord(false);
                }}
                footer={null}
                title={
                    <div className="flex items-center justify-between gap-2 pr-5">
                        <div className="flex items-center gap-2">
                            <b style={{ fontSize: 24 }}>
                                {wordModal.data?.content ||
                                    wordModal.data?.word ||
                                    wordModal.word}
                            </b>
                            <SoundOutlined
                                className="text-green-500 cursor-pointer w-[32px] text-xl bg-slate-400/10 p-2 flex-shrink-0 rounded-full hover:bg-slate-400/20 transition"
                                onClick={() => {
                                    if (window.speechSynthesis) {
                                        const utter =
                                            new window.SpeechSynthesisUtterance(
                                                wordModal.data?.content ||
                                                    wordModal.data?.word ||
                                                    wordModal.word
                                            );
                                        utter.lang = "en-US";
                                        window.speechSynthesis.speak(utter);
                                    }
                                }}
                            />
                        </div>
                        {!editingWord ? (
                            <MyButton
                                type="primary"
                                size="small"
                                onClick={handleEditWord}
                            >
                                Chỉnh sửa
                            </MyButton>
                        ) : (
                            <div className="flex gap-2">
                                <MyButton
                                    type="primary"
                                    size="small"
                                    onClick={handleSaveWordEdit}
                                >
                                    Lưu
                                </MyButton>
                                <MyButton
                                    size="small"
                                    onClick={() => setEditingWord(false)}
                                >
                                    Hủy
                                </MyButton>
                            </div>
                        )}
                    </div>
                }
                width={1000}
                style={{ maxWidth: "90vw" }}
            >
                {(() => {
                    let data = wordModal.data;
                    if (Array.isArray(data)) data = data[0];

                    if (wordModal.loading) {
                        return (
                            <div className="text-center py-8">
                                <Spin />
                                <div className="mt-4 text-gray-500">
                                    Đang lấy dữ liệu từ điển...
                                </div>
                            </div>
                        );
                    }

                    if (!data) {
                        return (
                            <>
                                <MyEmpty />
                                <div className="text-center text-gray-500 py-8">
                                    Không tìm thấy dữ liệu.
                                </div>
                            </>
                        );
                    }

                    if (editingWord) {
                        // Chuẩn hóa dữ liệu cho từng trường
                        if (!Array.isArray(editWordFields.related_words)) {
                            editWordFields.related_words =
                                editWordFields.related_words
                                    ? editWordFields.related_words
                                          .split(",")
                                          .map((w: string) => w.trim())
                                          .filter((w: string) => w)
                                    : [];
                        }
                        if (!Array.isArray(editWordFields.examples)) {
                            editWordFields.examples = editWordFields.examples
                                ? editWordFields.examples
                                      .split("\n")
                                      .map((line: string) => {
                                          const [
                                              definition,
                                              example,
                                              example_vietnamese,
                                          ] = line.split("|");
                                          return {
                                              definition,
                                              example,
                                              example_vietnamese,
                                          };
                                      })
                                : [];
                        }

                        // Hàm thêm/xóa từ liên quan
                        const handleAddRelatedWord = () => {
                            setEditWordFields({
                                ...editWordFields,
                                related_words: [
                                    ...editWordFields.related_words,
                                    "",
                                ],
                            });
                        };
                        const handleRemoveRelatedWord = (idx: number) => {
                            setEditWordFields({
                                ...editWordFields,
                                related_words:
                                    editWordFields.related_words.filter(
                                        (_, i) => i !== idx
                                    ),
                            });
                        };
                        const handleChangeRelatedWord = (
                            idx: number,
                            value: string
                        ) => {
                            const arr = [...editWordFields.related_words];
                            arr[idx] = value;
                            setEditWordFields({
                                ...editWordFields,
                                related_words: arr,
                            });
                        };

                        // Hàm thêm/xóa ví dụ
                        const handleAddExample = () => {
                            setEditWordFields({
                                ...editWordFields,
                                examples: [
                                    ...editWordFields.examples,
                                    {
                                        definition: "",
                                        example: "",
                                        example_vietnamese: "",
                                    },
                                ],
                            });
                        };
                        const handleRemoveExample = (idx: number) => {
                            setEditWordFields({
                                ...editWordFields,
                                examples: editWordFields.examples.filter(
                                    (_, i) => i !== idx
                                ),
                            });
                        };
                        const handleChangeExample = (
                            idx: number,
                            field: string,
                            value: string
                        ) => {
                            const arr = [...editWordFields.examples];
                            arr[idx][field] = value;
                            setEditWordFields({
                                ...editWordFields,
                                examples: arr,
                            });
                        };

                        return (
                            <div className="max-h-[70vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-base font-semibold min-w-[80px]">
                                            Dịch nghĩa:
                                        </span>
                                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                                            <textarea
                                                className="w-full border rounded p-2"
                                                value={
                                                    editWordFields.explanation
                                                }
                                                onChange={(e) =>
                                                    setEditWordFields({
                                                        ...editWordFields,
                                                        explanation:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-base font-semibold min-w-[80px]">
                                            Phiên âm:
                                        </span>
                                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                                            <textarea
                                                className="w-full border rounded p-2"
                                                value={editWordFields.phonetic}
                                                onChange={(e) =>
                                                    setEditWordFields({
                                                        ...editWordFields,
                                                        phonetic:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-base font-semibold min-w-[80px]">
                                            Từ loại:
                                        </span>
                                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                                            <textarea
                                                className="w-full border rounded p-2"
                                                value={
                                                    editWordFields.part_of_speech
                                                }
                                                onChange={(e) =>
                                                    setEditWordFields({
                                                        ...editWordFields,
                                                        part_of_speech:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-base font-semibold min-w-[80px]">
                                            Từ liên quan:
                                        </span>
                                        <div className="flex flex-col gap-2">
                                            {editWordFields.related_words.map(
                                                (word: string, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm"
                                                    >
                                                        <input
                                                            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                                                            value={word}
                                                            onChange={(e) =>
                                                                handleChangeRelatedWord(
                                                                    idx,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Nhập từ liên quan"
                                                        />
                                                        <MyButton
                                                            danger
                                                            size="small"
                                                            className="ml-2"
                                                            onClick={() =>
                                                                handleRemoveRelatedWord(
                                                                    idx
                                                                )
                                                            }
                                                        >
                                                            Xóa
                                                        </MyButton>
                                                    </div>
                                                )
                                            )}
                                            <MyButton
                                                type="dashed"
                                                size="middle"
                                                className="mt-2 h-10 !border-green-300 !bg-green-50 !text-green-700 !rounded-lg hover:!bg-green-100 hover:!border-green-400 transition-all font-semibold flex items-center gap-2"
                                                onClick={handleAddRelatedWord}
                                            >
                                                + Thêm từ liên quan
                                            </MyButton>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-base font-semibold min-w-[80px]">
                                            Ví dụ:
                                        </span>
                                        <div className="flex flex-col gap-4">
                                            {editWordFields.examples.map(
                                                (ex: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="p-3 rounded-xl bg-gray-50 border border-gray-200 shadow-sm mb-4"
                                                    >
                                                        <div className="">
                                                            <label className="block font-semibold text-gray-700 mb-1">
                                                                Câu gốc:
                                                            </label>
                                                            <textarea
                                                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                                                                value={
                                                                    ex.definition
                                                                }
                                                                onChange={(e) =>
                                                                    handleChangeExample(
                                                                        idx,
                                                                        "definition",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Nhập câu gốc"
                                                                rows={2}
                                                            />
                                                        </div>
                                                        <div className="">
                                                            <label className="block font-semibold text-green-700 mb-1">
                                                                Ví dụ:
                                                            </label>
                                                            <textarea
                                                                className="border border-green-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                                                                value={
                                                                    ex.example
                                                                }
                                                                onChange={(e) =>
                                                                    handleChangeExample(
                                                                        idx,
                                                                        "example",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Nhập ví dụ"
                                                                rows={2}
                                                            />
                                                        </div>
                                                        <div className="">
                                                            <label className="block font-semibold text-green-700 mb-1">
                                                                Ví dụ dịch:
                                                            </label>
                                                            <textarea
                                                                className="border border-green-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                                                                value={
                                                                    ex.example_vietnamese
                                                                }
                                                                onChange={(e) =>
                                                                    handleChangeExample(
                                                                        idx,
                                                                        "example_vietnamese",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Nhập ví dụ dịch"
                                                                rows={2}
                                                            />
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <MyButton
                                                                danger
                                                                size="small"
                                                                onClick={() =>
                                                                    handleRemoveExample(
                                                                        idx
                                                                    )
                                                                }
                                                            >
                                                                Xóa ví dụ
                                                            </MyButton>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                            <MyButton
                                                type="dashed"
                                                size="middle"
                                                className="!border-green-300 !bg-green-50 !text-green-700 !rounded-lg hover:!bg-green-100 hover:!border-green-400 transition-all font-semibold flex items-center gap-2"
                                                onClick={handleAddExample}
                                            >
                                                Thêm ví dụ
                                            </MyButton>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-base font-semibold min-w-[80px]">
                                            Dịch nghĩa cả câu:
                                        </span>
                                        <div className="flex flex-col gap-4 mt-2 p-4 border rounded border-gray-200 shadow-sm">
                                            <div className="text-sm font-semibold">
                                                <span className="font-semibold text-green-700">
                                                    Câu gốc:{" "}
                                                </span>
                                                <span>
                                                    {wordModal.originSentence || (
                                                        <span className="text-gray-400">
                                                            Không có
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="text-sm font-semibold">
                                                <span className="font-semibold text-green-700">
                                                    Câu dịch:{" "}
                                                </span>
                                                <span>
                                                    {wordModal.translatedSentence || (
                                                        <span className="text-gray-400">
                                                            Không có
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="max-h-[70vh] overflow-y-auto">
                            <div className="space-y-2">
                                {data.explanation &&
                                    data.explanation !== "Không có" && (
                                        <div>
                                            <span className="text-base font-semibold min-w-[80px]">
                                                Dịch nghĩa:
                                            </span>{" "}
                                            <span className="text-green-600 font-semibold">
                                                {data.explanation}
                                            </span>
                                        </div>
                                    )}
                                {data.phonetic && data.phonetic !== "" && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-semibold min-w-[80px]">
                                            Phiên âm:
                                        </span>
                                        <span className="text-base text-green-600 italic">
                                            {data.phonetic || ""}
                                        </span>
                                    </div>
                                )}
                                {data.part_of_speech &&
                                    data.part_of_speech !== "" && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-semibold min-w-[80px]">
                                                Từ loại:
                                            </span>
                                            <span className="text-base text-green-600 italic">
                                                {data.part_of_speech || ""}
                                            </span>
                                        </div>
                                    )}
                                {Array.isArray(data.related_words) &&
                                    data.related_words.length > 0 && (
                                        <div>
                                            <span className="text-base font-semibold min-w-[80px]">
                                                Từ liên quan:
                                            </span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {data.related_words.map(
                                                    (
                                                        word: string,
                                                        idx: number
                                                    ) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-block px-3 py-1 rounded bg-green-100 text-green-700 border border-green-300 shadow-sm"
                                                        >
                                                            {word}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                {Array.isArray(data.examples) &&
                                    data.examples.length > 0 && (
                                        <div>
                                            <span className="text-base font-semibold min-w-[80px]">
                                                Ví dụ:
                                            </span>
                                            <div className="flex flex-col gap-4 mt-2">
                                                {data.examples.map(
                                                    (ex: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm"
                                                        >
                                                            {ex.definition && (
                                                                <div className="font-medium mb-2">
                                                                    {
                                                                        ex.definition
                                                                    }
                                                                </div>
                                                            )}
                                                            <div className="bg-gray-100 rounded px-2 py-1 mb-2 text-sm">
                                                                <span className="font-bold text-green-600">
                                                                    Ví dụ:
                                                                </span>{" "}
                                                                <span className="text-gray-600">
                                                                    {ex.example}
                                                                </span>
                                                            </div>
                                                            <div className="bg-green-50 rounded px-2 py-1 text-sm">
                                                                <span className="font-bold text-green-600">
                                                                    Ví dụ dịch:
                                                                </span>{" "}
                                                                <span className="text-green-700">
                                                                    {
                                                                        ex.example_vietnamese
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                <div>
                                    <span className="text-base font-semibold min-w-[80px]">
                                        Dịch nghĩa cả câu:
                                    </span>
                                    <div className="flex flex-col gap-4 mt-2 p-4 border rounded border-gray-200 shadow-sm">
                                        <div className="text-sm font-semibold">
                                            <span className="font-semibold text-green-700">
                                                Câu gốc:{" "}
                                            </span>
                                            <span>
                                                {wordModal.originSentence || (
                                                    <span className="text-gray-400">
                                                        Không có
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold">
                                            <span className="font-semibold text-green-700">
                                                Câu dịch:{" "}
                                            </span>
                                            <span>
                                                {wordModal.translatedSentence || (
                                                    <span className="text-gray-400">
                                                        Không có
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default TranslationSection;
