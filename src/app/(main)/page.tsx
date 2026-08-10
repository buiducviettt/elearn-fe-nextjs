import Content from "./list-question/Content";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-semibold text-lg">Danh sách câu hỏi</p>
      <Content />
    </div>
  );
};

export default HomePage;
