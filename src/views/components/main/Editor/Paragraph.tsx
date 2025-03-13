// import React, {
//   ChangeEvent,
//   ComponentProps,
//   CSSProperties,
//   Fragment,
//   MouseEvent,
//   ReactElement,
// } from "react";
// import { StyledComponent } from "@emotion/styled";
// import { styled } from "@mui/material/styles";

// import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
// import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
// import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
// import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";

// import FormatBoldIcon from "@mui/icons-material/FormatBold";
// import FormatItalicIcon from "@mui/icons-material/FormatItalic";
// import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";

// import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
// import TextIncreaseIcon from "@mui/icons-material/TextIncrease";

// import IconButton from "@mui/material/IconButton";
// import Stack from "@mui/material/Stack";
// import ToggleButton from "@mui/material/ToggleButton";
// import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

// import Multiline from "@/views/components/main/Multiline";
// import CustomToolbar from "@/views/components/main/Editor/Toolbar";
// import { CSS_SIZE_VALID, FONT_SIZES, styleChange } from "./tools";

// const CustomMultiline: StyledComponent<ComponentProps<"textarea">> = styled(Multiline)({
//   background: "transparent",
//   border: "solid #99999944",
//   borderWidth: "0 0 1px",
//   outline: "none",
//   width: "100%",
// });

// export default function ParagraphEditor({
//   moveUp,
//   moveDown,
//   removeSelf,
//   setProps,
//   style = {},
//   ...element
// }: ComponentEditorProps<"p">): ReactElement {
//   const { fontSize, prevFontSize, nextFontSize } = React.useMemo(() => {
//     let fontSize: number = FONT_SIZES[4];
//     if (CSS_SIZE_VALID.test(`${style.fontSize}`)) {
//       const [fontSizeString] = `${style.fontSize}`.match(CSS_SIZE_VALID)!;
//       fontSize = parseInt(fontSizeString, 10);
//     }

//     const closest: number = [...FONT_SIZES].sort(
//       (a: number, b: number) => Math.abs(a - fontSize) - Math.abs(b - fontSize)
//     )[0];

//     const index: number = FONT_SIZES.indexOf(closest);
//     return { fontSize, prevFontSize: FONT_SIZES[index - 1], nextFontSize: FONT_SIZES[index + 1] };
//   }, [style.fontSize]);

//   style.fontSize = React.useMemo(() => `${fontSize}px`, [fontSize]);

//   function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
//     const children: string = event.currentTarget.value;
//     setProps?.((props: EditorComponent<"p">) => ({ ...props, children }));
//   }

//   function handleStyleChange(event: ChangeEvent | MouseEvent, value?: unknown): void {
//     const updatedStyles: CSSProperties = styleChange(event, value, style);
//     setProps?.((props: EditorComponent<"p">) => ({ ...props, style: updatedStyles }));
//   }

//   return (
//     <Fragment>
//       <CustomToolbar
//         moveUp={moveUp}
//         moveDown={moveDown}
//         removeSelf={removeSelf}
//         setProps={setProps}
//         style={style}
//       >
//         <ToggleButtonGroup
//           exclusive
//           onChange={handleStyleChange}
//           size="small"
//           value={style.textAlign}
//         >
//           <ToggleButton children={<FormatAlignLeftIcon />} name="textAlign" value="left" />
//           <ToggleButton children={<FormatAlignCenterIcon />} name="textAlign" value="center" />
//           <ToggleButton children={<FormatAlignRightIcon />} name="textAlign" value="right" />
//           <ToggleButton children={<FormatAlignJustifyIcon />} name="textAlign" value="justify" />
//         </ToggleButtonGroup>

//         <Stack columnGap="3px" direction="row">
//           <ToggleButtonGroup
//             exclusive
//             onChange={handleStyleChange}
//             size="small"
//             value={style.fontWeight}
//           >
//             <ToggleButton children={<FormatBoldIcon />} name="fontWeight" value="bold" />
//           </ToggleButtonGroup>
//           <ToggleButtonGroup
//             exclusive
//             onChange={handleStyleChange}
//             size="small"
//             value={style.fontStyle}
//           >
//             <ToggleButton children={<FormatItalicIcon />} name="fontStyle" value="italic" />
//           </ToggleButtonGroup>
//           <ToggleButtonGroup
//             exclusive
//             onChange={handleStyleChange}
//             size="small"
//             value={style.textDecoration}
//           >
//             <ToggleButton
//               children={<FormatUnderlinedIcon />}
//               name="textDecoration"
//               value="underline"
//             />
//           </ToggleButtonGroup>
//         </Stack>

//         <Stack columnGap={1} direction="row" alignItems="center">
//           <IconButton
//             disabled={!prevFontSize}
//             name="fontSize"
//             onClick={handleStyleChange}
//             value={`${prevFontSize}px`}
//           >
//             <TextDecreaseIcon />
//           </IconButton>
//           {fontSize}px
//           <IconButton
//             disabled={!nextFontSize}
//             name="fontSize"
//             onClick={handleStyleChange}
//             value={`${nextFontSize}px`}
//           >
//             <TextIncreaseIcon />
//           </IconButton>
//         </Stack>
//       </CustomToolbar>

//       <div style={{ display: "flex", width: "100%" }}>
//         <CustomMultiline
//           onChange={handleChange}
//           placeholder="Empty text"
//           style={style}
//           value={`${element.children}`}
//         />
//         <p {...element} data-testid="_tw-text" style={{ ...style, whiteSpace: "preserve" }} />
//       </div>
//     </Fragment>
//   );
// }
