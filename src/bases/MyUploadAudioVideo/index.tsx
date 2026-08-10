import { useState, useEffect, useRef, useCallback } from "react";
import { FaUpload, FaFileAudio, FaPlay, FaPause, FaFileVideo, FaTimes } from "react-icons/fa";
import { Modal, message, Input, Select, Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { mediaService } from "@/services/media";
import MySpin from "../MySpin";
import styles from "./styles.module.scss";
import { PER_PAGE } from "../common";

export type TMyUploadAudioVideoProps = {
  value?: string;
  height?: number;
  hideText?: boolean;
  onChange?: (value: string) => void;
  apiUpload: (file: string | Blob | File) => Promise<string>;
  disabled?: boolean;
  type?: 'audio' | 'video' | 'both';
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

const CustomMediaPlayer = ({ src, onPlay, type }: { src: string; onPlay: () => void; type: 'audio' | 'video' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRef = useRef<HTMLAudioElement | null>(null);

  const stopMedia = () => {
    if (mediaRef.current) {
      mediaRef.current.pause();
      if ('currentTime' in mediaRef.current) {
        mediaRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (!mediaRef.current) {
      onPlay();
      const newMedia = new Audio(src);
      newMedia.onended = () => setIsPlaying(false);
      mediaRef.current = newMedia;
      newMedia.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        mediaRef.current.pause();
        setIsPlaying(false);
      } else {
        onPlay();
        mediaRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopMedia();
      if (mediaRef.current) {
        mediaRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    const playerElement = document.querySelector(`[data-media-src="${src}"]`);
    if (playerElement) {
      (playerElement as any).stop = stopMedia;
    }
    return () => {
      if (playerElement) {
        delete (playerElement as any).stop;
      }
    };
  }, [src]);

  if (type === 'video') return null;

  return (
    <button
      data-media-src={src}
      onClick={handlePlayPause}
      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
    >
      <span className="text-sm">
        {isPlaying ? 'Đang phát' : 'Nhấn để nghe thử'}
      </span>
      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
        {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="ml-0.5" />}
      </div>
    </button>
  );
};

const MyUploadAudioVideo: React.FC<TMyUploadAudioVideoProps> = (props) => {
  const {
    apiUpload,
    onChange,
    value,
    height = 280,
    hideText = false,
    disabled = false,
    type = 'both',
  } = props;
  const [srcMedia, setSrcMedia] = useState<string>("");
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
  const [currentPlayingMedia, setCurrentPlayingMedia] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'audio' | 'video'>('audio');
  const [selectMode, setSelectMode] = useState<'single' | 'multiple'>('single');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const realSrcMedia = value || srcMedia;
  const realOnChange = onChange || setSrcMedia;

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
        media_type: type === 'both' ? selectedType : type
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
      message.error("Không thể tải danh sách media. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [type, selectedType]);

  useEffect(() => {
    if (isModalOpen) {
      setCurrentPage(1);
      setMediaItems([]);
      setFilteredItems([]);
      fetchMediaItems(1);
    }
  }, [isModalOpen, fetchMediaItems, selectedType, type]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchMediaItems(currentPage, { search: searchQuery });
    }
  }, [currentPage, fetchMediaItems, searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = mediaItems
        .filter(Boolean)
        .filter((item) => {
          if (!item || !item.source_url) return false;
          return item.source_url.toLowerCase().includes(searchQuery.toLowerCase());
        });
      setFilteredItems(filtered);
    } else {
      setFilteredItems(mediaItems.filter(Boolean));
    }
  }, [searchQuery, mediaItems]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    fetchMediaItems(1, { search: value });
  }, [fetchMediaItems]);

  const handleMediaSelect = useCallback((mediaUrl: string) => {
    if (selectMode === "multiple") {
      setSelectedItems(prev =>
        prev.includes(mediaUrl)
          ? prev.filter(url => url !== mediaUrl)
          : [...prev, mediaUrl]
      );
    } else {
      setSelectedItem(mediaUrl);
    }
  }, [selectMode]);

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    try {
      await Promise.all(selectedItems.map(async (url) => {
        const item = mediaItems.find(i => i.source_url === url);
        if (item) {
          await mediaService.delete(item.id);
        }
      }));
      message.success('Đã xóa các media đã chọn');
      setSelectMode('single');
      setSelectedItems([]);
      setSelectedItem(null);
      fetchMediaItems(1);
    } catch (error) {
      message.error('Có lỗi khi xóa media');
    }
  };

  const stopAllMediaPlayers = () => {
    document.querySelectorAll('[data-media-src]').forEach((player) => {
      if ((player as any).stop) {
        (player as any).stop();
      }
    });
  };

  const handleModalClose = () => {
    stopAllMediaPlayers();
    setIsModalOpen(false);
    setSelectedItem(null);
    setSelectedItems([]);
    setSelectMode('single');
  };

  const handleConfirm = () => {
    if (selectMode === "multiple") return;
    if (selectedItem) {
      stopAllMediaPlayers();
      realOnChange(selectedItem);
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    const currentType = type === 'both' ? selectedType : type;
    const expectedType = currentType === 'audio' ? 'audio/' : 'video/';
    
    if (!fileType.startsWith(expectedType)) {
      message.error(`Vui lòng chọn file ${currentType === 'audio' ? 'audio' : 'video'}`);
      return;
    }

    setUploading(true);
    try {
      await apiUpload(file);
      await fetchMediaItems(1);
      message.success('Tải media thành công');
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Không thể tải media. Vui lòng thử lại sau.");
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
      const file = files[0];
      const fileType = file.type;
      const currentType = type === 'both' ? selectedType : type;
      const expectedType = currentType === 'audio' ? 'audio/' : 'video/';

      if (!fileType.startsWith(expectedType)) {
        message.error(`Vui lòng chọn file ${currentType === 'audio' ? 'audio' : 'video'}`);
        return;
      }

      setUploading(true);
      try {
        await apiUpload(file);
        message.success('Tải media thành công');
        fetchMediaItems(1);
      } catch (error) {
        console.error("Error uploading file:", error);
        message.error("Không thể tải media. Vui lòng thử lại sau.");
      } finally {
        setUploading(false);
      }
    }
  };

  const getMediaIcon = (mimeType?: string) => {
    if (!mimeType) return <FaFileAudio className="text-blue-500" size={48} />;
    return mimeType.startsWith('audio/') ? 
      <FaFileAudio className="text-blue-500" size={48} /> : 
      <FaFileVideo className="text-purple-500" size={48} />;
  };

  const getMediaType = (mimeType?: string) => {
    if (!mimeType) return 'audio';
    return mimeType.startsWith('audio/') ? 'audio' : 'video';
  };

  return (
    <div className={`flex-1 ${styles.root}`}>
      <div
        className="w-full cursor-pointer"
        style={styleContainer}
        onClick={() => !disabled && setIsModalOpen(true)}
      >
        <div className="flex w-full flex-col gap-1.5 relative min-h-[300px] rounded-md justify-center items-center border border-indigo-300 border-dashed relative">
          {realSrcMedia ? (
            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  realOnChange("");
                }}
                className="bg-gray-100 p-2 rounded-full z-50 absolute flex items-center justify-center top-2 right-2"
              >
                <FaTimes className="text-color-neutral-600" size={20} />
              </button>
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                {getMediaIcon()}
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900 mb-1">
                  {realSrcMedia.split('/').pop()}
                </p>
                <p className="text-sm text-gray-500">
                  Click để thay đổi media
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="bg-white gap-2 flex border text-gray-900 border-gray-200 shadow-sm py-2.5 px-6 rounded-lg">
                  {type === 'both' ? (
                    <>
                      <FaFileAudio size={22} />
                      <FaFileVideo size={22} />
                    </>
                  ) : type === 'audio' ? (
                    <FaFileAudio size={22} />
                  ) : (
                    <FaFileVideo size={22} />
                  )}
                </div>
              </div>
              {!hideText && (
                <div className="flex flex-col items-center gap-2 mt-4">
                  <p className="font-semibold text-gray-900">
                    {type === 'both' ? 'Chọn audio hoặc video từ thư viện' : 
                     type === 'audio' ? 'Chọn audio từ thư viện' : 
                     'Chọn video từ thư viện'}
                  </p>
                  <p className="text-gray-600">Click vào đây để chọn media</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        title={type === 'both' ? 'Chọn audio hoặc video' : 
               type === 'audio' ? 'Chọn audio' : 'Chọn video'}
        open={isModalOpen}
        onCancel={handleModalClose}
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
                  <span className="text-lg font-medium">Đang tải media lên...</span>
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
                    title="Xóa các media đã chọn?"
                    description="Bạn có chắc chắn muốn xóa tất cả media đã chọn?"
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
                  placeholder="Tìm kiếm media..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                  className="flex-1"
                  style={{ height: '40px' }}
                />
                {type === 'both' && (
                  <Select
                    value={selectedType}
                    onChange={setSelectedType}
                    style={{ width: 120, height: '40px' }}
                    options={[
                      { label: 'Audio', value: 'audio' },
                      { label: 'Video', value: 'video' },
                    ]}
                    className="!flex items-center"
                  />
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept={type === 'both' ? 
                    (selectedType === 'audio' ? 'audio/*' : 'video/*') : 
                    (type === 'audio' ? 'audio/*' : 'video/*')}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white h-[40px] px-4 rounded-lg flex items-center gap-2"
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
                      Tải media
                    </>
                  )}
                </button>
              </div>
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
                    {type === 'both' ? (
                      <>
                        <FaFileAudio className="mx-auto text-indigo-500" size={48} />
                        <FaFileVideo className="mx-auto text-indigo-500 mt-4" size={48} />
                      </>
                    ) : type === 'audio' ? (
                      <FaFileAudio className="mx-auto text-indigo-500" size={48} />
                    ) : (
                      <FaFileVideo className="mx-auto text-indigo-500" size={48} />
                    )}
                    <p className="mt-2 text-indigo-600 font-medium">Thả file để tải lên</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 gap-4 relative p-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group cursor-pointer hover:bg-gray-50 transition-colors relative rounded-lg border ${
                      selectMode === "multiple"
                        ? selectedItems.includes(item.source_url)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                        : selectedItem === item.source_url
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                    }`}
                    onClick={() => handleMediaSelect(item.source_url)}
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
                    <div className="w-full p-4">
                      <div className="flex flex-col items-center gap-4">
                        {getMediaIcon(item.mime_type)}
                        <div className="w-full text-center">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                            {item.source_url.split('/').pop()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                        {getMediaType(item.mime_type) === 'audio' && (
                          <CustomMediaPlayer 
                            src={item.source_url} 
                            onPlay={stopAllMediaPlayers}
                            type={getMediaType(item.mime_type)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {hasMore && !loading && (
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="w-full py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mt-4"
                >
                  Tải thêm
                </button>
              )}
            </div>
          </div>
        </MySpin>
      </Modal>
    </div>
  );
};

export default MyUploadAudioVideo;