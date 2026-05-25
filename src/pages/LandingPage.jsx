import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import FeaturesGrid from '../components/FeaturesGrid';
import HowItWorks from '../components/HowItWorks';
import TestimonialSlider from '../components/TestimonialSlider';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function LandingPage({ isTelegram }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <HeroSection isTelegram={isTelegram} />
      <StatsBar />
      <FeaturesGrid />
      <HowItWorks />
      <TestimonialSlider />
      <CTASection />
      <Footer />
    </div>
  );
}
