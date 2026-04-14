"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { testimonials } from "@/data/products";
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
          <h2 className="font-bebas text-5xl md:text-7xl">
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
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 2,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="pb-16"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="!w-[340px] md:!w-[400px]">
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brasa-orange/20 flex items-center justify-center text-brasa-orange font-bebas text-xl">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bebas text-lg">{t.name}</p>
                    <p className="text-brasa-gray text-xs font-mono">{t.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-brasa-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-brasa-gray text-sm leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
