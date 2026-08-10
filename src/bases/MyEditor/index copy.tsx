// import numberHandler from "@/utils/numberHandler";
// import { PlusOutlined } from "@ant-design/icons";
// import { Drawer, Spin } from "antd";
// import { motion } from "motion/react";
// import {
//     forwardRef,
//     useCallback,
//     useEffect,
//     useImperativeHandle,
//     useMemo,
//     useRef,
//     useState,
// } from "react";
// import ReactQuill, { Quill } from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import MyButton from "../MyButton";
// import MathEditor from "./components/MathEditor";
// import QuillBetterTable from "quill-better-table";
// import "quill-better-table/dist/quill-better-table.css";
// import styles from "./styles.module.scss";
// import EmojiPicker from "emoji-picker-react";
// import { mediaService } from "@/services/media";

// export type TMyEditorProps = {
//     height?: number;
//     value?: string;
//     showAddInput?: boolean;
//     onChange?: (value: string) => void;
//     onFillingInputUpdate?: (fillingIp: Element[]) => void;
//     extendedToolbars?: Record<string, any>[];
//     readOnly?: boolean;
//     questionId?: string | number;
// };

// export type TMyEditorRef = {
//     getFillingInput: () => Element[];
//     cleanEmptySpans: () => void;
//     getCleanContent: () => string;
// };

// export const CLASS_FILLING_INPUT = "index-span-input";
// export const DATA_ID_FILLING_INPUT = "data-id";

// // === Custom Blot ===
// const Embed = Quill.import("blots/embed") as any;

// class InputInlineBlot extends Embed {
//     static currentId = 1;

//     static create(value: { index?: number }) {
//         const node = super.create();
//         const id = value.index || 1;

//         node.setAttribute("data-id", `ip_${id}`);

//         const spanIndex = document.createElement("span");
//         spanIndex.innerHTML = `${id}`;
//         spanIndex.setAttribute("data-id", `${id}`);
//         spanIndex.className = `${CLASS_FILLING_INPUT}`;

//         const spanLine = document.createElement("span");
//         spanLine.className = "mr-2 w-[120px] inline-block border-b-2";

//         node.addEventListener("paste", (event) => event.stopPropagation());
//         node.appendChild(spanIndex);
//         node.appendChild(spanLine);
//         return node;
//     }

//     static value(node: HTMLElement) {
//         const spanIndex = node.querySelector(`.${CLASS_FILLING_INPUT}`);
//         return {
//             index: spanIndex ? spanIndex.innerHTML : null,
//         };
//     }
// }

// InputInlineBlot.blotName = "inputInline";
// InputInlineBlot.className = "input-Inline";
// InputInlineBlot.tagName = "span";
// Quill.register(InputInlineBlot);

// // === Register Table Module ===
// Quill.register(
//     {
//         "modules/better-table": QuillBetterTable,
//     },
//     true
// );

// // === Component ===
// const MyEditor: React.ForwardRefRenderFunction<TMyEditorRef, TMyEditorProps> = (
//     props,
//     forwardedRef
// ) => {
//     const {
//         height = 400,
//         onChange,
//         onFillingInputUpdate,
//         value,
//         showAddInput = false,
//         extendedToolbars = [],
//         readOnly = false,
//         ...rest
//     } = props;

//     const editorRef = useRef<ReactQuill>(null);
//     const prevNumberOfFillingInput = useRef<number>(0);
//     const quillRef = useRef<ReactQuill>(null);

//     const [mathModal, setMathModal] = useState(false);
//     const [insideValue, setInSideValue] = useState<string>("");
//     const [isFocused, setIsFocused] = useState(false);

//     // Emoji Picker state
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//     // Spinner state for image upload
//     const [uploadingImage, setUploadingImage] = useState(false);

//     const finalValue = value ?? insideValue;
//     const finalOnChange = onChange ?? setInSideValue;

//     const wrapperClass = useMemo(
//         () => `EDIT_WRAPPER_${numberHandler.random(0, 1000)}`,
//         []
//     );

//     const style = {
//         "--height": `${height}px`,
//     } as React.CSSProperties;

