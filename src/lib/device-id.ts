const KEY = "shrinkr_device_id";

function rand() {
  // 16-char random id
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 16);
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = rand();
    localStorage.setItem(KEY, id);
  }
  return id;
}
