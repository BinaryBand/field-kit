// // import React, { ChangeEvent, CSSProperties, ElementType, MouseEvent, ReactElement } from "react";
// import React, { ComponentProps, ReactElement } from "react";
// import styled, { StyledComponent } from "@emotion/styled";

// // import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
// // import AlignHorizontalCenterIcon from "@mui/icons-material/AlignHorizontalCenter";
// // import AlignHorizontalRightIcon from "@mui/icons-material/AlignHorizontalRight";

// // import CompressIcon from "@mui/icons-material/Compress";
// // import ExpandIcon from "@mui/icons-material/Expand";

// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import DeleteIcon from "@mui/icons-material/Delete";

// // import CompressIcon from '@mui/icons-material/Compress';
// // import ExpandIcon from '@mui/icons-material/Expand';

// // import Divider from "@mui/material/Divider";
// // import IconButton from "@mui/material/IconButton";
// // import Paper from "@mui/material/Paper";
// // import Stack, { StackProps } from "@mui/material/Stack";
// // import ToggleButton from "@mui/material/ToggleButton";
// // import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

// // import Stack from '@inline/Stack';

// // import { CSS_SIZE_VALID, COLUMN_WIDTHS, styleChange } from "./tools";

// const CustomToolbar: StyledComponent<ComponentProps<'div'>> = styled.div`
//   align-items: stretch;
//   display: flex;
//   margin: 0.5rem 0;
//   padding: 0.25rem 0;
//   width: 100%;

//   border: 1px solid;
//   border-radius: 0.5rem;

//   & > * {
//     align-items: center;
//     display: flex;
//     margin: 0 0.5rem;

//     &:not(:last-child) {
//       border-right: 1px solid;
//       padding-right: 1rem;
//     }
//   }
// `;

// // function styleChange(event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>, styleInit?: React.CSSProperties): React.CSSProperties {
// //   event.preventDefault();

// //   const name: string = event.currentTarget.name;
// //   const value: string = event.currentTarget.value;

// //   return { ...styleInit, [name]: value };
// // }

// const COLUMN_WIDTHS: string[] = ['420px', '640px'];

// function Toolbar({ children, remove, moveUp, moveDown, ...props }: ToolbarProps): ReactElement {
//   // const [widthIndex, setWidthIndex] = React.useState(COLUMN_WIDTHS.indexOf(props.style?.width));

//   // const { colWidth, prevWidth, nextWidth } = React.useMemo(() => {
//   //   let colWidth: number = COLUMN_WIDTHS[COLUMN_WIDTHS.length - 1];
//   //   if (CSS_SIZE_VALID.test(`${style.width}`)) {
//   //     const [, widthString] = `${style.width}`!.match(CSS_SIZE_VALID)!;
//   //     colWidth = parseInt(widthString, 10);
//   //   }

//   //   const closest: number = [...COLUMN_WIDTHS].sort(
//   //     (a, b) => Math.abs(a - colWidth) - Math.abs(b - colWidth)
//   //   )[0];
//   //   const index: number = COLUMN_WIDTHS.indexOf(closest);
//   //   return { colWidth, prevWidth: COLUMN_WIDTHS[index - 1], nextWidth: COLUMN_WIDTHS[index + 1] };
//   // }, [style.width]);

//   // style.margin = React.useMemo(() => style?.margin ?? "0px auto", [style?.margin]);
//   // style.width = React.useMemo(() => `${colWidth}px`, [colWidth]);

//   // function handleStyleChange(event: ChangeEvent | MouseEvent, value?: unknown): void {
//   //   const updatedStyles: CSSProperties = styleChange(event, value, style);
//   //   setProps?.((props: EditorComponent<T>) => ({ ...props, style: updatedStyles }));
//   // }

//   // React.useEffect((): void => {
//   //   setProps?.((props: EditorComponent<T>) => ({ ...props, style }));
//   // }, [setProps, style]);

//   // function handleStyleChange(event: React.MouseEvent<HTMLButtonElement>): void {
//   //   const updatedStyle: React.CSSProperties = styleChange(event, {});
//   //   setProps?.((props: EditorComponent<T>) => ({ ...props, style: { ...props.style, ...updatedStyle } }));
//   // }

//   return (
//     <CustomToolbar {...props}>
//       <div>
//         <button children={<DeleteIcon />} onClick={remove} />
//         <button children={<ArrowUpwardIcon />} disabled={!moveUp} onClick={moveUp} />
//         <button children={<ArrowDownwardIcon />} disabled={!moveDown} onClick={moveDown} />
//       </div>

//       <div>
//         {/* <button name="width" onClick={handleStyleChange} value='420px'>
//           <CompressIcon sx={{ transformOrigin: 'center', rotate: '90deg' }} />
//         </button >

//         <button name="width" onClick={handleStyleChange} value='640px'>
//           <ExpandIcon sx={{ transformOrigin: 'center', rotate: '90deg' }} />
//         </button > */}

//         {/* <input type="button" name="width" onClick={handleStyleChange} value={`640px`} /> */}

//         {/* <IconButton name="width" onClick={handleStyleChange} value={`420px`}>
//           <CompressIcon sx={{ transformOrigin: 'center', rotate: '90deg' }} />
//         </IconButton>
//         <IconButton name="width" onClick={handleStyleChange} value={`640px`}>
//           <ExpandIcon sx={{ transformOrigin: 'center', rotate: '90deg' }} />
//         </IconButton> */}
//       </div>

//       {children}

//       {/* <Stack columnGap={1} direction="row" alignItems="center">
//         <IconButton
//           disabled={!prevWidth}
//           name="width"
//           onClick={handleStyleChange}
//           value={`${prevWidth}px`}
//         >
//           <CompressIcon sx={{ transformOrigin: "center", rotate: "90deg" }} />
//         </IconButton>
//         <IconButton
//           disabled={!nextWidth}
//           name="width"
//           onClick={handleStyleChange}
//           value={`${nextWidth}px`}
//         >
//           <ExpandIcon sx={{ transformOrigin: "center", rotate: "90deg" }} />
//         </IconButton>
//       </Stack>

//       {nextWidth && (
//         <ToggleButtonGroup exclusive onChange={handleStyleChange} size="small" value={style.margin}>
//           <ToggleButton children={<AlignHorizontalLeftIcon />} name="margin" value="0" />
//           <ToggleButton children={<AlignHorizontalCenterIcon />} name="margin" value="0 auto" />
//           <ToggleButton children={<AlignHorizontalRightIcon />} name="margin" value="0 0 0 auto" />
//         </ToggleButtonGroup>
//       )} */}

//       {/* {children} */}
//     </CustomToolbar>
//   );
// }

// export default Toolbar;
