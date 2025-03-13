interface IToolbarProps {
  moveUp?: () => void;
  moveDown?: () => void;
  remove: () => void;
}

type ToolbarProps = IToolbarProps & React.ComponentProps<"div">;

/********************************************************************* */

interface CommonComponent {
  id: string;
}

type EditorComponents = {
  text: {
    tag: "text";
    value: string;
  };
  image: {
    tag: "image";
    source?: string;
  };
};

type EditorComponent<T extends keyof EditorComponents> = EditorComponents[T] & CommonComponent;

type DocumentComponents = Record<string, EditorComponent<keyof EditorComponents>>;