//     const toolbars = useMemo(
//         () => [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             [{ size: ["small", false, "large", "huge"] }],
//             [{ color: [] }, { background: [] }],
//             [{ script: "sub" }, { script: "super" }],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ indent: "-1" }, { indent: "+1" }],
//             [{ align: [] }],
//             ["bold", "italic", "underline", "strike", "blockquote"],
//             ["link", "image"],
//         ],
//         []
//     );

//     const getFillingInput = (): Element[] => {
//         const quill = editorRef.current?.getEditor();
//         const content = quill?.root;
//         const spans =
//             content?.querySelectorAll(`.${CLASS_FILLING_INPUT}`) || [];
//         return Array.from(spans);
//     };

//     const updateIndexes = () => {
//         const quill = editorRef.current?.getEditor();
//         const blots = getFillingInput();
//         prevNumberOfFillingInput.current = blots.length;

//         // Không cập nhật lại innerHTML nữa, chỉ log ra thôi
//         const logArr = Array.from(blots).map(
//             (spanIndex: Element, idx: number) => ({
//                 domIndex: idx,
//                 value: spanIndex.innerHTML,
//                 id: spanIndex.getAttribute("data-id"),
//             })
//         );
//         console.log("Danh sách ô điền:", logArr);

//         onFillingInputUpdate?.(blots);
//         quill?.update?.();
//     };

//     const insertFillingInput = () => {
//         const quill = editorRef.current?.getEditor();
//         if (!quill) return;

//         const current = quill.root.querySelectorAll(`.${CLASS_FILLING_INPUT}`);
//         let maxIndex = 0;
//         current.forEach((el: any) => {
//             const val = parseInt(el.innerHTML);
//             if (!isNaN(val) && val > maxIndex) maxIndex = val;
//         });
//         const nextIndex = maxIndex + 1;

//         const range = quill.getSelection(true);
//         if (range) {
//             quill.insertEmbed(range.index, "inputInline", { index: nextIndex });
//             quill.setSelection(range.index + 1);

//             setTimeout(() => {
//                 updateIndexes();
//             }, 0);
//         }
//     };
//     interface BetterTableModule {
//         insertTable: (rows: number, columns: number) => void;
//     }

//     const insertTable = () => {
//         const quill = editorRef.current?.getEditor();
//         if (!quill) return;

//         const tableModule = quill.getModule(
//             "better-table"
//         ) as BetterTableModule;
//         if (tableModule?.insertTable) {
//             tableModule.insertTable(2, 2);
//         } else {
//             console.warn(
//                 "Better Table module chưa được khởi tạo hoặc không hợp lệ."
//             );
//         }
//     };

//     // Thêm hàm chèn emoji vào editor
//     const insertEmoji = (emojiData: any) => {
//         const quill = editorRef.current?.getEditor();
//         if (!quill) return;
//         const range = quill.getSelection(true);
//         quill.insertText(range ? range.index : 0, emojiData.emoji);
//         quill.setSelection((range ? range.index : 0) + emojiData.emoji.length);
//         setShowEmojiPicker(false);
//     };

//     const toggleMathEditor = useCallback(() => {
//         setMathModal((prev) => !prev);
//     }, []);

//     useEffect(() => {
//         const wrapperElement = document.querySelector(`.${wrapperClass}`);
//         if (!wrapperElement) return;

//         const tooltip = wrapperElement.querySelector(
//             ".ql-tooltip"
//         ) as HTMLElement;
//         if (tooltip) tooltip.style.opacity = "0";

//         const formulaBtn = wrapperElement.querySelector("button.ql-formula");
//         if (formulaBtn) {
//             formulaBtn.addEventListener("click", toggleMathEditor);
//             return () => {
//                 formulaBtn.removeEventListener("click", toggleMathEditor);
//             };
//         }
//     }, [toggleMathEditor, wrapperClass]);

//     // Custom handler cho toolbar image
//     useEffect(() => {
//         const quill = editorRef.current?.getEditor();
//         if (!quill) return;

//         // Handler upload ảnh giống paste/drop
//         const handleToolbarImage = async () => {
//             const input = document.createElement("input");
//             input.setAttribute("type", "file");
//             input.setAttribute("accept", "image/*");
//             input.click();

