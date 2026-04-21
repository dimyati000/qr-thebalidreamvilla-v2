import PromotionPage from "../PromotionPage";
import seminyak from "../../assets/promotions/seminyak.jpg";

export default function Canggu() {
  return (
    <PromotionPage
      title="Seminyak"
      images={[seminyak]}
    />
  );
}