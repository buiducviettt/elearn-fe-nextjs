"use client";
import "mathlive";
import { useEffect, useState } from "react";
import { handleClick, updateLatexOutput } from "../utils/Math";
import "./MathEditor.css";

const MathEditor = ({
  onSaveFormula,
  setMathEditorVisible,
  expressionEditable,
  setExpressionEditable,
}) => {
  const [latex, setLatex] = useState("");

  const handleMathFieldChange = (mathField) => {
    const newLatex = mathField.getValue();
    setLatex(newLatex);
  };

  const handleSave = () => {
    onSaveFormula(
      latex,
      setMathEditorVisible,
      expressionEditable,
      setExpressionEditable,
    );
  };

  useEffect(() => {
    const mathElement = document.getElementById("math");
    const mathField = document.getElementById("mathField");
    const latexOutput = document.getElementById("latex");
    const root = document.getElementById("root");
    mathElement.isStyleChanged = false;

    const handleClickEvent = (event) => {
      handleClick(event, mathField, mathElement);
    };

    const updateLatexOutputEvent = () => {
      updateLatexOutput(mathField, latexOutput, setLatex);
    };

    root.addEventListener("click", handleClickEvent);
    mathField.addEventListener("input", updateLatexOutputEvent);

    return () => {
      root.removeEventListener("click", handleClickEvent);
      mathField.removeEventListener("input", updateLatexOutputEvent);
    };
  }, []);

  return (
    <div id="math">
      <math-field
        id="mathField"
        contenteditable="true"
        tabIndex="0"
        onChange={handleMathFieldChange}
      >
        {latex}
      </math-field>
      <textarea
        id="latex"
        className="output"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        value={latex}
        readOnly={true}
      />
      <div className="buttons">
        <button
          className="mathButton cancelButton"
          onClick={() => {
            setMathEditorVisible(false);
          }}
        >
          Cancel
        </button>
        <button
          className="maxxthButton saveButton"
          onClick={() => {
            handleSave();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MathEditor;
