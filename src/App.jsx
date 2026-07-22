import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GalleryPage from "./pages/GalleryPage";
import GuestExperience from "./pages/galleries/GuestExperience";
import CompendiumSeminyak from "./pages/galleries/CompendiumSeminyak";
import CompendiumSuite from "./pages/galleries/CompendiumSuite";
import CompendiumCanggu from "./pages/galleries/CompendiumCanggu";
import ResortGuidelines from "./pages/galleries/ResortGuidelines";
import LeisureEntertainment from "./pages/galleries/LeisureEntertainment";
import Food from "./pages/galleries/Food";
import Spa from "./pages/galleries/Spa";
import PromotionPage from "./pages/PromotionPage";
import Canggu from "./pages/promotions/canggu";
import Seminyak from "./pages/promotions/seminyak";
import Suite from "./pages/promotions/suite";
import PromotionSpa from "./pages/promotions/PromotionSpa";
import PromotionCanang from "./pages/promotions/PromotionCanang";
import PromotionDining from "./pages/promotions/PromotionDining";
import PromotionCooking from "./pages/promotions/PromotionCooking";
import PromotionRomantic from "./pages/promotions/PromotionRomantic";

// import canggu1 from "./assets/promotions/canggu.jpg";
// import seminyak1 from "./assets/promotions/seminyak.jpg";
// import suite1 from "./assets/promotions/suite.jpg";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full bg-stone-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guest-experience" element={<GuestExperience />} />
          <Route path="/compendium-seminyak" element={<CompendiumSeminyak />} />
          <Route path="/compendium-suite" element={<CompendiumSuite />} />
          <Route path="/compendium-canggu" element={<CompendiumCanggu />} />
          <Route path="/leisure-entertainment" element={<LeisureEntertainment />} />
          <Route path="/resort-guidelines" element={<ResortGuidelines />} />
          <Route path="/food" element={<Food />} />
          <Route path="/spa" element={<Spa />} />
          <Route path="/canggu" element={<Canggu />} />
          <Route path="/seminyak" element={<Seminyak />} />
          <Route path="/suite" element={<Suite />} />
          <Route path="/promotion-spa" element={<PromotionSpa />} />
          <Route path="/promotion-canang" element={<PromotionCanang />} />
          <Route path="/promotion-dining" element={<PromotionDining />} />
          <Route path="/promotion-cooking" element={<PromotionCooking />} />
          <Route path="/promotion-romantic" element={<PromotionRomantic />} />
{/*       <Route
            path="/canggu"
            element={<GalleryPage title="Canggu" images={[canggu1]} />}
          /> 

          <Route
            path="/seminyak"
            element={<GalleryPage title="Seminyak" images={[seminyak1]} />}
          />

          <Route
            path="/suite"
            element={<GalleryPage title="Suite" images={[suite1]} />}
          />*/}
        </Routes> 
      </div>
    </BrowserRouter>
  );
}

export default App;
