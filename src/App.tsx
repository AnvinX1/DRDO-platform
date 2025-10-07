import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Technologies from './components/Technologies';
import Patents from './components/Patents';
import Companies from './components/Companies';
import Forecasting from './components/Forecasting';
import DataSources from './components/DataSources';
import Alerts from './components/Alerts';
import Settings from './components/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Sample data is now loaded manually via the Dashboard button

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'technologies':
        return <Technologies />;
      case 'patents':
        return <Patents />;
      case 'companies':
        return <Companies />;
      case 'forecasting':
        return <Forecasting />;
      case 'data-sources':
        return <DataSources />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout onNavigate={setCurrentPage}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
