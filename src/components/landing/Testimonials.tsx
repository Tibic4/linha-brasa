"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import testimonials from "@/../data/testimonials.json";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export default function Testimonials() {
  return (
    <section className="section-padding bg-brasa-bg-light relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brasa-orange font-mono text-sm tracking-[0.3em] uppercase mb-4">
            Depoimentos
          </p>
          <h2 className="font-bebas text-2xl xs:text-3xl sm:text-5xl md:text-7xl">
            QUEM USA, <span className="text-brasa-orange">RECOMENDA</span>
          </h2>
        </motion.div>

        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          loop
          coverflowEffect={{
            rotate: 5,
            stretch: 0,
            depth: 200,
            modifier: 2,
            slideShadows: false,
          }}
          breakpoints={{
            0: { slidesPerView: 1.2, spaceBetween: 16 },
            640: { slidesPerView: "auto", spaceBetween: 24 },
            1024: { slidesPerView: "auto", spaceBetween: 32 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="pb-16"
        >
          {testimonials.filter((t) => t.active !== false).map((t) => (
            <SwiperSlide key={t.id} className="!w-[280px] sm:!w-[320px] md:!w-[400px]">
              <div className="glass-card rounded-2xl p-5 sm:p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  {t.image ? (
                    t.image.startsWith("/") ? (
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={48}
                        height={48}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-brasa-orange/30"
                      />
                    ) : (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-brasa-orange/30"
                      />
                    )
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brasa-orange/20 flex items-center justify-center text-brasa-orange font-bebas text-lg sm:text-xl">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bebas text-base sm:text-lg">{t.name}</p>
                    <p className="text-brasa-gray text-xs font-mono">{t.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-brasa-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-brasa-gray text-sm leading-relaxed italic mb-3">
                  &ldquo;{t.text}&rdquo;
                </p>
                {(t.model || t.result) && (
                  <div className="border-t border-brasa-border pt-3 flex items-center gap-2 flex-wrap">
                    {t.model && (
                      <span className="font-mono text-[10px] text-brasa-orange bg-brasa-orange/10 px-2 py-0.5 rounded">
                        {t.model}
                      </span>
                    )}
                    {t.poolSize && (
                      <span className="font-mono text-[10px] text-brasa-gold bg-brasa-gold/10 px-2 py-0.5 rounded">
                        {t.poolSize}
                      </span>
                    )}
                    {t.result && (
                      <span className="font-mono text-[10px] text-brasa-green bg-brasa-green/10 px-2 py-0.5 rounded">
                        {t.result}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
