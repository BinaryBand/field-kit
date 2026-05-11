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
  const target: HTMLInputElement = document.createElement('input');

  return new Promise((resolve) => {
    target.onchange = (event: Event): void => {
      const target: HTMLInputElement = event.target as HTMLInputElement;
      const file: File | undefined = target.files?.item(0) ?? undefined;
      resolve(file && URL.createObjectURL(file));
    };

    target.accept = 'image/png, image/jpeg, image/gif';
    target.type = 'file';
    target.click();
  });
}
