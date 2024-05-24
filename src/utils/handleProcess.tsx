export const handleProcess = (
  type: string,
  i: any,
  setVideo: Function,
  video: any
) => {
  switch (type) {
    case "video-end":
      setVideo((pre: any) => ({
        ...pre,
        isEnd: true,
        videoId: i + 1,
      }));
      break;
    case "video-last":
      setVideo((pre: any) => ({
        ...pre,
        isLastVideo: true,
      }));
      break;
    case "video-reset":
      setVideo((pre: any) => ({
        ...pre,
        isLastVideo: false,
        videoId: 0,
      }));
      break;
    case "play":
      setVideo((pre: any) => ({
        ...pre,
        isPlaying: !pre.isPlaying,
      }));
      break;

    default:
      return video;
  }
};
