import { useState, useEffect, useRef, useCallback } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { Modal, message, Input, Select, Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { mediaService } from "@/services/media";
import MyImage from "../MyImage";
import MySpin from "../MySpin";
import styles from "./styles.module.scss";
import { PER_PAGE } from "../common";

export type TMyUploadImgProps = {
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

const MyUploadImg: React.FC<TMyUploadImgProps> = (props) => {
  const {
    apiUpload,
    onChange,
    value,
    height = 280,
    hideText = false,
    disabled = false,
  } = props;
  const [srcImage, setSrcImage] = useState<string>("");
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
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Multi select
  const [selectMode, setSelectMode] = useState<'single' | 'multiple'>('single');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const realSrcImage = value || srcImage;
  const realOnChange = onChange || setSrcImage;

  const styleContainer = {
    background: "white",
    "--drag-container-height": `${height - 40}px`,
  } as React.CSSProperties;

  const fetchMediaItems = useCallback(async (page: number = 1, filters?: { search?: string }) => {
    setLoading(true);
    try {
      const response = await mediaService.get({
        per_page: PER_PAGE,
        page: page,
        ...(filters?.search && { search: filters.search }),
        media_type: 'image'
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
      message.error("Không thể tải danh sách ảnh. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

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
    if (searchQuery) {
      setFilteredItems(
        mediaItems.filter((item) =>
          item.source_url.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredItems(mediaItems);
    }
  }, [searchQuery, mediaItems]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    fetchMediaItems(1, { search: value });
  }, [fetchMediaItems]);

  // Multi select handler
  const handleImageSelect = useCallback((imageUrl: string) => {
    if (selectMode === "multiple") {
      setSelectedItems(prev =>
        prev.includes(imageUrl)
          ? prev.filter(url => url !== imageUrl)
          : [...prev, imageUrl]
      );
    } else {
      setSelectedItem(imageUrl);
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
      message.success('Đã xóa các ảnh đã chọn');
      setSelectMode('single');
      setSelectedItems([]);
      setSelectedItem(null);
      fetchMediaItems(1);
    } catch (error) {
      message.error('Có lỗi khi xóa ảnh');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await apiUpload(file);
      await fetchMediaItems(1);
      message.success('Tải ảnh thành công');
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Không thể tải ảnh. Vui lòng thử lại sau.");
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
        message.success('Tải ảnh thành công');
        fetchMediaItems(1);
      } catch (error) {
        console.error("Error uploading file:", error);
        message.error("Không thể tải ảnh. Vui lòng thử lại sau.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className={`flex-1`}>
      <div
        className="w-full cursor-pointer"
        style={styleContainer}
        onClick={() => !disabled && setIsModalOpen(true)}
      >
        {realSrcImage && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              realOnChange("");
            }}
            className="bg-gray-100 p-2 rounded-full z-50 absolute flex items-center justify-center top-1 right-1"
          >
            <FaTimes className="text-color-neutral-600" size={20} />
          </button>
        )}
        <div className="flex w-full flex-col gap-1.5 relative min-h-[300px] rounded-md justify-center items-center border border-indigo-300 border-dashed">
          <div className="flex justify-center">
            {realSrcImage && (
              <MyImage
                src={realSrcImage}
                fill
                alt="Upload image"
                style={{
                  objectFit: "contain",
                }}
              />
            )}
          </div>
          {!realSrcImage && (
            <div className="flex justify-center">
              <div className="bg-white gap-2 flex border text-gray-900 border-gray-200 shadow-sm py-2.5 px-6 rounded-lg">
                <IoIosImages size={22} />
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
      >
        <MySpin spinning={loading}>
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
                  title="Xóa các ảnh đã chọn?"
                  description="Bạn có chắc chắn muốn xóa tất cả ảnh đã chọn?"
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
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm ảnh..."
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
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
                  Tải ảnh
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
                    <span className="text-white">Đang tải ảnh lên...</span>
                  </div>
                </div>
              )}
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`relative group cursor-pointer rounded-lg border ${
                    selectMode === "multiple"
                      ? selectedItems.includes(item.source_url)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                      : selectedItem === item.source_url
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                  } hover:border-blue-500 transition-colors`}
                  onClick={() => handleImageSelect(item.source_url)}
                >
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await mediaService.delete(item.id);
                        message.success('Xóa ảnh thành công');
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
                        message.error('Không thể xóa ảnh. Vui lòng thử lại sau.');
                      }
                    }}
                    className="absolute hidden group-hover:flex top-1 right-1 w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 items-center justify-center rounded-full transition-colors z-20"
                  >
                    <FaTimes size={14} />
                  </button>
                  <div className="aspect-square">
                    <MyImage
                      src={item.media_details?.sizes?.thumbnail?.source_url || item.source_url}
                      alt="Media thumbnail"
                      width={150}
                      height={150}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
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
        </MySpin>
      </Modal>
    </div>
  );
};

export default MyUploadImg;