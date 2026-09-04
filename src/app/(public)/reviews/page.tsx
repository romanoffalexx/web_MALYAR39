import { getReviews, getCases } from "@/lib/queries";
import BenefitsStrip from "@/components/BenefitsStrip";
import ReviewsView from "@/components/reviews/ReviewsView";

export const metadata = {
  title: "Фото- и видеообзоры — Маляр",
  description:
    "Обзоры красок и штукатурок: видеообзоры нанесения, фотообзоры готовых объектов, советы по выбору материалов.",
};

export default async function ReviewsPage() {
  const [reviews, cases] = await Promise.all([getReviews(), getCases()]);

  return (
    <>
      <ReviewsView reviews={reviews} casesCount={cases.length} />
      <div className="mx-auto max-w-7xl px-4 pb-14">
        <BenefitsStrip className="rounded-lg bg-cream-100" />
      </div>
    </>
  );
}
