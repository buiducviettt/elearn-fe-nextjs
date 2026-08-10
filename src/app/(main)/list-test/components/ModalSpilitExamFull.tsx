import { Tabs, Form, Spin } from "antd";
import MyModal from "@/bases/MyModal";
import MyFormTestConfig from "@/bases/MyForm/MyFormTestConfig";
import { Dispatch, SetStateAction, useEffect, useState, useMemo, useCallback } from "react";
import { TQuestionnaireGetResponse } from "@/types/service-get";
import { EXAM_SKILL, TEST_MODE, TEST_TYPES } from "@/types/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "antd/es/form/Form";
import MyCard from "@/bases/MyCard";
import MyFormItem from "@/bases/MyFormItem";
import { formRequired } from "@/constants/common";
import MyInput from "@/bases/MyInput";
import MyGroupSelectTestType from "@/bases/MyGroupSelect/MyGroupSelectTestType";
import MyGroupSelectTestSkill from "@/bases/MyGroupSelect/MyGroupSelectTestSkill";
import MyInputNumber from "@/bases/MyInputNumber";
import MyRadioV1TestCategory from "@/bases/MyRadioV1/MyRadioV1TestCategory";
import MyTextArea from "@/bases/MyTextArea";
import MyGroupSelectTestMode from "@/bases/MyGroupSelect/MyGroupSelectTestMode";
import MyGroupSelectTestExplanation from "@/bases/MyGroupSelect/MyGroupSelectTestExplanation";
import MyGroupSelectTestCannotSubmitUntilTimeout from "@/bases/MyGroupSelect/MyGroupSelectTestCannotSubmitUntilTimeout";
import MyGroupSelectTestCannotSubmitUntilDone from "@/bases/MyGroupSelect/MyGroupSelectTestCannotSubmitUntilDone";
import { validTestPrivateHasInput } from "@/bases/MyGroupSelect/MyGroupSelectTestPrivate/MyGroupSelectTestPrivateHasInput/utils";
import MyGroupSelectTestPrivateHasInput from "@/bases/MyGroupSelect/MyGroupSelectTestPrivate/MyGroupSelectTestPrivateHasInput";
import MyUploadAudioHasApi from "@/bases/MyUploadAudio/MyUploadAudioHasApi";
import { questionnaireService } from "@/services/questionnaire";
import toastHandler from "@/utils/toastHandler";

type TProps = {
  children: (params: {
    setOpen: Dispatch<SetStateAction<boolean>>;
  }) => React.ReactNode;
  data?: TQuestionnaireGetResponse["list"][0];
};

