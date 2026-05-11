import { FormFieldElement } from './FormFieldElement';

const STYLE_TEXT = `
:host {
  display: inline-block;
  width: 100%;
}

textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 2.5rem;
  resize: none;
  font: inherit;
  color: inherit;
  background: transparent;
}
`;

export default class MultilineElement extends FormFieldElement<string> {
  static formAssociated = true;

  static get observedAttributes(): string[] {
    return ['value', 'placeholder', 'disabled', 'readonly', 'required', 'name'];
  }

  private readonly textarea: HTMLTextAreaElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = STYLE_TEXT;

    this.textarea = document.createElement('textarea');

    shadowRoot.append(style, this.textarea);

    this.textarea.addEventListener('input', () => {
      this.value = this.textarea.value;
      this.autoResize();
      this.syncValidation();
      this.dispatchEvent(new Event('input', { bubbles: true }));
      this.dispatchEvent(new Event('change', { bubbles: true }));
    });

    this.textarea.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const current = this.textarea.value;
        this.textarea.value = `${current.slice(0, start)}\t${current.slice(end)}`;
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
        this.value = this.textarea.value;
        this.autoResize();
        this.syncValidation();
      }
    });
  }

  connectedCallback(): void {
    this.syncFromAttributes();
    this.autoResize();
    this.syncValidation();
  }

  get name(): string {
    return this.getAttribute('name') ?? '';
  }

  set name(value: string) {
    this.setAttribute('name', value);
  }

  get value(): string {
    return this.getAttribute('value') ?? '';
  }

  set value(value: string) {
    this.setAttribute('value', value ?? '');
  }

  attributeChangedCallback(): void {
    this.syncFromAttributes();
    this.autoResize();
    this.syncValidation();
  }

  protected getDefaultValue(): string {
    return '';
  }

  protected serializeFormValue(value: string): string {
    return value;
  }

  protected onExternalValueChange(value: string): void {
    this.value = value;
    this.syncFromAttributes();
    this.autoResize();
    this.syncValidation();
  }

  private syncFromAttributes(): void {
    const value = this.getAttribute('value') ?? '';
    this.textarea.value = value;

    this.textarea.placeholder = this.getAttribute('placeholder') ?? '';
    this.textarea.disabled = this.hasAttribute('disabled');
    this.textarea.readOnly = this.hasAttribute('readonly');
    this.textarea.required = this.hasAttribute('required');

    this.setFormValue(value);
  }

  private syncValidation(): void {
    if (this.hasAttribute('required') && this.value.trim().length === 0) {
      this.setInvalid('This field is required.', this.textarea);
      return;
    }

    this.setValid();
  }

  private autoResize(): void {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }
}
