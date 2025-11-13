// import React, { Fragment, ReactElement, RefObject } from "react";

// import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
// import IconButton from "@mui/material/IconButton";

// import CustomToolbar from "@/views/components/main/Editor/Toolbar";
// import { BASE64_VALID, toDataUrl, uploadImage } from "@/views/components/main/Editor/tools";

// function ImageEditor({
//   moveUp,
//   moveDown,
//   removeSelf,
//   setProps,
//   style = {},
//   ...element
// }: ComponentEditorProps<"img">): ReactElement {
//   const imageRef: RefObject<HTMLImageElement> = React.useRef<HTMLImageElement>(null);

//   const loadImageMemo = React.useCallback(
//     async function loadImage(): Promise<void> {
//       const image: HTMLImageElement = imageRef.current!;
//       if (!BASE64_VALID.test(image.src)) {
//         const src: string | undefined = await toDataUrl(image.src);
//         setProps?.(
//           (component: EditorComponent<"img">): EditorComponent<"img"> => ({ ...component, src })
//         );
//       }
//     },
//     [setProps]
//   );

//   function forceUpload(): void {
//     if (element.src === undefined) {
//       const callback = (src?: string) =>
//         setProps?.((component: EditorComponent<"img">) => ({ ...component, src }));
//       uploadImage().then(callback);
//     }
//   }

//   function setImage(): void {
//     if (element.src === undefined) {
//       forceUpload();
//     } else {
//       setProps?.((component: EditorComponent<"img">) => ({
//         ...component,
//         src: undefined,
//       }));
//     }
//   }

//   React.useEffect(forceUpload, [element.src, setProps]);

//   React.useEffect((): (() => void) | void => {
//     const currentImageRef: HTMLImageElement | null = imageRef.current;

//     if (currentImageRef !== null) {
//       currentImageRef.addEventListener("load", loadImageMemo);
//       return (): void => currentImageRef.removeEventListener("load", loadImageMemo);
//     }
//   }, [loadImageMemo]);

//   return (
//     <Fragment>
//       <CustomToolbar
//         moveUp={moveUp}
//         moveDown={moveDown}
//         removeSelf={removeSelf}
//         setProps={setProps}
//         style={style}
//       >
//         <IconButton children={<ChangeCircleIcon />} onClick={setImage} />
//       </CustomToolbar>

//       <div style={{ display: "flex", width: "100%" }}>
//         <img {...element} ref={imageRef} style={{ ...style, maxWidth: "100%" }} />
//       </div>
//     </Fragment>
//   );
// }

// export default ImageEditor;
