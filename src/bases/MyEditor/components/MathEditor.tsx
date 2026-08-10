import MyButton from "@/bases/MyButton";
import "mathlive";
import { useState } from "react";
import handleSaveFormula from "../handleSaveFormula";

const MathEditor = ({ toggleMathEditor, wrapperClass }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [latex, setLatex] = useState("");

  const MathTag: any = "math-field";

  return (
    <div className="flex flex-col gap-4">
      <MathTag
        style={{
          display: "block",
          width: "100%",
          minHeight: "280px",
          padding: "10px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          fontSize: "18px",
          backgroundColor: "#f9f9f9",
          transition: "all 0.3s ease",
        }}
        onInput={(evt) => {
          setLatex(evt.target.value);
        }}
      >
        {latex}
      </MathTag>
      <p className="text-red-500 font-normal">{errorMessage}</p>
      <div className="flex justify-end gap-2">
        <MyButton onClick={toggleMathEditor} className="!px-8" variant="solid">
          Trở về
        </MyButton>
        <MyButton
          onClick={() => {
            // update value happen inside this func
            const { message, success } = handleSaveFormula(latex, wrapperClass);
            if (success) {
              setErrorMessage("");
              setLatex("");
              toggleMathEditor();
            } else {
              setErrorMessage(message);
              // show error message
            }
          }}
          className="!px-8"
          variant="solid"
          color="primary"
        >
          Lưu
        </MyButton>
      </div>
    </div>
  );
};

export default MathEditor;
