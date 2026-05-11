export function checkBase64Image(src: string): boolean {
  return /^data:image\/[^;]+;base64,[A-Za-z0-9+/=]+$/.test(src);
}

export function toDataUrl(url: string): Promise<string | undefined> {
  const reader: FileReader = new FileReader();

  return new Promise((resolve) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        reader.onloadend = () =>
          resolve(typeof reader.result === 'string' ? reader.result : undefined);
        reader.readAsDataURL(blob);
      });
  });
}

export async function uploadImage(): Promise<string | undefined> {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [{ description: 'Images', accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] } }],
      multiple: false,
    });
    const file = await handle.getFile();
    return URL.createObjectURL(file);
  } catch {
    return undefined; // user cancelled or API unavailable
  }
}