//             input.onchange = async () => {
//                 const file = input.files?.[0];
//                 if (file) {
//                     setUploadingImage(true);
//                     try {
//                         const res = await mediaService.post(file);
//                         const url = res?.payload?.source_url;
//                         if (url) {
//                             const range = quill.getSelection(true);
//                             quill.insertEmbed(
//                                 range ? range.index : 0,
//                                 "image",
//                                 url
//                             );
//                             quill.setSelection((range ? range.index : 0) + 1);
//                         }
//                     } catch (err) {
//                         // handle error
//                     }
//                     setUploadingImage(false);
//                 }
//             };
//         };

//         (
//             quill.getModule("toolbar") as {
//                 addHandler?: (
//                     name: string,
//                     handler: (...args: any[]) => void
//                 ) => void;
//             }
//         )?.addHandler?.("image", handleToolbarImage);
//     }, []);

//     // Handle paste & drop image
//     useEffect(() => {
//         const quill = editorRef.current?.getEditor();
//         if (!quill) return;

//         const root = quill.root;

//         // Handler ở cấp DOM, chặn hoàn toàn paste image
//         const domPasteHandler = async (e: ClipboardEvent) => {
//             if (e.clipboardData) {
//                 const items = e.clipboardData.items;
//                 for (let i = 0; i < items.length; i++) {
//                     const item = items[i];
//                     if (item.type.indexOf("image") !== -1) {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         setUploadingImage(true);
//                         const file = item.getAsFile();
//                         if (file) {
//                             try {
//                                 const res = await mediaService.post(file);
//                                 const url = res?.payload?.source_url;
//                                 if (url) {
//                                     const range = quill.getSelection(true);
//                                     quill.insertEmbed(
//                                         range ? range.index : 0,
//                                         "image",
//                                         url
//                                     );
//                                     quill.setSelection(
//                                         (range ? range.index : 0) + 1
//                                     );
//                                 }
//                             } catch (err) {
//                                 // handle error
//                             }
//                         }
//                         setUploadingImage(false);
//                         return false; // CHẶN LUÔN KHÔNG CHO QUILL XỬ LÝ
//                     }
//                 }
//             }
//         };

//         // Đăng ký listener ở cấp DOM, useCapture = true
//         root.addEventListener("paste", domPasteHandler as any, true);

//         // CHẶN HOÀN TOÀN DROP Ở CẤP DOM (capture phase)
//         const domDropHandler = async (e: DragEvent) => {
//             if (
//                 e.dataTransfer &&
//                 e.dataTransfer.files &&
//                 e.dataTransfer.files.length
//             ) {
//                 const file = e.dataTransfer.files[0];
//                 if (file.type.startsWith("image/")) {
//                     e.preventDefault();
//                     e.stopPropagation(); // Chặn hoàn toàn Quill xử lý mặc định
//                     setUploadingImage(true);
//                     try {
//                         const res = await mediaService.post(file);
//                         const url = res?.payload?.source_url;
//                         if (url) {
//                             const range = quill.getSelection(true);
//                             quill.insertEmbed(
//                                 range ? range.index : 0,
//                                 "image",
//                                 url
//                             );
//                             quill.setSelection((range ? range.index : 0) + 1);
//                         }
//                     } catch (err) {
//                         // handle error
//                     }
//                     setUploadingImage(false);
//                 }
//             }
//         };
//         root.addEventListener("drop", domDropHandler as any, true);

//         return () => {
//             root.removeEventListener("paste", domPasteHandler as any, true);
//             root.removeEventListener("drop", domDropHandler as any, true);
//         };
//     }, []);

//     const cleanEmptySpans = () => {
//         const quill = editorRef.current?.getEditor();
//         if (!quill) return "";

//         const content = quill.root.innerHTML;
//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = content;

//         const spans = tempDiv.querySelectorAll("span");
//         spans.forEach((span) => {
//             if (!span.classList.contains(CLASS_FILLING_INPUT)) {
//                 // Chỉ loại bỏ style mặc định của Quill
//                 const style = span.getAttribute("style") || "";
//                 const cleanedStyle = style
//                     .replace(
//                         /background-color:\s*rgb\(255,\s*255,\s*255\);?/gi,
//                         ""
//                     )
//                     .replace(/color:\s*rgb\(36,\s*36,\s*36\);?/gi, "")
//                     .trim();

