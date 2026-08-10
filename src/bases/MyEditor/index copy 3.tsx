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
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// import MyButton from "../MyButton";
// import MathEditor from "./components/MathEditor";
// import styles from "./styles.module.scss";
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
//         readOnly = false,
//         ...rest
//     } = props;

//     const editorRef = useRef<any>(null);

//     const [mathModal, setMathModal] = useState(false);
//     const [insideValue, setInSideValue] = useState<string>("");
//     const [isFocused, setIsFocused] = useState(false);
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

//     // Lấy danh sách các ô điền
//     const getFillingInput = (): Element[] => {
//         if (!editorRef.current) return [];
//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = editorRef.current.getData();
//         const spans =
//             tempDiv.querySelectorAll?.(`.${CLASS_FILLING_INPUT}`) || [];
//         return Array.from(spans);
//     };

//     // Cập nhật index các ô điền
//     const updateIndexes = () => {
//         const blots = getFillingInput();
//         const logArr = Array.from(blots).map(
//             (spanIndex: Element, idx: number) => ({
//                 domIndex: idx,
//                 value: spanIndex.innerHTML,
//                 id: spanIndex.getAttribute("data-id"),
//             })
//         );
//         console.log("Danh sách ô điền:", logArr);
//         onFillingInputUpdate?.(blots);
//     };

//     // Thêm ô điền mới
//     const insertFillingInput = () => {
//         if (!editorRef.current) return;
//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = editorRef.current.getData();
//         const current = tempDiv.querySelectorAll(`.${CLASS_FILLING_INPUT}`);
//         let maxIndex = 0;
//         current.forEach((el: any) => {
//             const val = parseInt(el.innerHTML);
//             if (!isNaN(val) && val > maxIndex) maxIndex = val;
//         });
//         const nextIndex = maxIndex + 1;

//         const html = `
// <span data-id="ip_${nextIndex}">
//   <span data-id="${nextIndex}" class="${CLASS_FILLING_INPUT}">${nextIndex}</span>
//   <span class="mr-2 w-[120px] inline-block border-b-2"></span>
// </span>&nbsp;`;

//         // CKEditor insert HTML
//         editorRef.current.model.change((writer: any) => {
//             const viewFragment = editorRef.current.data.processor.toView(html);
//             const modelFragment = editorRef.current.data.toModel(viewFragment);
//             editorRef.current.model.insertContent(modelFragment);
//         });
//         setTimeout(() => {
//             updateIndexes();
//         }, 0);
//     };

//     const toggleMathEditor = useCallback(() => {
//         setMathModal((prev) => !prev);
//     }, []);

//     // Clean các span rác
//     const cleanEmptySpans = () => {
//         if (!editorRef.current) return "";
//         const content = editorRef.current.getData();
//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = content;

//         const spans = tempDiv.querySelectorAll("span");
//         spans.forEach((span) => {
//             if (!span.classList.contains(CLASS_FILLING_INPUT)) {
//                 const styleAttr = span.getAttribute("style") || "";
//                 const cleanedStyle = styleAttr
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

//     const getCleanContent = () => cleanEmptySpans();

//     useImperativeHandle(forwardedRef, () => ({
//         getFillingInput,
//         cleanEmptySpans,
//         getCleanContent,
//     }));

//     // Custom upload adapter cho CKEditor 5
//     function CustomUploadAdapterPlugin(editor: any) {
//         editor.plugins.get("FileRepository").createUploadAdapter = (
//             loader: any
//         ) => {
//             return {
//                 upload: async () => {
//                     setUploadingImage(true);
//                     const file = await loader.file;
//                     try {
//                         const res = await mediaService.post(file);
//                         const url = res?.payload?.source_url;
//                         if (!url) throw new Error("Upload failed");
//                         return { default: url };
//                     } finally {
//                         setUploadingImage(false);
//                     }
//                 },
//             };
//         };
//     }

//     return (
//         <div
//             className={`${wrapperClass} ${styles.wrapper}`}
//             style={{ position: "relative", ...style }}
//         >
//             <CKEditor
//                 editor={ClassicEditor}
//                 data={finalValue}
//                 disabled={readOnly}
//                 onReady={(editor) => {
//                     editorRef.current = editor;
//                 }}
//                 onFocus={() => setIsFocused(true)}
//                 onBlur={() => setIsFocused(false)}
//                 onChange={(_event, editor) => {
//                     const data = editor.getData();
//                     if (!readOnly) finalOnChange(data);
//                 }}
//                 config={{
//                     toolbar: [
//                         "heading",
//                         "|",
//                         "bold",
//                         "italic",
//                         "underline",
//                         "fontFamily",
//                         "fontSize",
//                         "|",
//                         "alignment",
//                         "link",
//                         "bulletedList",
//                         "numberedList",
//                         "blockQuote",
//                         "|",
//                         "insertTable",
//                         "imageUpload",
//                         "undo",
//                         "redo",
//                     ],
//                     heading: {
//                         options: [
//                             {
//                                 model: "paragraph",
//                                 title: "heading",
//                                 class: "ck-heading_paragraph",
//                             },
//                             {
//                                 model: "heading1",
//                                 view: "h1",
//                                 title: "Heading 1",
//                                 class: "ck-heading_heading1",
//                             },
//                             {
//                                 model: "heading2",
//                                 view: "h2",
//                                 title: "Heading 2",
//                                 class: "ck-heading_heading2",
//                             },
//                             {
//                                 model: "heading3",
//                                 view: "h3",
//                                 title: "Heading 3",
//                                 class: "ck-heading_heading3",
//                             },
//                             {
//                                 model: "heading4",
//                                 view: "h4",
//                                 title: "Heading 4",
//                                 class: "ck-heading_heading4",
//                             },
//                             {
//                                 model: "heading5",
//                                 view: "h5",
//                                 title: "Heading 5",
//                                 class: "ck-heading_heading5",
//                             },
//                             {
//                                 model: "heading6",
//                                 view: "h6",
//                                 title: "Heading 6",
//                                 class: "ck-heading_heading6",
//                             },
//                         ],
//                     },
//                     alignment: {
//                         options: ["left", "center", "right", "justify"],
//                     },
//                     fontFamily: {
//                         options: [
//                             "default",
//                             "Arial, Helvetica, sans-serif",
//                             "Courier New, Courier, monospace",
//                             "Georgia, serif",
//                             "Lucida Sans Unicode, Lucida Grande, sans-serif",
//                             "Tahoma, Geneva, sans-serif",
//                             "Times New Roman, Times, serif",
//                             "Trebuchet MS, Helvetica, sans-serif",
//                             "Verdana, Geneva, sans-serif",
//                         ],
//                         supportAllValues: true,
//                     },
//                     fontSize: {
//                         options: [9, 11, 13, "default", 17, 19, 21, 27, 35],
//                         supportAllValues: true,
//                     },
//                     extraPlugins: [CustomUploadAdapterPlugin],
//                     placeholder: "Nhập nội dung...",
//                 }}
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
//                             onMouseDown={(e) => {
//                                 e.preventDefault();
//                                 insertFillingInput();
//                             }}
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
