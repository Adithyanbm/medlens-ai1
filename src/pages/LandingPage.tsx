import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import UserRoles from '../components/UserRoles';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Hero />
                <Stats />
                <Features />
                <HowItWorks />
                <UserRoles />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
