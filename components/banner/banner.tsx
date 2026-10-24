"use client";

import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SlideOne from "./slide-one";
import SlideTwo from "./slide-two";
import "swiper/css";
import "swiper/css/effect-fade";

const Banner = () => {
  const slides = [<SlideOne key={"sl1"} />, <SlideTwo key={"sl2"} />];
  return (
    <div className="w-full h-20 md:h-40 xl:h-50">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="w-full h-20 md:h-40 xl:h-50"
      >
        {slides.map((s, index) => (
          <SwiperSlide className="h-full" key={index}>
            {s}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
