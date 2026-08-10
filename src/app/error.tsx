"use client";

import MyButton from "@/bases/MyButton";

const error = () => {
  return (
    <div className="bg-gray-100 px-2  text-center">
      <div className="h-screen flex flex-col gap-6 justify-center items-center">
        <h1 className="text-8xl font-extrabold text-red-500">500</h1>
        <p className="text-4xl font-medium text-gray-800">
          Đã có lỗi xảy ra trong quá trình tải trang :(
        </p>
        <div className="mt-5">
          <MyButton
            variant="solid"
            type="primary"
            size="large"
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </MyButton>
        </div>
      </div>
    </div>
  );
};

export default error;
