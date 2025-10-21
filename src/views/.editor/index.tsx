// import React, { ChangeEvent, ComponentProps, ReactElement } from "react";
// import Stack from '@inline/Stack';
// // import Toolbar from "@components/Editor/Toolbar";
// import { createRandomKey } from "@utils";

// /********************************************************************* */

// interface IEditorContext {
//   components: DocumentComponents;
//   setComponents: React.Dispatch<React.SetStateAction<DocumentComponents>>;
// }

// const EditorContext: React.Context<IEditorContext> = React.createContext<IEditorContext>(undefined!);

// /********************************************************************* */

// // function TextEditorComponent({ value, ...props }: EditorComponent<'text'>): ReactElement {
// //   return <input readOnly type="text" value={value} />;
// // }

// /********************************************************************* */

// // function ImageEditorComponent({ source, ...props }: EditorComponent<'image'>): ReactElement {
// //   return <input readOnly type="text" value={source} />;
// // }

// /********************************************************************* */

// function EditorComponentContainer<T extends keyof EditorComponents>(component: EditorComponent<T>, index: number): ReactElement {
//   const { components } = React.useContext(EditorContext);

//   // let child: ReactElement = undefined!;
//   // switch (component.tag) {
//   //   case 'text':
//   //     child = <TextEditorComponent {...component} />;
//   //     break;
//   //   case 'image':
//   //     child = <ImageEditorComponent {...component} />;
//   //     break;
//   //   default:
//   //     throw ('Error');
//   // }

//   // function moveComponentFactory(id: string, direction: -1 | 1): () => void {
//   //   return (): void => {
//   //     const componentsCopy = { ...components };
//   //     const keys: string[] = Object.keys(componentsCopy);
//   //     const index: number = keys.indexOf(id);

//   //     const newPosition: number = index + direction;
//   //     if (0 <= newPosition && newPosition < keys.length) {
//   //       [keys[index], keys[index + direction]] = [keys[index + direction], keys[index]];
//   //       setComponents(Object.fromEntries(keys.map((k: string) => [k, componentsCopy[k]])));
//   //     }
//   //   };
//   // }

//   // function removeComponentFactory(id: string): () => void {
//   //   return (): void => {
//   //     setComponents((components: DocumentComponents): DocumentComponents => {
//   //       delete components[id];
//   //       return { ...components };
//   //     });
//   //   };
//   // }

//   // const moveUp = React.useMemo(() => {
//   //   if (index !== 0) {
//   //     return moveComponentFactory(component.id, -1)
//   //   }
//   // }, [component.id, index]);

//   // const moveDown = React.useMemo(() => {
//   //   if (index !== Object.keys(components).length - 1) {
//   //     return moveComponentFactory(component.id, 1)
//   //   }
//   // }, []);

//   // const removeSelf = React.useMemo(() => {
//   //   return removeComponentFactory(component.id)
//   // }, [component.id]);

//   return (
//     <div key={index}>
//       {/* <Toolbar moveUp={moveUp} moveDown={moveDown} remove={removeSelf} />
//       <Fragment key={component.id} children={child} /> */}
//     </div>
//   )
// }

// /********************************************************************* */

// function Editor({ value, ...props }: ComponentProps<"input">): ReactElement {
//   const [components, setComponents] = React.useState<DocumentComponents>({});

//   function addComponent<T extends keyof EditorComponents>(props: EditorComponents[T]): void {
//     const id: string = createRandomKey();
//     const newComponent: EditorComponent<T> = { id, ...props };
//     setComponents((components: DocumentComponents) => ({ ...components, [id]: newComponent }));
//   }

//   function handleChange(event: ChangeEvent<HTMLInputElement>): void {
//     const file: File | null = event.target.files?.item(0) ?? null;

//     if (file === null) {
//       setComponents({});
//     } else {
//       // parseFile(file).then(setComponents);
//     }
//   }

//   return (
//     <EditorContext.Provider value={{ components, setComponents }}>
//       <div style={{ width: '100%' }}>
//         <input {...props} type="file" onChange={handleChange} />
//         <input type="button" value="Add Text" onClick={() => addComponent({ tag: 'text', value: 'Default value' })} />
//         <input type="button" value="Add Image" onClick={() => addComponent({ tag: 'image', source: 'Image source' })} />

//         <br />

//         <Stack align="center" children={Object.values(components).map(EditorComponentContainer)} gap={1} />
//       </div>
//     </EditorContext.Provider>
//   );
// }

// export default Editor;
