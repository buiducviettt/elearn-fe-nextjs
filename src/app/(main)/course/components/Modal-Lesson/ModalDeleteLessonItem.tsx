import MyModalDelete from "@/bases/MyModal/MyModalDelete";
import { courseLessonService } from "@/services/courseLesson";
import toastHandler from "@/utils/toastHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ModalDeleteLessonItem = ({ children, id, title }) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const _delete = useMutation({
        mutationFn: (id: number) => courseLessonService.delete(id),
        onSuccess: (response) => {
            setOpen(false);
            toastHandler.success(response?.payload?.message);
            queryClient.invalidateQueries({
                queryKey: [courseLessonService.keyGet],
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
                message={`Bạn có muốn xoá bài học ${title} ?`}
                onOk={() => _delete.mutate(id)}
                confirmLoading={_delete.isPending}
            />
        </>
    );
};

export default ModalDeleteLessonItem;
