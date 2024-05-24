import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { heroVideo, smallHeroVideo } from "../utils";
import { useEffect, useState } from "react";
import { handleVideoSourceSet } from "../utils/handleVideoSource";

export const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  );
  useGSAP(() => {
    gsap.to("#hero", {
      opacity: 1,
      delay: 2,
    });
    gsap.to("#cta", {
      opacity: 1,
      y: 0,
      delay: 2,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      handleVideoSourceSet(setVideoSrc, smallHeroVideo, heroVideo);
    });

    return () => {
      window.removeEventListener("resize", () => {
        handleVideoSourceSet(setVideoSrc, smallHeroVideo, heroVideo);
      });
    };
  }, []);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero" className="hero-title">
          iphone 15 pro
        </p>
        <div className="md:w-10/12 w-9/12">
          <video
            className="pointer-events-none"
            autoPlay
            muted
            playsInline={true}
            key={videoSrc}
          >
            <source type="video/mp4" src={videoSrc} />
          </video>
        </div>
      </div>
      <div
        className="flex flex-col items-center opacity-0 translate-y-20"
        id="cta"
      >
        <a href="#hightlights" className="btn">
          Buy
        </a>
        <p className="font-normal text-xl">From $199/month or $999</p>
      </div>
    </section>
  );
};
