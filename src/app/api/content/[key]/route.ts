import { NextResponse } from "next/server";
import { getContentBlock } from "@/lib/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  if (!key || !/^[a-z0-9_-]+$/.test(key)) {
    return NextResponse.json({ error: "Некорректный ключ" }, { status: 400 });
  }

  const block = await getContentBlock(key);

  if (!block) {
    return NextResponse.json({ error: "Блок не найден" }, { status: 404 });
  }

  return NextResponse.json({ contentBlock: block });
}
