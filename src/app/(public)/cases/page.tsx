import { getCases, getCaseCategories } from "@/lib/queries";
import BenefitsStrip from "@/components/BenefitsStrip";
import CasesView from "@/components/cases/CasesView";

export const metadata = {
  title: "Наши кейсы — реальные объекты | Маляр",
  description:
    "Выполненные проекты: фасады жилых комплексов, офисы, школы, торговые центры. Фото, материалы, сроки и результаты.",
};

export default async function CasesPage() {
  const [cases, categories] = await Promise.all([getCases(), getCaseCategories()]);

  return (
    <>
      <CasesView cases={cases} categories={categories} />
      <div className="mx-auto max-w-7xl px-4 pb-14">
        <BenefitsStrip className="rounded-lg bg-cream-100" />
      </div>
    </>
  );
}
