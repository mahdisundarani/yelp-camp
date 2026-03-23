import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CampgroundsIndex from './pages/CampgroundsIndex';
import CampgroundDetail from './pages/CampgroundDetail';
import CampgroundNew from './pages/CampgroundNew';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campgrounds" element={<CampgroundsIndex />} />
          <Route path="/campgrounds/new" element={<CampgroundNew />} />
          <Route path="/campgrounds/:id" element={<CampgroundDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
