"use client";

import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionDiagram from "@/components/landing/SolutionDiagram";
import ModelsSection from "@/components/landing/ModelsSection";
import CostComparison from "@/components/landing/CostComparison";
import Calculator from "@/components/landing/Calculator";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import GarantiaSection from "@/components/landing/GarantiaSection";
import GallerySection from "@/components/landing/GallerySection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/shared/Footer";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ScrollProgress from "@/components/shared/ScrollProgress";
import { useScrollTracking } from "@/components/shared/AnalyticsEvents";

export default function Home() {
  useScrollTracking();

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <ProblemSection />
        <SolutionDiagram />
        <section id="modelos">
          <ModelsSection />
        </section>
        <CostComparison />
        <Calculator />
        <section id="depoimentos">
          <Testimonials />
        </section>
        <GallerySection />
        <GarantiaSection />
        <section id="faq">
          <FAQ />
        </section>
        <section id="contato">
          <CTASection />
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
