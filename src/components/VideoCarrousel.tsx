import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
export const VideoCarrousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);

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
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    if (videoSpanRef.current[videoId]) {
      // animate the progress of the video
      let anim = gsap.to(videoSpanRef.current[videoId], {
        onUpdate: () => {
          let progress = Math.ceil(anim.progress() * 100);
          if (progress != currentProgress) {
            currentProgress = progress;
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1220
                  ? "10vw"
                  : "4vw",
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              background: "white",
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
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
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };
      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay, loadedData]);

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

  const handleLoadedMetaData = (i: number, e: any) =>
    setLoadedData((prev) => [...prev, e]);

  return (
    <>
      <div id="" className="flex items-center">
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
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                  id={`video-${list.id}`}
                  playsInline={true}
                  preload="auto"
                  muted
                  className={`pointer-events-none ${
                    list.id === 2 && "translate-x-44"
                  }`}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              {/* slider */}
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

      {/* progression tracker */}
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span
                ref={(el) => (videoSpanRef.current[i] = el)}
                className="absolute h-full w-full rounded-full"
              />
            </span>
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
