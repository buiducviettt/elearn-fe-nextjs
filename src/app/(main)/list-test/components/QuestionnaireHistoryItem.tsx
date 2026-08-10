"use client";
import { 
  FileTextOutlined,
  StarFilled,
  ClockCircleOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { Progress } from "antd";
import MyButton from "@/bases/MyButton";

type QuestionnaireHistoryItemProps = {
  data: any;
  onViewTest?: () => void;
};

const QuestionnaireHistoryItem: React.FC<QuestionnaireHistoryItemProps> = ({ data, onViewTest }) => {
  const { history } = data;

  // Tính phần trăm đúng
  const percent = data.total ? Math.round(((data.score ?? 0) / data.total) * 100) : 0;

  return (
    <>
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-gray-50 rounded-lg p-4 flex flex-col items-center">
          <span className="font-bold mb-1">Phân loại</span>
          <span className="block w-full border-b border-gray-200 mb-2"></span>
          <div className="flex items-center gap-2 w-full justify-center">
            <Progress
              type="circle"
              percent={percent}
              width={40}
              strokeColor="#1677ff"
            />
            <div className="flex flex-col items-start ml-2">
              <span className="text-gray-700 font-semibold">{data.category_name || "Đọc"}</span>
              <span className="text-xs text-gray-500">
                {data.score ?? 0}/{data.total ?? 0}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-4 flex flex-col items-center">
          <span className="font-bold mb-1">Độ khó</span>
          <span className="block w-full border-b border-gray-200 mb-2"></span>
          <div className="flex items-center gap-2 w-full justify-center">
            <Progress
              type="circle"
              percent={percent}
              width={40}
              strokeColor="#52c41a"
            />
            <div className="flex flex-col items-start ml-2">
              <span className="text-gray-700 font-semibold">{data.level_name || "Dễ"}</span>
              <span className="text-xs text-gray-500">
                {data.score ?? 0}/{data.total ?? 0}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-4 flex flex-col items-center">
          <span className="font-bold mb-1">Danh mục</span>
          <span className="block w-full border-b border-gray-200 mb-2"></span>
          <div className="flex items-center gap-2 w-full justify-center">
            <Progress
              type="circle"
              percent={percent}
              width={40}
              strokeColor="#faad14"
            />
            <div className="flex flex-col items-start ml-2">
              <span className="text-gray-700 font-semibold">{data.topic_name || "Chưa phân loại"}</span>
              <span className="text-xs text-gray-500">
                {data.score ?? 0}/{data.total ?? 0}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-4 flex flex-col items-center">
          <span className="font-bold mb-1">Phần</span>
          <span className="block w-full border-b border-gray-200 mb-2"></span>
          <div className="flex items-center gap-2 w-full justify-center">
            <Progress
              type="circle"
              percent={percent}
              width={40}
              strokeColor="#eb2f96"
            />
            <div className="flex flex-col items-start ml-2">
              <span className="text-gray-700 font-semibold">{data.section_name || "Chưa phân loại"}</span>
              <span className="text-xs text-gray-500">
                {data.score ?? 0}/{data.total ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="col-span-1 bg-gray-50 rounded-lg p-4">
          <h3 className="text-gray-800 text-lg font-bold mb-4">Phần kiểm tra</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-8 bg-white rounded-lg p-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                  <FileTextOutlined style={{ fontSize: 16, color: '#64748b' }} />
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-sm">Trắc nghiệm</div>
                  <div className="font-bold text-lg">
                    {(data?.score ?? 0)}/{data?.total ?? 0}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                  <StarFilled style={{ fontSize: 16, color: '#faad14' }} />
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-sm">Tổng điểm</div>
                  <div className="font-bold text-lg">{data?.score ?? 0}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center bg-white rounded-lg p-4">
              <Progress
                type="circle"
                percent={data?.total ? Math.round(((data?.score ?? 0) / data?.total) * 100) : 0}
                format={() => <span style={{ color: "#faad14", fontWeight: 700, fontSize: 30 }}>{data?.score ?? 0}</span>}
                width={200}
                strokeColor="#faad14"
                strokeWidth={10}
                trailColor="#e5e7eb"
              />
            </div>
            <div className="flex flex-col items-center">
              <MyButton
                type="primary"
                className="px-6 py-2 mt-2 text-xl font-bold w-64"
                style={{ fontSize: "1rem" }}
                onClick={onViewTest}
              >
                Xem bài thi
              </MyButton>
            </div>
          </div>
        </div>
        <div className="col-span-1 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">Chi tiết bài thi</h3>
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex flex-row gap-8 justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="icon w-14 h-14 flex items-center justify-center rounded-full bg-green-500">
                    <CheckCircleOutlined style={{ fontSize: 24, color: '#fff' }} />
                  </div>
                  <p className="font-semibold text-green-600">Trả lời đúng</p>
                  <p className="text-lg font-bold text-green-700">{data.correct ?? 0} Câu</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="icon w-14 h-14 flex items-center justify-center rounded-full bg-red-500">
                    <CloseOutlined style={{ fontSize: 24, color: '#fff' }} />
                  </div>
                  <p className="font-semibold text-red-600">Trả lời sai</p>
                  <p className="text-lg font-bold text-red-700">{data.incorrect ?? 0} Câu</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="icon w-14 h-14 flex items-center justify-center rounded-full bg-orange-400">
                    <PlayCircleOutlined style={{ fontSize: 24, color: '#fff' }} />
                  </div>
                  <p className="font-semibold text-orange-500">Đã bỏ qua</p>
                  <p className="text-lg font-bold text-orange-600">{data.skip ?? 0} Câu</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 flex flex-wrap justify-between gap-4">
              <div className="flex flex-col items-center flex-1 min-w-[150px]">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                  <FileTextOutlined style={{ fontSize: 16, color: '#64748b' }} />
                </div>
                <span className="text-gray-500 text-sm">Kết quả làm bài</span>
                <span className="font-bold text-lg mt-1">{data.correct ?? 0}/{data.total ?? 0} Câu</span>
              </div>
              <div className="flex flex-col items-center flex-1 min-w-[150px]">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                  <ClockCircleOutlined style={{ fontSize: 16, color: '#64748b' }} />
                </div>
                <span className="text-gray-500 text-sm">Thời gian làm bài</span>
                <span className="font-bold text-lg mt-1">{data.time ?? "--"}</span>
              </div>
              <div className="flex flex-col items-center flex-1 min-w-[150px]">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                  <LineChartOutlined style={{ fontSize: 16, color: '#64748b' }} />
                </div>
                <span className="text-gray-500 text-sm">Độ chính xác</span>
                <span className="font-bold text-lg mt-1">
                  {data.total ? `${((data.correct ?? 0) / data.total * 100).toFixed(1)}%` : "--"}
                </span>
              </div>
              <div className="flex flex-col items-center flex-1 min-w-[150px]">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                  <CheckCircleOutlined style={{ fontSize: 16, color: '#22c55e' }} />
                </div>
                <span className="text-gray-500 text-sm">Câu đúng</span>
                <span className="font-bold text-lg mt-1">{data.correct ?? 0} / {data.total ?? 0} Câu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionnaireHistoryItem;