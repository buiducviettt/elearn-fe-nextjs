import MyModalDelete from "@/bases/MyModal/MyModalDelete";
import { courseService } from "@/services/course";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ModalDeleteCourseItem = ({ children, id, title }) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const _delete = useMutation({
        mutationFn: (id: number) => courseService.delete(id),
        onSuccess: (response) => {
            setOpen(false);
            toastHandler.success(response?.payload?.message);
            queryClient.invalidateQueries({
                queryKey: [courseService.keyGet],
            });
        },
        onError: (error: any) => {
            toastHandler.error(error?.payload?.message);
        },
    });

    return (
        <>
            {children({ setOpen })}
            <MyModalDelete
                open={open}
                setOpen={setOpen}
                message={`Bạn có muốn xoá khóa học ${title} ?`}
                onOk={() => _delete.mutate(id)}
                confirmLoading={_delete.isPending}
            />
        </>
    );
};

export default ModalDeleteCourseItem;
