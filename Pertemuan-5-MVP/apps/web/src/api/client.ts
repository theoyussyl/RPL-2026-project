const BaseUrl = "http://localhost:4000/api";

async function ExtractErrorMessage(Response: Response, FallbackMessage: string): Promise<string> {
  try {
    const Data = await Response.json();
    return Data?.Message || FallbackMessage;
  } catch {
    return FallbackMessage;
  }
}

export async function ApiGet<T>(Path: string): Promise<T> {
  const Response = await fetch(`${BaseUrl}${Path}`);
  if (!Response.ok) throw new Error(await ExtractErrorMessage(Response, "Gagal mengambil data"));
  return Response.json();
}

export async function ApiPost<T>(Path: string, Body: unknown): Promise<T> {
  const Response = await fetch(`${BaseUrl}${Path}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Body),
  });
  if (!Response.ok) throw new Error(await ExtractErrorMessage(Response, "Gagal menyimpan data"));
  return Response.json();
}

export async function ApiDelete(Path: string): Promise<void> {
  const Response = await fetch(`${BaseUrl}${Path}`, { method: "DELETE" });
  if (!Response.ok) throw new Error(await ExtractErrorMessage(Response, "Gagal menghapus data"));
}
