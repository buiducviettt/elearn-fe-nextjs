import { useState, useEffect, useRef, useCallback } from "react";
import { FaTimes, FaFilePdf, FaFileAudio, FaFileVideo, FaUpload } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { PiFileAudioBold } from "react-icons/pi";
import { PiFilePdfBold } from "react-icons/pi";
import { Modal, message, Input, Select, Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import fileHandler, { getExtension } from "@/utils/fileHandler";
import { mediaService } from "@/services/media";
import MyImage from "../MyImage";
import MySpin from "../MySpin";
import styles from "./styles.module.scss";
import { PER_PAGE } from "../common";

const mediaTypeOptions = [
  { value: 'application', label: 'PDF' },
  { value: 'image', label: 'Hình ảnh' }
];

export type TMyUploadMultipleTypeProps = {
  value?: string;
  height?: number;
  hideText?: boolean;
  onChange?: (value: string) => void;
  apiUpload: (file: string | Blob | File) => Promise<string>;
  disabled?: boolean;
};

interface MediaItem {
  id: number;
  source_url: string;
  link: string;
  date: string;
  media_details?: {
    sizes?: {
      thumbnail?: {
        source_url: string;
      };
    };
  };
  mime_type?: string;
}

const MyUploadMultipleType: React.FC<TMyUploadMultipleTypeProps> = (props) => {
  const {
    apiUpload,
    onChange,
    value,
    height = 280,
    hideText = false,
    disabled = false,
  } = props;
  const [srcFile, setSrcFile] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileType, setFileType] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string>('application');

  // Multi select
  const [selectMode, setSelectMode] = useState<'single' | 'multiple'>('single');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const realSrcFile = value || srcFile;
  const realOnChange = onChange || setSrcFile;

  const isImage = fileHandler.isImage(getExtension(realSrcFile) || "");
  const isAudio = fileHandler.isAudio(getExtension(realSrcFile) || "");
  const isPdf = getExtension(realSrcFile) === "pdf" || "";

  const styleContainer = {
    background: "white",
    "--drag-container-height": `${height - 40}px`,
  } as React.CSSProperties;

  const getFileTypeIcon = (item: MediaItem) => {
    const mimeType = item.mime_type || "";
    const extension = getExtension(item.source_url) || "";
    const fileName = item.source_url.split('/').pop() || '';

    if (fileHandler.isImage(extension)) {
      return null; // Will show image thumbnail
    }

    if (fileHandler.isAudio(extension) || mimeType.startsWith("audio/")) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 p-2">
          <div className={styles.inner}>
            <FaFileAudio className="text-blue-500" size={40} />
            <p className={`text-xs text-center text-gray-600 mt-2 ${styles.tagimg}`}>
              <span className="txt text-white  line-clamp-2">
                {fileName}
              </span>
            </p>
          </div>
        </div>
      );
    }

    if (extension === "pdf" || mimeType === "application/pdf") {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-50">
          <div className={styles.inner}>
            <FaFilePdf className="text-red-500" size={40} />
            <p className={`text-xs text-center text-gray-600 mt-2 ${styles.tagimg}`}>
              <span className="txt text-white  line-clamp-2">
                {fileName}
              </span>
            </p>
          </div>
        </div>
      );
    }

    if (mimeType.startsWith("video/")) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50 p-2">
          <div className={styles.inner}>
            <FaFileVideo className="text-purple-500" size={40} />
            <p className={`text-xs text-center text-gray-600 mt-2 ${styles.tagimg}`}>
              <span className="txt text-white  line-clamp-2">
                {fileName}
              </span>
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const fetchMediaItems = useCallback(async (page: number = 1, filters?: { search?: string; media_type?: string }) => {
    setLoading(true);
    try {
      const response = await mediaService.get({
        per_page: PER_PAGE,
        page: page,
        ...(filters?.search && { search: filters.search }),
        media_type: filters?.media_type || selectedMediaType
      });

      const items = response.payload || [];
      if (Array.isArray(items)) {
        if (page === 1) {
          setMediaItems(items);
          setFilteredItems(items);
        } else {
          setMediaItems(prev => [...prev, ...items]);
          setFilteredItems(prev => [...prev, ...items]);
        }
        setHasMore(items.length >= PER_PAGE);
      }
    } catch (error) {
      console.error("Error fetching media items:", error);
      message.error("Không thể tải danh sách. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [selectedMediaType]);

  useEffect(() => {
    if (isModalOpen) {
      setCurrentPage(1);
      setMediaItems([]);
      setFilteredItems([]);
      fetchMediaItems(1);
    }
  }, [isModalOpen, fetchMediaItems]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchMediaItems(currentPage, { search: searchQuery });
    }
  }, [currentPage, fetchMediaItems, searchQuery]);

  useEffect(() => {
    if (searchQuery || selectedMediaType) {
      let filtered = [...mediaItems].filter(Boolean);
      if (selectedMediaType) {
        filtered = filtered.filter((item) => {
          if (!item || !item.mime_type) return false;
          if (selectedMediaType === 'image') {
            return item.mime_type.startsWith('image/');
          }
          return item.mime_type.startsWith('application/');
        });
      }
      if (searchQuery) {
        filtered = filtered.filter((item) => {
          if (!item || !item.source_url) return false;
          return item.source_url.toLowerCase().includes(searchQuery.toLowerCase());
        });
      }
      setFilteredItems(filtered);
    } else {
      setFilteredItems(mediaItems.filter(Boolean));
    }
  }, [searchQuery, mediaItems, selectedMediaType]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setMediaItems([]);
    setFilteredItems([]);
    fetchMediaItems(1, { media_type: selectedMediaType, search: value });
  }, [fetchMediaItems, selectedMediaType]);

  const handleFileTypeChange = (value: string) => {
    setFileType(value);
    setCurrentPage(1);
    fetchMediaItems(1, { media_type: value, search: searchQuery });
  };

  // Multi select handler
  const handleItemSelect = useCallback((url: string) => {
    if (selectMode === "multiple") {
      setSelectedItems(prev =>
        prev.includes(url)
          ? prev.filter(item => item !== url)
          : [...prev, url]
      );
    } else {
      setSelectedItem(url);
    }
  }, [selectMode]);

  const handleConfirm = () => {
    if (selectMode === "multiple") return;
    if (selectedItem) {
      realOnChange(selectedItem);
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    try {
      await Promise.all(selectedItems.map(async (url) => {
        const item = mediaItems.find(i => i.source_url === url);
        if (item) {
          await mediaService.delete(item.id);
        }
      }));
      message.success('Đã xóa các file đã chọn');
      setSelectMode('single');
      setSelectedItems([]);
      setSelectedItem(null);
      fetchMediaItems(1);
    } catch (error) {
      message.error('Có lỗi khi xóa file');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await apiUpload(file);
      await fetchMediaItems(1);
      message.success('Tải file thành công');
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Không thể tải file. Vui lòng thử lại sau.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploading(true);
      try {
        const file = files[0];
        await apiUpload(file);
        message.success('Tải file thành công');
        fetchMediaItems(1);
      } catch (error) {
        console.error("Error uploading file:", error);
        message.error("Không thể tải file. Vui lòng thử lại sau.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleMediaTypeChange = useCallback((value: string) => {
    setSelectedMediaType(value);
    setCurrentPage(1);
    setMediaItems([]);
    setFilteredItems([]);
    fetchMediaItems(1, { media_type: value, search: searchQuery });
  }, [fetchMediaItems, searchQuery]);

  return (
    <div className={`flex-1 ${styles.root}`}>
      <div
        className="w-full cursor-pointer"
        style={styleContainer}
        onClick={() => !disabled && setIsModalOpen(true)}
      >
        {realSrcFile && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              realOnChange("");
            }}
            className="bg-gray-100 p-2 rounded-full z-50 absolute flex items-center justify-center top-2 right-2"
          >
            <FaTimes className="text-color-neutral-600" size={20} />
          </button>
        )}
        <div className="flex w-full h-full flex-col gap-1.5 relative min-h-[300px] rounded-md justify-center items-center border border-indigo-300 border-dashed">
          <div className="flex justify-center">
            {isImage && (
              <MyImage
                src={realSrcFile}
                fill
                alt="Upload image"
                style={{
                  objectFit: "contain",
                }}
              />
            )}
            {isAudio && (
              <div className="mb-2">
                <audio controls>
                  <source src={realSrcFile} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            {isPdf && <iframe className="aspect-3/4" src={realSrcFile}></iframe>}
          </div>
          {!Boolean(isImage || isAudio) && (
            <div className="flex justify-center">
              <div className="bg-white gap-2 flex border text-gray-900 border-gray-200 shadow-sm py-2.5 px-6 rounded-lg">
                <IoIosImages size={22} />
                <div className="h-full w-[1px] bg-gray-200" />
                <PiFilePdfBold size={22} />
              </div>
            </div>
          )}
          {!hideText && (
            <>
              <div className="flex flex-col items-center gap-2">
                <p className="font-semibold">Chọn hình ảnh từ thư viện</p>
                <p className="text-gray-600">Click vào đây để chọn ảnh</p>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        title="Chọn hình ảnh"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
          setSelectMode('single');
          setSelectedItems([]);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={handleConfirm}
              disabled={selectMode === "multiple" || !selectedItem}
              className={`px-4 py-2 text-white rounded-lg ${
                selectMode === "multiple" || !selectedItem
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Xác nhận
            </button>
          </div>
        }
        width="100%"
        style={{ top: 0, padding: 0 }}
        className={styles.modal}
      >
        <MySpin spinning={loading}>
          <div className="relative">
            {uploading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  <span className="text-lg font-medium">Đang tải file lên...</span>
                </div>
              </div>
            )}
            <div className="mb-4 flex gap-4 items-center">
              <Select
                value={selectMode}
                onChange={v => {
                  setSelectMode(v);
                  setSelectedItems([]);
                  setSelectedItem(null);
                }}
                style={{ width: 180 }}
                options={[
                  { label: "Chọn mặc định", value: "single" },
                  { label: "Chọn nhiều", value: "multiple" }
                ]}
                className="mb-0"
              />
              {selectMode === "multiple" && (
                <div className="flex gap-2">
                  <Popconfirm
                    title="Xóa các file đã chọn?"
                    description="Bạn có chắc chắn muốn xóa tất cả file đã chọn?"
                    onConfirm={handleBulkDelete}
                    okText="Xóa"
                    cancelText="Hủy"
                    disabled={selectedItems.length === 0}
                  >
                    <button
                      type="button"
                      disabled={selectedItems.length === 0}
                      className={`px-3 py-2 rounded-lg text-white ${
                        selectedItems.length
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-red-300 cursor-not-allowed'
                      }`}
                    >
                      Xóa hàng loạt
                    </button>
                  </Popconfirm>
                </div>
              )}
              <div className="flex-1 flex gap-4">
                <Input
                  placeholder="Tìm kiếm..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                />
                <Select
                  defaultValue="application"
                  value={selectedMediaType}
                  style={{ width: 120 }}
                  onChange={handleMediaTypeChange}
                  options={mediaTypeOptions}
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={uploading}
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang tải...
                  </div>
                ) : (
                  <>
                    <FaUpload />
                    Tải lên
                  </>
                )}
              </button>
            </div>
            <div 
              className={`relative ${styles.listimga} overflow-y-auto mb-4`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-indigo-50 bg-opacity-90 flex items-center justify-center border-2 border-indigo-500 border-dashed rounded-lg z-50">
                  <div className="text-center">
                    <IoIosImages className="mx-auto text-indigo-500" size={48} />
                    <p className="mt-2 text-indigo-600 font-medium">Thả file để tải lên</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-10 gap-4 relative p-2">
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                      <span className="text-white">Đang tải file lên...</span>
                    </div>
                  </div>
                )}
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group cursor-pointer hover:opacity-80 transition-opacity relative rounded-lg border ${
                      selectMode === "multiple"
                        ? selectedItems.includes(item.source_url)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                        : selectedItem === item.source_url
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                    }`}
                    onClick={() => handleItemSelect(item.source_url)}
                  >
                    <Popconfirm
                      title="Xóa media"
                      description="Bạn có chắc chắn muốn xóa media này?"
                      onConfirm={async (e) => {
                        e?.stopPropagation();
                        try {
                          await mediaService.delete(item.id);
                          message.success('Xóa media thành công');
                          if (selectedItem === item.source_url) {
                            setSelectedItem(null);
                            realOnChange("");
                          }
                          if (selectedItems.includes(item.source_url)) {
                            setSelectedItems(prev => prev.filter(url => url !== item.source_url));
                          }
                          fetchMediaItems(1);
                        } catch (error) {
                          console.error("Error deleting media:", error);
                          message.error('Không thể xóa media. Vui lòng thử lại sau.');
                        }
                      }}
                      onCancel={(e) => e?.stopPropagation()}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="absolute hidden group-hover:flex top-1 right-1 w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 items-center justify-center rounded-full transition-colors z-20"
                      >
                        <FaTimes size={14} />
                      </button>
                    </Popconfirm>
                    {getFileTypeIcon(item) || (
                      <div className={`${styles.inner}`}>
                        <MyImage
                          src={item.media_details?.sizes?.thumbnail?.source_url || item.source_url}
                          alt="Media thumbnail"
                          width={150}
                          height={150}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept={selectedMediaType === 'application' ? '.pdf' : 'image/*'}
                  className="hidden"
                />
                {hasMore && filteredItems.length >= PER_PAGE && (
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang tải...
                      </div>
                    ) : (
                      "Tải thêm"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </MySpin>
      </Modal>
    </div>
  );
};

export default MyUploadMultipleType;