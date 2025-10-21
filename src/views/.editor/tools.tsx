// import { ChangeEvent, CSSProperties, ElementType, MouseEvent } from "react";
// import assert from "assert";

// export const BASE64_VALID: RegExp = /^data:image\/[^;]+;base64,[A-Za-z0-9+/=]+$/;
// export const CSS_SIZE_VALID: RegExp = /^(?:(\d+)(?:px)?)$/;

// export const COLUMN_WIDTHS: number[] = [240, 360, 480, 600, 768, 1024, 1200, 1440];
// export const FONT_SIZES: number[] = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

// async function wrapAttributes(key: string, value: unknown): Promise<string> {
//   switch (typeof value) {
//     case "number":
//     case "string":
//       return `<${key}>${value}</${key}>`;
//     case "object": {
//       const content: string = Object.entries(value!)
//         .map(([k, v]: [string, unknown]) => wrapAttributes(k, v))
//         .join("");
//       return `<${key}>${content}</${key}>`;
//     }
//     default:
//       return "";
//   }
// }

// function objectToXml({ tagname, ...props }: EditorComponent<ElementType>): Promise<string> {
//   const attributes: string = Object.entries(props)
//     .filter(([key]: [string, unknown]) => key !== "id")
//     .map(([key, value]: [string, unknown]) => wrapAttributes(key, value))
//     .join("");

//   return wrapAttributes(`${tagname}`, attributes);
// }

// export async function documentToXml(components: DocumentComponents): Promise<string> {
//   const content: string = Object.values(components).map(objectToXml).join("");
//   const xmlDocument: string = await wrapAttributes("document", content);
//   return xmlDocument;
// }

// export function styleChange(
//   event: ChangeEvent | MouseEvent,
//   value: unknown,
//   styleInit: CSSProperties
// ): CSSProperties {
//   event.preventDefault();

//   assert("name" in event.currentTarget && "value" in event.currentTarget);
//   const name: string = `${event.currentTarget.name}`;
//   value = value === undefined ? event.currentTarget.value : value;

//   let styleCopy: CSSProperties = { ...styleInit, [name]: value };
//   if (value === null) {
//     styleCopy = Object.entries(styleInit)
//       .filter(([key]) => key !== name)
//       .reduce(
//         (acc: CSSProperties, [key, value]: [string, string | number]) => ({ ...acc, [key]: value }),
//         {}
//       );
//   }

//   return styleCopy;
// }

// export function toDataUrl(url: string): Promise<string | undefined> {
//   const reader: FileReader = new FileReader();

//   return new Promise((resolve) => {
//     fetch(url)
//       .then((response) => response.blob())
//       .then((blob) => {
//         reader.onloadend = () =>
//           resolve(typeof reader.result === "string" ? reader.result : undefined);
//         reader.readAsDataURL(blob);
//       });
//   });
// }

// export async function uploadImage(): Promise<string | undefined> {
//   const target: HTMLInputElement = window.document.createElement("input");

//   return new Promise((resolve) => {
//     target.onchange = (event: Event): void => {
//       const target: HTMLInputElement = event.target as HTMLInputElement;
//       const file: File | undefined = target.files?.item(0) ?? undefined;
//       resolve(file && URL.createObjectURL(file));
//     };

//     target.accept = "image/png, image/jpeg, image/gif";
//     target.type = "file";
//     target.click();
//   });
// }
