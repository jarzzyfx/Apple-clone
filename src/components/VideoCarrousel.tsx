import { useEffect, useRef, useState, SyntheticEvent } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface VideoState {
  isEnd: boolean;
  startPlay: boolean;
  videoId: number;
  isLastVideo: boolean;
  isPlaying: boolean;
}

export const VideoCarrousel = () => {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLDivElement | null)[]>([]);

  const [video, setVideo] = useState<VideoState>({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState<Event[]>([]);

  const { isEnd, isLastVideo, isPlaying, startPlay, videoId } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });
    gsap.to(".video-carousel_container", {
      scrollTrigger: {
        trigger: ".video-carousel_container",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prev) => ({ ...prev, startPlay: true, isPlaying: true }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 0) {
      if (!isPlaying) {
        videoRef.current[videoId]?.pause();
      } else {
        startPlay && videoRef.current[videoId]?.play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useEffect(() => {
    let currentProgress = 0;
    const span = videoSpanRef.current;
    if (span[videoId]) {
      const anim = gsap.to(span[videoId] as HTMLSpanElement, {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress !== currentProgress) {
            currentProgress = progress;
            gsap.to(videoDivRef.current[videoId] as HTMLDivElement, {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1220
                  ? "10vw"
                  : "4vw",
            });

            gsap.to(span[videoId] as HTMLSpanElement, {
              width: `${currentProgress}%`,
              background: "white",
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId] as HTMLDivElement, {
              width: "12px",
            });
            gsap.to(span[videoId] as HTMLSpanElement, {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(
          (videoRef.current[videoId]?.currentTime || 0) /
            hightlightsSlides[videoId].videoDuration
        );
      };
      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay, loadedData, isPlaying]);

  const handleProcess = (type: string, i: number) => {
    switch (type) {
      case "video-end":
        setVideo((prev) => ({ ...prev, isEnd: true, videoId: i + 1 }));
        break;
      case "video-last":
        setVideo((prev) => ({ ...prev, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((prev) => ({
          ...prev,
          isLastVideo: false,
          videoId: 0,
          isPlaying: true,
        }));
        break;
      case "pause":
      case "play":
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;
      default:
        return video;
    }
  };

  const handleLoadedMetaData = (
    i: number,
    e: SyntheticEvent<HTMLVideoElement>
  ) => {
    console.log(i);
    setLoadedData((prev) => [...prev, e.nativeEvent]);
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div
            className="sm:pr-20 pr-10"
            id={`slider-${list.id}`}
            key={list.id}
          >
            <div id="slider" className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  onEnded={() => {
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last", 0);
                  }}
                  ref={(el) => (videoRef.current[i] = el)}
                  onPlay={() => {
                    setVideo((prev) => ({ ...prev, isPlaying: true }));
                  }}
                  onLoadedMetadata={(e: SyntheticEvent<HTMLVideoElement>) =>
                    handleLoadedMetaData(i, e)
                  }
                  id={`video-${list.id}`}
                  playsInline
                  preload="auto"
                  muted
                  className={`pointer-events-none ${
                    list.id === 2 ? "translate-x-44" : ""
                  }`}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, j) => (
                  <p className="md:text-2xl text-xl font-medium" key={j}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <div
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span
                ref={(el) => (videoSpanRef.current[i] = el)}
                className="absolute h-full w-full rounded-full"
              />
            </div>
          ))}
        </div>
        <button
          className="control-btn"
          onClick={() =>
            handleProcess(
              isLastVideo ? "video-reset" : isPlaying ? "pause" : "play",
              0
            )
          }
        >
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
          />
        </button>
      </div>
    </>
  );
};
