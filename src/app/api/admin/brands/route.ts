import { NextResponse } from "next/server";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

function transliterate(value: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
    ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
    н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return value
    .toLowerCase()
    .replace(/[а-яё]/gi, (ch) => map[ch.toLowerCase()] || "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Название обязательно" }, { status: 400 });
  }

  const slug = transliterate(name.trim());
  if (!slug) {
    return NextResponse.json({ error: "Не удалось сформировать slug" }, { status: 400 });
  }

  try {
    const [brand] = await db
      .insert(brands)
      .values({ name: name.trim(), slug })
      .returning();

    return NextResponse.json({ brand });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return NextResponse.json(
        { error: "Бренд с таким названием уже существует" },
        { status: 409 }
      );
    }
    console.error("Failed to create brand:", err);
    return NextResponse.json({ error: "Ошибка создания бренда" }, { status: 500 });
  }
}
