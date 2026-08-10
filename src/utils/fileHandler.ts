export const getExtension = (path: string) => {
  const extension = path.split(".").pop();
  return extension;
};

function isImage(fileName: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
}

function isAudio(fileName: string): boolean {
  const audioExtensions = ["mp3", "wav", "ogg", "flac", "aac", "m4a"];
  return audioExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
}

const fileHandler = {
  getExtension,
  isImage,
  isAudio,
};

export default fileHandler;
