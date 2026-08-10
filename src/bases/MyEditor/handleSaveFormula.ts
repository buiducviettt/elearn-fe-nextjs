import katex from "katex";

katex.renderToString(
  String.raw`\newcommand\proj[2]{#1_{\small \parallel #2}}`,
  {
    macros: {
      "\\exponentialE": "e", // Define the \exponentialE macro globally
      "\\RealNumbers": "\\mathbb{R}", // Example of another macro
    },
    globalGroup: true,
  },
);

(window as any).katex = katex; // add katex to windown because quill formula rely on it

// quill formula rely on inputElement and primarySaveButton to render mathematical expression
export default function handleSaveFormula(
  latex,
  wrapperClass,
): {
  success: boolean;
  message: string;
} {
  const removeException = latex // remove exception from latex which is not supported by quill formula
    .replace(/\\exponentialE/g, "e")
    .replace(/\\placeholder/g, "");

  const wrapperElement = document.querySelector(`.${wrapperClass}`);
  if (!wrapperElement)
    return {
      success: false,
      message: "Wrapper element not found",
    };

  // recieved latex and qill will convert it to mathematical expression html
  const inputElement: any = wrapperElement.querySelector("input[data-formula]");
  const primarySaveButton: any = wrapperElement.querySelector(".ql-action");
  const currentValue = inputElement.value;
  let newValue = "";
  newValue = removeException + currentValue;

  inputElement.value = newValue;

  inputElement.focus();
  primarySaveButton.click(); // => update state value
  return {
    success: true,
    message: "Success",
  };
}
