import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import FeaturesGrid from '../components/FeaturesGrid';
import HowItWorks from '../components/HowItWorks';
import TestimonialSlider from '../components/TestimonialSlider';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function LandingPage({ isTelegram, onEnterApp }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar onEnterApp={onEnterApp} />
      <HeroSection isTelegram={isTelegram} onEnterApp={onEnterApp} />
      <StatsBar />
      <FeaturesGrid />
      <HowItWorks />
      <TestimonialSlider />
      <CTASection onEnterApp={onEnterApp} />
      <Footer />
    </div>
  );
}
