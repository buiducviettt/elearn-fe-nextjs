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
// import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

// // self-host TinyMCE (bundle trong app, không dùng CDN)
// import "tinymce/tinymce";
// import "tinymce/icons/default";
// import "tinymce/themes/silver";
// import "tinymce/models/dom";
// import "tinymce/plugins/link";
// import "tinymce/plugins/image";
// import "tinymce/plugins/lists";
// import "tinymce/plugins/code";
// import "tinymce/plugins/table";
// // CSS skin + content cho TinyMCE
// import "tinymce/skins/ui/oxide/skin.min.css";
// import "tinymce/skins/content/default/content.min.css";

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

//     const getFillingInput = (): Element[] => {
//         const editor = editorRef.current;
//         if (!editor) return [];
//         const body = editor.getBody?.();
//         if (!body) return [];
//         const spans = body.querySelectorAll?.(`.${CLASS_FILLING_INPUT}`) || [];
//         return Array.from(spans);
//     };

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

//     const insertFillingInput = () => {
//         const editor = editorRef.current;
//         console.log("editorRef.current:", editor);
//         if (!editor) return;

//         const body = editor.getBody?.();
//         if (!body) return;

//         const current = body.querySelectorAll(`.${CLASS_FILLING_INPUT}`);
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

//         editor.insertContent(html);
//         setTimeout(() => {
//             updateIndexes();
//         }, 0);
//     };

//     const toggleMathEditor = useCallback(() => {
//         setMathModal((prev) => !prev);
//     }, []);

//     useEffect(() => {
//         const editor = editorRef.current;
//         if (!editor) return;
//         editor.setMode?.(readOnly ? "readonly" : "design");
//     }, [readOnly]);

//     const cleanEmptySpans = () => {
//         const editor = editorRef.current;
//         if (!editor) return "";

//         const content = editor.getContent({ format: "html" }) as string;
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

//     return (
//         <div
//             className={`${wrapperClass} ${styles.wrapper}`}
//             style={{ position: "relative", ...style }}
//         >
//             <TinyMCEEditor
//                 {...rest}
//                 value={finalValue}
//                 licenseKey="gpl"
//                 onInit={(_evt, editor) => {
//                     editorRef.current = editor;
//                 }}
//                 onEditorChange={(content) => {
//                     if (!readOnly) finalOnChange(content);
//                 }}
//                 init={{
//                     height,
//                     menubar: false,
//                     branding: false,
//                     statusbar: false,
//                     plugins: ["link", "image", "lists", "code", "table"],
//                     toolbar:
//                         "undo redo | blocks fontfamily | bold italic underline strikethrough | table | " +
//                         "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
//                         "bullist numlist outdent indent | link image | mathbtn",

//                     font_family_formats:
//                         "Arial=arial,helvetica,sans-serif;" +
//                         "Roboto=roboto,sans-serif;" +
//                         "Times New Roman=times new roman,times;" +
//                         "Montserrat=montserrat,sans-serif;" +
//                         "Tahoma=tahoma,arial,helvetica,sans-serif",

//                     paste_data_images: true,
//                     automatic_uploads: true,
//                     skin: false,
//                     content_css: false,

//                     // ⬇️ Cho phép giữ gần như toàn bộ HTML & style từ Word
//                     valid_elements: "*[*]",

//                     // ⬇️ CSS hiển thị bảng rõ ràng khi dán từ Word
//                     content_style: `
//                         table { border-collapse: collapse; width: 100%; }
//                         table, th, td { border: 1px solid #000; }
//                         th, td { padding: 4px; }
//                         .index-span-input {
//                             position: relative;
//                             margin-right: 0.2rem;
//                             margin-left: 0.2rem;
//                             font-weight: 600;
//                             height: 20px;
//                             min-width: 20px;
//                             display: inline-flex;
//                             align-items: center;
//                             justify-content: center;
//                             text-align: center;
//                             padding: 2px;
//                             border: 1px solid #2563eb;
//                             border-radius: 2px;
//                             font-size: 0.875rem;
//                             color: #2563eb;
//                             flex-shink: 0;
//                         }
//                         span.inline-block{
//                             display: inline-flex;
//                             height: 26px;
//                             border-bottom: 2px solid #2563eb;
//                             width: 50px;
//                             max-width: 100%;
//                         }
//                     `,

//                     images_upload_handler: async (blobInfo: any) => {
//                         setUploadingImage(true);
//                         try {
//                             const file = blobInfo.blob();
//                             const res = await mediaService.post(file);
//                             const url = res?.payload?.source_url;
//                             if (!url) throw new Error("Upload failed");
//                             return url;
//                         } finally {
//                             setUploadingImage(false);
//                         }
//                     },
//                     file_picker_types: "image",
//                     file_picker_callback: (cb: any, _value: any, meta: any) => {
//                         if (meta.filetype !== "image") return;
//                         const input = document.createElement("input");
//                         input.type = "file";
//                         input.accept = "image/*";
//                         input.onchange = async () => {
//                             const file = input.files?.[0];
//                             if (!file) return;
//                             setUploadingImage(true);
//                             try {
//                                 const res = await mediaService.post(file);
//                                 const url = res?.payload?.source_url;
//                                 if (url) cb(url, { title: file.name });
//                             } finally {
//                                 setUploadingImage(false);
//                             }
//                         };
//                         input.click();
//                     },

//                     setup: (editor) => {
//                         editor.on("focus", () => setIsFocused(true));
//                         editor.on("blur", () => setIsFocused(false));

//                         editor.ui.registry.addButton("mathbtn", {
//                             text: "Math",
//                             onAction: () => setMathModal(true),
//                         });
//                     },
//                 }}
//                 disabled={readOnly}
//                 // textareaName="content"
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
