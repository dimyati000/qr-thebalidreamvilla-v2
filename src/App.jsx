import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GalleryPage from "./pages/GalleryPage";
import Compendium from "./pages/galleries/Compendium";
import Facilities from "./pages/galleries/Facilities";
import Food from "./pages/galleries/Food";
import Rules from "./pages/galleries/Rules";
import Spa from "./pages/galleries/Spa";
import Canggu from "./pages/promotions/canggu";

import PromotionPage from "./pages/PromotionPage";
import canggu1 from "./assets/promotions/canggu.jpg";
import seminyak1 from "./assets/promotions/seminyak.jpg";
import suite1 from "./assets/promotions/suite.jpg";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full bg-stone-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compendium" element={<Compendium />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/food" element={<Food />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/spa" element={<Spa />} />
          <Route path="/canggu" element={<Canggu />} />
{/* 
          <Route
            path="/canggu"
            element={<GalleryPage title="Canggu" images={[canggu1]} />}
          /> */}

          <Route
            path="/seminyak"
            element={<GalleryPage title="Seminyak" images={[seminyak1]} />}
          />

          <Route
            path="/suite"
            element={<GalleryPage title="Suite" images={[suite1]} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
