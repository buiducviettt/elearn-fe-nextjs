import LessonCreateContent from "./Content";

const LessonCreatePage = () => {
    return (
        <div className="flex flex-col gap-4">
            <p className="font-semibold text-lg">Tạo bài học</p>
            <LessonCreateContent />
        </div>
    );
};

export default LessonCreatePage;
