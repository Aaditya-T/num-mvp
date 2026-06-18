import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ReportPage from './pages/ReportPage';
import InvoicePage from './pages/InvoicePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/invoice" element={<InvoicePage />} />
      </Routes>
    </Router>
  );
}
