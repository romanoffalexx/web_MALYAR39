import { getAudiences, getSolutions, getSolution } from "@/lib/queries";
import SolutionsExplorer from "@/components/solutions/SolutionsExplorer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const solution = await getSolution(slug);
  if (!solution) return { title: "Решение не найдено | Маляр" };
  return {
    title: solution.seoTitle ?? `${solution.title} | Маляр`,
    description: solution.seoDescription ?? solution.description ?? undefined,
  };
}

export default async function SolutionSlugPage({ params }: Props) {
  const { slug } = await params;
  const [audiences, solutionsList, currentSolution] = await Promise.all([
    getAudiences(),
    getSolutions(),
    getSolution(slug),
  ]);

  const solutions = await Promise.all(
    solutionsList.map((s) => getSolution(s.slug))
  ).then((results) => results.filter((s): s is NonNullable<typeof s> => s !== null));

  const reordered = currentSolution
    ? [currentSolution, ...solutions.filter((s) => s.slug !== slug)]
    : solutions;

  return <SolutionsExplorer audiences={audiences} solutions={reordered} />;
}