// Component hiển thị progress tạo đề thi
const CreateProgressModal: React.FC<{
  open: boolean;
  sections: any[];
  sectionProgress: { [key: string]: 'pending' | 'loading' | 'success' | 'error' };
  getSectionTitle: (section: any, idx: number) => string;
}> = ({ open, sections, sectionProgress, getSectionTitle }) => {
  return (
    <MyModal
      open={open}
      onCancel={() => {}} // Không cho đóng khi đang tạo
      footer={null}
      closable={false}
      width={600}
      title="Đang tạo các đề thi"
    >
      <div className="p-4">
        <div className="mb-4 text-center">
          <Spin size="large" />
          <p className="mt-2 text-gray-600">Đang tạo {sections.length} đề thi...</p>
        </div>
        
        <div className="space-y-3">
          {sections.map((section, idx) => {
            const sectionKey = String(section?.key ?? idx);
            const status = sectionProgress[sectionKey] || 'pending';
            const title = getSectionTitle(section, idx);
            
            return (
              <div key={sectionKey} className="flex items-center gap-3 p-3 border rounded">
                <div className="flex-shrink-0">
                  {status === 'pending' && (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  )}
                  {status === 'loading' && (
                    <Spin size="small" />
                  )}
                  {status === 'success' && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium">{title}</div>
                  <div className="text-sm text-gray-500">
                    {status === 'pending' && 'Chờ xử lý...'}
                    {status === 'loading' && 'Đang tạo đề thi...'}
                    {status === 'success' && 'Tạo thành công!'}
                    {status === 'error' && 'Có lỗi xảy ra'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MyModal>
  );
};

const SectionForm: React.FC<{
  section: any;
  idx: number;
  data?: TQuestionnaireGetResponse["list"][0];
  onFormChange?: (sectionKey: string, formData: any) => void;
  onSubmit?: (sectionKey: string, values: any) => void;
  onFormReady?: (sectionKey: string, form: any) => void;
}> = ({ section, idx, data, onFormChange, onSubmit, onFormReady }) => {
  const [form] = useForm();
  const [isFormReady, setIsFormReady] = useState(false);
  
  // Memoize để tránh re-compute
  const sectionKey = useMemo(() => String(section?.key ?? idx), [section?.key, idx]);
  const getSectionTitle = useCallback((section: any, idx: number) =>
    section?.label ?? section?.title ?? `Section ${idx + 1}`, []);
  
  const questionnaireSkill = useWatch(["questionnaire_type"], form);
  const questionnaireSkillType = useWatch(["questionnaire_skill"], form) || EXAM_SKILL.reading;

  useEffect(() => {
    if (data && !isFormReady) {
      const sectionTitle = getSectionTitle(section, idx);
      const {
        questionnaire_submit_count,
        questionnaire_private,
        questionnaire_private_code,
      } = data;

      // Tính thời gian cho section này (nếu có)

      form.setFieldsValue({
        // Copy thông tin cơ bản từ đề gốc
        questionnaire_title: `${data.questionnaire_title} - ${sectionTitle}`,
        questionnaire_category: data.questionnaire_category?.id,
        questionnaire_skill: (data as any)?.questionnaire_skill || EXAM_SKILL.reading,
        questionnaire_type: TEST_TYPES.ielts,
        questionnaire_time: data.questionnaire_time || 60, // Thêm thời gian mặc định
        questionnaire_description: `${data.questionnaire_description || ""}\n\nSection: ${sectionTitle}`,
        questionnaire_system: TEST_MODE.yes,
        questionnaire_explanation: data.questionnaire_explanation,
        questionnaire_submit_time: data.questionnaire_submit_time,
        questionnaire_submit_all: data.questionnaire_submit_all,
        questionnaire_private: {
          value: questionnaire_private,
          password: questionnaire_private_code,
        },
        questionnaire_submit_count: Boolean(
          parseInt(questionnaire_submit_count as string)
        ) ? Number(questionnaire_submit_count) : null,
        questionnaire_file: data.questionnaire_file || "",
        
        // Chỉ lưu dữ liệu của section này
        section_key: section?.key || idx,
        section_title: sectionTitle,
        section_description: section?.description || "",
        section_questions: section?.questions || [],
        
        // Tạo structure mới chỉ có section này
        questionnaire_structure: [
          {
            ...section,
            key: section?.key || `section_${idx}`,
            title: sectionTitle,
            questions: section?.questions || []
          }
        ]
      });

      // Notify parent component that form is ready - chỉ gọi 1 lần
      if (onFormReady && !isFormReady) {
        onFormReady(sectionKey, form);
        setIsFormReady(true);
      }
    }
  }, [data, isFormReady, section, idx, getSectionTitle, sectionKey, form, onFormReady]);

  // onFinish handler giống page.tsx
  const onFinish = useCallback((values: any) => {
    if (onSubmit) {
      const dataSubmit = {
        ...values,
        questionnaire_private: values?.questionnaire_private?.value,
        questionnaire_private_code: values?.questionnaire_private?.password,
      };
      onSubmit(sectionKey, dataSubmit);
    }
  }, [onSubmit, sectionKey]);

  // Lắng nghe thay đổi form để callback - debounce để tránh quá nhiều calls
  const handleFormChange = useCallback(() => {
    if (onFormChange) {
      const formData = form.getFieldsValue();
      onFormChange(sectionKey, formData);
    }
  }, [onFormChange, sectionKey, form]);



  return (
    <MyFormTestConfig form={form} onValuesChange={handleFormChange} onFinish={onFinish}>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 grid-cols-12">
          <div className="col-span-12 2xl:col-span-4">
            <MyCard title={`Tạo đề thi - ${getSectionTitle(section, idx)}`}>
              <MyFormItem
                rules={[formRequired]}
                name="questionnaire_title"
                label="Tên đề thi"
              >
                <MyInput placeholder="Nhập tên đề thi" />
              </MyFormItem>
              
              <MyFormItem name="questionnaire_type" label="Loại đề thi">
                <MyGroupSelectTestType />
              </MyFormItem>
              
              {questionnaireSkill === TEST_TYPES.ielts && (
                <MyFormItem
                  name="questionnaire_skill"
                  rules={[formRequired]}
                  label="Phân loại Kỹ năng"
                >
                  <MyGroupSelectTestSkill />
                </MyFormItem>
              )}
              
              <MyFormItem
                name="questionnaire_time"
                rules={[formRequired]}
                label="Thời gian làm bài"
              >
                <MyInputNumber
                  suffix="Phút"
                  className="!w-full"
                  step={1}
                  min={1}
                  placeholder="Nhập vào số phút"
                />
              </MyFormItem>
              
              <MyFormItem
                name="questionnaire_category"
                rules={[formRequired]}
                label="Chuyên mục đề"
              >
                <MyRadioV1TestCategory />
              </MyFormItem>
              
              <MyFormItem name="questionnaire_tag" rules={[]} label="Tag">
                <MyInput placeholder="Nhập tag" />
              </MyFormItem>
              
              <MyFormItem name="questionnaire_description" label="Mô tả">
                <MyTextArea rows={5} placeholder="Nhập mô tả" />
              </MyFormItem>
              
                <MyFormItem
                  name="questionnaire_system"
                  rules={[formRequired]}
                  label="Chế độ làm bài"
                >
                  <MyGroupSelectTestMode  />
                </MyFormItem>
              <MyFormItem
                rules={[formRequired]}
                name="questionnaire_explanation"
                label="Hiển thị lời giải"
              >
                <MyGroupSelectTestExplanation />
              </MyFormItem>
              
              <MyFormItem
                rules={[formRequired]}
                name="questionnaire_submit_time"
                label="Hết thời gian mới được nộp bài"
              >
                <MyGroupSelectTestCannotSubmitUntilTimeout />
              </MyFormItem>
              
              <MyFormItem
                rules={[formRequired]}
                name="questionnaire_submit_all"
                label="Làm hết câu hỏi mới được nộp bài"
              >
                <MyGroupSelectTestCannotSubmitUntilDone />
              </MyFormItem>
              
              <MyFormItem
                name="questionnaire_private"
                rules={[formRequired, { validator: validTestPrivateHasInput }]}
                label="Riêng tư"
              >
                <MyGroupSelectTestPrivateHasInput />
              </MyFormItem>
              
              <MyFormItem
                name="questionnaire_submit_count"
                label="Giới hạn số lần làm bài"
              >
                <MyInputNumber
                  className="!w-full"
                  step={1}
                  min={0}
                  placeholder="Không nhập nếu không giới hạn"
                />
              </MyFormItem>
              
              {questionnaireSkill === TEST_TYPES.ielts && questionnaireSkillType === EXAM_SKILL.listening && (
                <MyFormItem label="Upload file" name="questionnaire_file">
                  <MyUploadAudioHasApi />
                </MyFormItem>
              )}
            </MyCard>
          </div>
        </div>
      </div>
    </MyFormTestConfig>
  );
};

// Component chính
const ModalSpilitExamFull: React.FC<TProps> = (props) => {
  const { children, data } = props;
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string | undefined>(undefined);
  const [sectionFormsData, setSectionFormsData] = useState<{ [key: string]: any }>({});
  const [sectionForms, setSectionForms] = useState<{ [key: string]: any }>({});
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [sectionProgress, setSectionProgress] = useState<{ [key: string]: 'pending' | 'loading' | 'success' | 'error' }>({});

  const sections = useMemo(() => data?.questionnaire_structure || [], [data?.questionnaire_structure]); 

  const getSectionKey = (section: any, idx: number) => String(section?.key ?? idx);
  const getSectionTitle = (section: any, idx: number) =>
    section?.label ?? section?.title ?? `Section ${idx + 1}`;

  // Memoize callbacks để tránh re-render vô hạn
  const handleSectionFormChange = useCallback((sectionKey: string, formData: any) => {
    setSectionFormsData(prev => ({
      ...prev,
      [sectionKey]: formData
    }));
  }, []);

  // Callback khi form sẵn sàng - memoize để tránh re-render
  const handleFormReady = useCallback((sectionKey: string, form: any) => {
    setSectionForms(prev => {
      // Chỉ update nếu chưa có form này để tránh loop
      if (prev[sectionKey]) return prev;
      return {
        ...prev,
        [sectionKey]: form
      };
    });
  }, []);

  // Khởi tạo active tab khi mở modal
  useEffect(() => {
    if (open && sections.length > 0) {
      const firstKey = getSectionKey(sections[0], 0);
      setActiveTabKey(firstKey);
    }
  }, [open, sections]);
  // Mutation giống page.tsx - bỏ toast để xử lý trong progress
  const createMutation = useMutation({
    mutationFn: (data: any) => questionnaireService.post(data),
  });
  // Handler để nhận data từ form submit - memoize
  const handleSectionSubmit = useCallback((sectionKey: string, values: any) => {
    console.log(`Submit section ${sectionKey}:`, values);
    createMutation.mutate(values);
  }, [createMutation]);

  // Hàm xử lý submit tất cả sections
  const handleSubmitAll = async () => {
    console.log('Tạo các đề thi riêng lẻ...');
    console.log('Available forms:', Object.keys(sectionForms));
    console.log('Expected sections:', sections.length);
    
    if (Object.keys(sectionForms).length === 0) {
      toastHandler.error('Chưa có form nào sẵn sàng');
      return;
    }
    
    // Kiểm tra tất cả sections đã có form chưa
    if (Object.keys(sectionForms).length < sections.length) {
      toastHandler.error(`Chỉ có ${Object.keys(sectionForms).length}/${sections.length} form sẵn sàng. Vui lòng đợi tất cả forms tải xong.`);
      return;
    }
    
    // Khởi tạo progress cho tất cả sections
    const initialProgress: { [key: string]: 'pending' | 'loading' | 'success' | 'error' } = {};
    Object.keys(sectionForms).forEach(key => {
      initialProgress[key] = 'pending';
    });
    setSectionProgress(initialProgress);
    setShowProgressModal(true);
    
    // Gọi API tạo từng đề thi
    try {
      let successCount = 0;
      let errorCount = 0;
      const totalCount = Object.keys(sectionForms).length;
      
      for (const [sectionKey, form] of Object.entries(sectionForms)) {
        // Set loading state cho section hiện tại
        setSectionProgress(prev => ({
          ...prev,
          [sectionKey]: 'loading'
        }));
        
        try {
          // Validate form trước
          const values = await form.validateFields();
          console.log(`Form ${sectionKey} validation success:`, values);
          
          // Chuẩn bị dữ liệu theo format của page.tsx
          const apiData = {
            ...values,
            // Transform như trong page.tsx
            questionnaire_private: values?.questionnaire_private?.value,
            questionnaire_private_code: values?.questionnaire_private?.password,
          };
          
          console.log(`Gửi API cho section ${sectionKey}:`, apiData);
          
          // Sử dụng mutation để tạo từng đề thi
          try {
            await new Promise((resolve, reject) => {
              createMutation.mutate(apiData, {
                onSuccess: (response) => {
                  console.log(`Section ${sectionKey} tạo thành công:`, response);
                  setSectionProgress(prev => ({
                    ...prev,
                    [sectionKey]: 'success'
                  }));
                  successCount++;
                  resolve(true);
                },
                onError: (error) => {
                  console.error(`Section ${sectionKey} tạo lỗi:`, error);
                  setSectionProgress(prev => ({
                    ...prev,
                    [sectionKey]: 'error'
                  }));
                  errorCount++;
                  resolve(false); // Resolve với false thay vì reject để tiếp tục
                }
              });
            });
          } catch (apiError) {
            console.error(`API error for section ${sectionKey}:`, apiError);
            setSectionProgress(prev => ({
              ...prev,
              [sectionKey]: 'error'
            }));
            errorCount++;
          }
        } catch (validationError) {
          console.error(`Form validation error for section ${sectionKey}:`, validationError);
          setSectionProgress(prev => ({
            ...prev,
            [sectionKey]: 'error'
          }));
          errorCount++;
          
          if (validationError && typeof validationError === 'object' && 'errorFields' in validationError) {
            const errorFields = (validationError as any).errorFields;
            const fieldNames = errorFields?.map((field: any) => field.name?.[0] || field.name).join(', ');
            console.error(`Tab ${getSectionTitle(sections[parseInt(sectionKey)], parseInt(sectionKey))}: Thiếu thông tin - ${fieldNames}`);
          }
        }
        
        // Delay nhỏ để user thấy progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Delay trước khi đóng để user thấy kết quả
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Đóng progress modal
      setShowProgressModal(false);
      
      // Hiển thị kết quả tổng
      if (successCount > 0 && errorCount > 0) {
        toastHandler.success(`Đã tạo thành công ${successCount}/${totalCount} đề thi! (${errorCount} thất bại)`);
      } else if (successCount > 0) {
        toastHandler.success(`Đã tạo thành công ${successCount}/${totalCount} đề thi!`);
      } else {
        toastHandler.error(`Tất cả ${totalCount} đề thi đều tạo thất bại`);
      }
      
      // Refresh danh sách nếu có ít nhất 1 đề thi tạo thành công
      if (successCount > 0) {
        queryClient.invalidateQueries({
          queryKey: [questionnaireService.keyGet]
        });
        
        setOpen(false);
      }
      
    } catch (error) {
      console.error('Lỗi khi tạo đề thi:', error);
      setShowProgressModal(false);
      toastHandler.error('Có lỗi xảy ra khi tạo đề thi');
    }
  };

  return (
    <>
      {children({ setOpen })}
      
      {/* Progress Modal */}
      <CreateProgressModal
        open={showProgressModal}
        sections={sections}
        sectionProgress={sectionProgress}
        getSectionTitle={getSectionTitle}
      />
      
      <MyModal
        open={open}
        setOpen={setOpen}
        onCancel={() => setOpen(false)}
        width={"100%"}
        footer={null}
        title={`Phân tách đề thi "${data?.questionnaire_title}" thành ${sections.length} đề lẻ`}
      >
        <div className="flex flex-col h-full">
          {/* <div className="mb-4 p-4 bg-blue-50 rounded">
            <p className="text-sm text-blue-700">
              Đang phân tách đề thi thành {sections.length} đề lẻ tương ứng với từng section.
              Mỗi tab chỉ chứa câu hỏi của section đó và sẽ tạo thành một đề thi riêng biệt.
            </p>
          </div> */}
          
          <Tabs
            className="flex-1"
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            type="card"
            destroyInactiveTabPane={false} // Không destroy tabs khi inactive
            items={sections.map((section: any, idx: number) => ({
              key: getSectionKey(section, idx),
              label: (
                <span className="flex items-center gap-2">
                  {getSectionTitle(section, idx)}
                </span>
              ),
              children: (
                <SectionForm
                  section={section}
                  idx={idx}
                  data={data}
                  onFormChange={handleSectionFormChange}
                  onSubmit={handleSectionSubmit}
                  onFormReady={handleFormReady}
                />
              ),
              forceRender: true // Force render tất cả tabs ngay từ đầu
            }))}
          />
          
          <div className="mt-4 p-4 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmitAll}
              disabled={showProgressModal || Object.keys(sectionForms).length < sections.length}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {showProgressModal ? 'Đang tạo...' : 
               Object.keys(sectionForms).length < sections.length ? 
               `Đang tải forms... (${Object.keys(sectionForms).length}/${sections.length})` : 
               `Tạo ${sections.length} đề thi`}
            </button>
          </div>
        </div>
      </MyModal>
    </>
  );
};

export default ModalSpilitExamFull;