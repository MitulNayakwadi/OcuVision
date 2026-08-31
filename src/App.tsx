import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Screen } from '@/pages/Screen';
import { About } from '@/pages/About';
import { NotFound } from '@/pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/screen" element={<Screen />} />
        <Route path="/about" element={<About />} />
        {/* A mistyped URL still lands inside the shell, not on a blank page. */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
