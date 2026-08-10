"use client";
import {
  CheckOutlined,
  CloseOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";

type HistoryQuestionItemProps = {
  q: any;
  item: any;
  questionIndex: number;
};

const HistoryQuestionItem: React.FC<HistoryQuestionItemProps> = ({
  q,
  item,
  questionIndex,
}) => {
  // Lấy answerList trực tiếp từ item (đã có trong history)
  const answerList = item.question;

  const getStatusIcon = (
    status: "skip" | "incorrect" | "correct" | "halfcorrect"
  ) => {
    const iconStyle = {
      width: 24,
      height: 24,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    switch (status) {
      case "correct":
        return (
          <span title="Đúng" style={{ ...iconStyle, background: "#22c55e" }}>
            <CheckOutlined style={{ color: "#fff", fontSize: 14 }} />
          </span>
        );
      case "incorrect":
        return (
          <span title="Sai" style={{ ...iconStyle, background: "#ef4444" }}>
            <CloseOutlined style={{ color: "#fff", fontSize: 14 }} />
          </span>
        );
      case "halfcorrect":
        return (
          <span
            title="Vừa đúng vừa sai"
            style={{
              ...iconStyle,
              background: "linear-gradient(to right, #22c55e 50%, #ef4444 50%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CheckOutlined style={{ color: "#fff", fontSize: 10 }} />
              <CloseOutlined style={{ color: "#fff", fontSize: 10 }} />
            </div>
          </span>
        );
      case "skip":
        return (
          <span title="Bỏ qua" style={{ ...iconStyle, background: "#fb653c" }}>
            <ArrowRightOutlined style={{ color: "#fff", fontSize: 14 }} />
          </span>
        );
      default:
        return null;
    }
  };

  // Xử lý speaking - hiển thị audio player với tabs
  if (item.type === "speaking") {
    const tabItems = [
      {
        key: "answer",
        label: "Đáp án mẫu",
        children: (
          <div className="p-4">
            <audio controls className="w-full">
              <source src={item.answer || ""} type="audio/mpeg" />
              <source src={item.answer || ""} type="audio/wav" />
              <source src={item.answer || ""} type="audio/ogg" />
              <source src={item.answer || ""} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ),
      },
      {
        key: "result",
        label: "Bài làm của bạn",
        children: (
          <div className="p-4">
            {item.result &&
            Array.isArray(item.result) &&
            item.result.length > 0 &&
            item.result[0] &&
            item.result[0].trim() !== "" ? (
              <audio controls className="w-full">
                <source src={item.result[0]} type="audio/mpeg" />
                <source src={item.result[0]} type="audio/wav" />
                <source src={item.result[0]} type="audio/ogg" />
                <source src={item.result[0]} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div className="text-gray-400 text-center py-8">
                Chưa có bản ghi âm
              </div>
            )}
          </div>
        ),
      },
      {
        key: "view",
        label: "Đánh giá",
        children: (
          <div className="p-4">
            <p className="font-bold text-lg text-blue-600">
              {" "}
              Tính năng đang được cập nhật
            </p>
          </div>
        ),
      },
    ];

    return (
      <div className="mb-2 col-span-2">
        <span className="font-bold text-lg text-blue-600 mb-4 block">
          Câu {questionIndex}:
        </span>
        <Tabs
          defaultActiveKey="answer"
          type="card"
          items={tabItems}
          className="bg-gray-50 rounded-lg"
        />
      </div>
    );
  }

  // Xử lý writing - hiển thị text với tabs
  if (item.type === "writing") {
    const tabItems = [
      {
        key: "answer",
        label: "Đáp án mẫu",
        children: (
          <div className="p-4">
            <div className="bg-white rounded-lg p-4 border min-h-[100px]">
              <div
                className="text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: item.answer || "Chưa có câu trả lời mẫu",
                }}
              />
            </div>
          </div>
        ),
      },
      {
        key: "result",
        label: "Bài làm của bạn",
        children: (
          <div className="p-4">
            <div className="bg-white rounded-lg p-4 border min-h-[100px]">
              {item.result &&
              Array.isArray(item.result) &&
              item.result.length > 0 &&
              item.result[0] &&
              item.result[0].trim() !== "" ? (
                <div
                  className="text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: item.result[0],
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center py-8">
                  Chưa có bản viết
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "view",
        label: "Đánh giá",
        children: (
          <div className="p-4">
            <p className="font-bold text-lg text-blue-600">
              {" "}
              Tính năng đang được cập nhật
            </p>
          </div>
        ),
      },
    ];

    return (
      <div className="mb-2 col-span-2">
        <span className="font-bold text-lg text-blue-600 mb-4 block">
          Câu {questionIndex}:
        </span>
        <Tabs
          defaultActiveKey="answer"
          type="card"
          items={tabItems}
          className="bg-gray-50 rounded-lg "
        />
      </div>
    );
  }

  const getAnswerText = () => {
    const specialAnswers = ["FALSE", "NOT GIVEN", "TRUE", "YES", "NO"];
    const indexToChar = (idx: number) => String.fromCharCode(65 + idx);

    if (
      (item.type === "single_choice" ||
        item.type === "single_choice_selector") &&
      Array.isArray(answerList) &&
      Array.isArray(item.answer)
    ) {
      return item.answer
        .map((ansIdx: number) => {
          const ans = answerList?.[ansIdx];
          if (
            typeof ans === "string" &&
            specialAnswers.includes(ans.trim().toUpperCase())
          ) {
            return ans.trim();
          }
          return indexToChar(ansIdx);
        })
        .filter(Boolean)
        .join(" / ");
    }
    if (
      item.type === "multiple_choice" &&
      Array.isArray(answerList) &&
      Array.isArray(item.answer)
    ) {
      return item.answer
        .map((ansIdx: number) => {
          const ans = answerList?.[ansIdx];
          if (
            typeof ans === "string" &&
            specialAnswers.includes(ans.trim().toUpperCase())
          ) {
            return ans.trim();
          }
          return indexToChar(ansIdx);
        })
        .filter(Boolean)
        .join(", ");
    }
    if (
      (item.type === "fill_in_the_blank" || item.type === "drag") &&
      Array.isArray(item.answer)
    ) {
      return item.answer.map((a: any) => String(a ?? "").trim()).join(" / ");
    }
    return Array.isArray(item.answer)
      ? item.answer.map((a: any) => String(a ?? "").trim()).join(" / ")
      : String(item.answer ?? "").trim();
  };

  const getResultText = () => {
    if (item.status === "skip") return "...";
    if (!Array.isArray(item.result) || item.result.length === 0) return "";

    // Xử lý riêng cho speaking và writing - lấy phần tử đầu tiên
    if (item.type === "speaking" || item.type === "writing") {
      return item.result[0] || "";
    }

    const specialAnswers = ["FALSE", "NOT GIVEN", "TRUE", "YES", "NO"];
    const indexToChar = (idx: number) => String.fromCharCode(65 + idx);

    if (
      (item.type === "single_choice" ||
        item.type === "single_choice_selector") &&
      Array.isArray(answerList)
    ) {
      return item.result
        .map((ansIdx: number) => {
          const ans = answerList?.[ansIdx];
          if (
            typeof ans === "string" &&
            specialAnswers.includes(ans.trim().toUpperCase())
          ) {
            return ans.trim();
          }
          return indexToChar(ansIdx);
        })
        .filter(Boolean)
        .join(" / ");
    }
    if (item.type === "multiple_choice" && Array.isArray(answerList)) {
      return item.result
        .map((ansIdx: number) => {
          const ans = answerList?.[ansIdx];
          if (
            typeof ans === "string" &&
            specialAnswers.includes(ans.trim().toUpperCase())
          ) {
            return ans.trim();
          }
          return indexToChar(ansIdx);
        })
        .filter(Boolean)
        .join(", ");
    }
    if (
      (item.type === "fill_in_the_blank" || item.type === "drag") &&
      Array.isArray(item.result)
    ) {
      return item.result.map((a: any) => String(a ?? "").trim()).join(" / ");
    }
    return Array.isArray(item.result)
      ? item.result.map((a: any) => String(a ?? "").trim()).join(" / ")
      : String(item.result ?? "").trim();
  };

  // Xử lý fill_in_the_blank, drag
  if (
    (item.type === "fill_in_the_blank" || item.type === "drag") &&
    Array.isArray(item.answer)
  ) {
    if (item.multiple === "1") {
      return (
        <>
          {item.answer.map((ans: string, idx: number) => {
            let icon: React.ReactNode = null;
            if (item.type === "drag") {
              if (
                Array.isArray(item.result) &&
                item.result[idx] !== undefined &&
                ans !== undefined
              ) {
                const isCorrect =
                  String(item.result[idx]).trim().toUpperCase() ===
                  String(ans).trim().toUpperCase();
                icon = isCorrect
                  ? getStatusIcon("correct")
                  : getStatusIcon("incorrect");
              } else if (item.status === "skip") {
                icon = getStatusIcon("skip");
              }
            } else {
              icon = getStatusIcon(item.status);
            }

            return (
              <div
                className={`mb-2 ${
                  item.type === "drag" ? "col-span-2" : "col-span-1"
                }`}
                key={idx}
              >
                <span className="font-bold text-lg text-blue-600">
                  Câu {questionIndex + idx}:
                </span>{" "}
                <div
                  className={`gap-2 justify-between flex-1 ${
                    item.type === "drag" ? "flex flex-col" : "flex"
                  }`}
                >
                  <span>{String(ans ?? "").trim()}</span>
                  <div className="flex items-center gap-2">
                    {Array.isArray(item.result) &&
                    item.result[idx] !== undefined ? (
                      <span className="text-base font-semibold">
                        {item.status === "skip"
                          ? "..."
                          : String(item.result[idx] ?? "").trim()}
                      </span>
                    ) : (
                      item.status === "skip" && (
                        <span className="text-base font-semibold">...</span>
                      )
                    )}
                    {icon}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      );
    } else {
      return (
        <div
          className={`mb-2 ${
            item.type === "drag" ? "col-span-2" : "col-span-1"
          }`}
        >
          <span className="font-bold  text-lg text-blue-600">
            Câu {questionIndex}:
          </span>{" "}
          <div
            className={`gap-2 justify-between flex-1 ${
              item.type === "drag" ? "flex flex-col" : "flex"
            }`}
          >
            <span>
              {item.answer.map((a: any) => String(a ?? "").trim()).join(" / ")}
            </span>
            <div className="flex items-center gap-2">
              {Array.isArray(item.result) && item.result.length > 0 ? (
                <span className="text-base font-semibold">
                  {item.status === "skip"
                    ? "..."
                    : item.result
                        .map((a: any) => String(a ?? "").trim())
                        .join(" / ")}
                </span>
              ) : (
                item.status === "skip" && (
                  <span className="text-base font-semibold">...</span>
                )
              )}
              {getStatusIcon(item.status)}
            </div>
          </div>
        </div>
      );
    }
  }

  // Xử lý các loại khác như cũ
  if (item.multiple === "1") {
    const answerLength = Array.isArray(item.answer) ? item.answer.length : 0;
    const startIndex = questionIndex;
    const indices = Array.from(
      { length: answerLength },
      (_, i) => startIndex + i
    );

    return (
      <div
        className={`mb-2 ${item.type === "drag" ? "col-span-2" : "col-span-1"}`}
      >
        <span className="font-bold  text-lg text-blue-600">
          Câu {indices.join(" - ")}:
        </span>{" "}
        <div className="flex gap-2 justify-between flex-1">
          <span>{getAnswerText()}</span>
          <div className="flex items-center gap-2">
            {getResultText() && (
              <span className="text-base font-semibold">
                {item.status === "skip" ? "..." : getResultText()}
              </span>
            )}
            {getStatusIcon(item.status)}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`mb-2 ${item.type === "drag" ? "col-span-2" : "col-span-1"}`}
      >
        <span className="font-bold  text-lg text-blue-600">
          Câu {questionIndex}:
        </span>{" "}
        <div className="flex gap-2 justify-between flex-1">
          <span>{getAnswerText()}</span>
          <div className="flex items-center gap-2">
            {getResultText() && (
              <span className="text-base font-semibold">
                {item.status === "skip" ? "..." : getResultText()}
              </span>
            )}
            {getStatusIcon(item.status)}
          </div>
        </div>
      </div>
    );
  }
};

export default HistoryQuestionItem;
