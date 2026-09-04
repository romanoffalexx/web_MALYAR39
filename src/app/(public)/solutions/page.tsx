import { getAudiences, getSolutions, getSolution } from "@/lib/queries";
import SolutionsExplorer from "@/components/solutions/SolutionsExplorer";

export const metadata = {
  title: "Типовые решения — готовые системы покрытий | Маляр",
  description: "Готовые системы покрытий для застройщиков, заводов, строительных и муниципальных объектов. Подберите оптимальное решение для вашего объекта.",
};

export default async function SolutionsPage() {
  const [audiences, solutionsList] = await Promise.all([getAudiences(), getSolutions()]);

  const solutions = await Promise.all(
    solutionsList.map((s) => getSolution(s.slug))
  ).then((results) => results.filter((s): s is NonNullable<typeof s> => s !== null));

  return <SolutionsExplorer audiences={audiences} solutions={solutions} />;
}
