import LessonListContent from "./Content";

const LessonList = () => {
    return (
        <div className="flex flex-col gap-4">
            <p className="font-semibold text-lg">Danh sách bài học</p>
            <LessonListContent />
        </div>
    );
};

export default LessonList;
