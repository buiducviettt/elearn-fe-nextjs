import CourseCreateContent from "./Content";

const CourseCreatePage = () => {
    return (
        <div className="flex flex-col gap-4">
            <p className="font-semibold text-lg">Tạo khóa học</p>
            <CourseCreateContent />
        </div>
    );
};

export default CourseCreatePage;
