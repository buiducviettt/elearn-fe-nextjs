import CourseListContent from "./Content";

const CourseList = () => {
    return (
        <div className="flex flex-col gap-4">
            <p className="font-semibold text-lg">Danh sách khóa học</p>
            <CourseListContent />
        </div>
    );
};

export default CourseList;
