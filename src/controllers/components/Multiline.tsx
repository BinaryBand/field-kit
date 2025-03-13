import React, { Fragment, ReactElement } from 'react';

function Multiline({ children, element }: IControllerProps): ReactElement {
    function addTab(textArea: HTMLTextAreaElement): void {
        const { selectionStart, selectionEnd } = textArea;
        textArea.setSelectionRange(selectionStart, selectionEnd);

        // This function is depreciated but JavaScript doesn't have an alternative yet
        document.execCommand('insertText', false, '\t');

        textArea.setSelectionRange(selectionStart + 1, selectionStart + 1);
    }

    function handleInput({ currentTarget }: Event): void;
    function handleInput(currentTarget: HTMLElement): void;
    function handleInput(event: Event | HTMLElement): void {
        if (event instanceof HTMLElement) {
            event.style.height = "auto";
            event.style.height = `${event.scrollHeight}px`;
        }
        else if (event.currentTarget instanceof HTMLElement) {
            handleInput(event.currentTarget);
        }
    }

    function handleKeyDown(event: KeyboardEvent): void {
        if (event.currentTarget instanceof HTMLTextAreaElement && event.key === "Tab" && !event.shiftKey) {
            event.preventDefault();
            addTab(event.currentTarget);
        }
    }

    React.useEffect((): () => void => {
        handleInput(element);

        element.addEventListener('input', handleInput, false);
        element.addEventListener('keydown', handleKeyDown);

        return () => {
            element.removeEventListener('input', handleInput);
            element.removeEventListener('keydown', handleKeyDown);
        }
    }, [element]);

    return <Fragment children={children} />
}

export default Multiline;