const BaseUrl = "http://localhost:4000/api";

export async function ApiGet<T>(Path: string): Promise<T> {
  const Response = await fetch(`${BaseUrl}${Path}`);
  if (!Response.ok) throw new Error("Gagal mengambil data");
  return Response.json();
}

export async function ApiPost<T>(Path: string, Body: unknown): Promise<T> {
  const Response = await fetch(`${BaseUrl}${Path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Body),
  });
  if (!Response.ok) throw new Error("Gagal menyimpan data");
  return Response.json();
}

export async function ApiPut<T>(Path: string, Body: unknown): Promise<T> {
  const Response = await fetch(`${BaseUrl}${Path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Body),
  });
  if (!Response.ok) throw new Error("Gagal memperbarui data");
  return Response.json();
}

export async function ApiDelete(Path: string): Promise<void> {
  const Response = await fetch(`${BaseUrl}${Path}`, { method: "DELETE" });
  if (!Response.ok) throw new Error("Gagal menghapus data");
}

export async function ApiUpload<T>(Path: string, Data: FormData): Promise<T> {
  const Response = await fetch(`${BaseUrl}${Path}`, { method: "POST", body: Data });
  if (!Response.ok) throw new Error("Gagal mengunggah data");
  return Response.json();
}
