const STORAGE_KEY = "guestbook-my-entries";

function readIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function writeIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function isMyEntry(id: string): boolean {
  return readIds().has(id);
}

export function addMyEntry(id: string) {
  const ids = readIds();
  ids.add(id);
  writeIds(ids);
}

export function removeMyEntry(id: string) {
  const ids = readIds();
  ids.delete(id);
  writeIds(ids);
}
