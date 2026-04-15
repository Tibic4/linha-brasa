"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const gallery = [
  {
    src: "/images/gallery/caldeira-funcionando.jpg",
    title: "Caldeira em Operação",
    description: "Fogo intenso através do vidro cerâmico Premium",
  },
  {
    src: "/images/gallery/piscina-noite.jpg",
    title: "Piscina Aquecida à Noite",
    description: "Temperatura ideal o ano todo, independente do clima",
  },
  {
    src: "/images/gallery/familia-piscina.jpg",
    title: "Momentos em Família",
    description: "Sua piscina aproveitada no inverno como nunca antes",
  },
  {
    src: "/images/gallery/fabricacao.jpg",
    title: "Fabricação Própria",
    description: "Soldagem MIG certificada em nossa fábrica em Londrina/PR",
  },
];

export default function GallerySection() {
  return (
    <section className="section-padding bg-brasa-bg relative overflow-hidden">
      <span className="watermark font-bebas bottom-10 left-10">GALERIA</span>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-brasa-orange font-mono text-sm tracking-[0.3em] uppercase mb-4">
            Na prática
          </p>
          <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl">
            VEJA A <span className="text-brasa-orange">BRASA</span> EM AÇÃO
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {gallery.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden aspect-[3/2]"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brasa-bg via-brasa-bg/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="font-bebas text-xl sm:text-2xl text-brasa-white mb-1">
                  {item.title}
                </h3>
                <p className="text-brasa-gray text-xs sm:text-sm font-mono">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
