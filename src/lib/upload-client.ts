export async function uploadImage(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.url) {
    throw new Error(data.error || "Ошибка загрузки файла");
  }

  return data.url as string;
}
