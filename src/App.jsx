import { HashRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar/Navbar';
import { Footer } from './components/layout/Footer/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop/ScrollToTop';
import { Home } from './pages/Home/Home';
import { Syllabus } from './pages/Syllabus/Syllabus';
import { Services } from './pages/Services/Services';
import { ServiceDetail } from './pages/ServiceDetail/ServiceDetail';
import { Tracker } from './pages/Tracker/Tracker';
import { Practice } from './pages/Practice/Practice';
import { NotFound } from './pages/NotFound/NotFound';

/**
 * Application root: a hash-based router (works on any static host without
 * rewrite rules) wrapping the fixed navbar, the routed page and the footer.
 */
function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}

export default App;
