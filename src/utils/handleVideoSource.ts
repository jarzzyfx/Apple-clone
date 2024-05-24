export const handleVideoSourceSet = (
  setVideoSrc: any,
  arg1: any,
  arg2: any
) => {
  if (window.innerWidth < 760) {
    setVideoSrc(arg1);
  } else {
    setVideoSrc(arg2);
  }
};