//                 if (cleanedStyle) {
//                     span.setAttribute("style", cleanedStyle);
//                 } else {
//                     span.removeAttribute("style");
//                 }
//             }
//             // Xử lý span rỗng như cũ
//             if (
//                 !span.classList.contains(CLASS_FILLING_INPUT) &&
//                 !span.style.cssText &&
//                 !span.classList.length &&
//                 !span.hasAttribute("data-id")
//             ) {
//                 const text = span.textContent || "";
//                 const textNode = document.createTextNode(text);
//                 span.parentNode?.replaceChild(textNode, span);
//             }
//         });

//         return tempDiv.innerHTML;
//     };

//     const getCleanContent = () => {
//         const quill = editorRef.current?.getEditor();
//         if (!quill) return "";
//         return cleanEmptySpans();
//     };

//     useImperativeHandle(forwardedRef, () => ({
//         getFillingInput,
//         cleanEmptySpans,
//         getCleanContent,
//     }));

//     return (
//         <div
//             className={`${wrapperClass} ${styles.wrapper}`}
//             style={{ position: "relative" }}
//         >
//             <div className="mb-2 flex gap-2" style={{ position: "relative" }}>
//                 <MyButton className="rounded-xs" onClick={insertTable}>
//                     Tạo bảng
//                 </MyButton>
//                 <MyButton
//                     className="rounded-xs"
//                     onClick={() => setShowEmojiPicker((v) => !v)}
//                 >
//                     Emoji
//                 </MyButton>
//                 {showEmojiPicker && (
//                     <div
//                         style={{
//                             position: "absolute",
//                             zIndex: 100,
//                             top: 40,
//                             left: 120,
//                         }}
//                     >
//                         <EmojiPicker
//                             onEmojiClick={insertEmoji}
//                             autoFocusSearch={false}
//                         />
//                     </div>
//                 )}
//             </div>

//             <ReactQuill
//                 onFocus={() => setIsFocused(true)}
//                 onBlur={() => setIsFocused(false)}
//                 className={styles.root}
//                 ref={(el) => {
//                     editorRef.current = el!;
//                     quillRef.current = el!;
//                 }}
//                 value={finalValue}
//                 onChange={(content, delta, source, editor) => {
//                     if (!readOnly) {
//                         finalOnChange(content);
//                     }
//                 }}
//                 modules={{
//                     toolbar: [...toolbars, ...extendedToolbars],
//                     clipboard: { matchVisual: false },
//                     "better-table": {
//                         operationMenu: {
//                             items: {
//                                 unmergeCells: {
//                                     text: "Unmerge",
//                                 },
//                             },
//                         },
//                         resizable: true,
//                     },
//                 }}
//                 readOnly={readOnly}
//                 style={style}
//                 {...rest}
//             />

//             {uploadingImage && (
//                 <div className="fixed inset-0 z-50 flex flex-col gap-2 items-center justify-center bg-black bg-opacity-40">
//                     <div className="flex flex-col min-h-56 gap-2 bg-white p-5 rounded-md items-center justify-center">
//                         <Spin size="large" tip="Đang tải ảnh lên..." />
//                         <p className="text-lg text-gray-700 font-bold">
//                             Ảnh đang được chuyển đổi, vui lòng đợi...
//                         </p>
//                     </div>
//                 </div>
//             )}

//             <div className="absolute bottom-3 right-1 px-2">
//                 {isFocused && showAddInput && !readOnly && (
//                     <motion.div
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <MyButton
//                             icon={<PlusOutlined />}
//                             onClick={insertFillingInput}
//                             htmlType="button"
//                             shape="round"
//                         >
//                             Tạo ô
//                         </MyButton>
//                     </motion.div>
//                 )}
//             </div>

//             <Drawer
//                 title="Math Editor"
//                 zIndex={1}
//                 width={700}
//                 open={mathModal}
//                 onClose={toggleMathEditor}
//             >
//                 <MathEditor
//                     wrapperClass={wrapperClass}
//                     toggleMathEditor={toggleMathEditor}
//                 />
//             </Drawer>
//         </div>
//     );
// };

// export default forwardRef(MyEditor);
