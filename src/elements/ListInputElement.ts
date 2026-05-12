import { FormFieldElement } from './FormFieldElement';

const STYLE_TEXT = `
:host {
  display: inline-block;
  width: 100%;
}

.wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.token {
  border: 1px solid #ddd;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.8rem;
}

input {
  min-width: 8rem;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  background: transparent;
}
`;

function parseList(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((item) => `${item}`).filter(Boolean);
    }
  } catch {
    return value ? [value] : [];
  }

  return [];
}

export default class ListInputElement extends FormFieldElement<string[]> {
  static formAssociated = true;

  static get observedAttributes(): string[] {
    return ['value', 'placeholder', 'disabled', 'readonly', 'required', 'name'];
  }

  private readonly wrapper: HTMLDivElement;
  private readonly input: HTMLInputElement;
  private readonly tokenLayer: HTMLSpanElement;
  private list: string[] = [];
  private initialValue: string[] = [];

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = STYLE_TEXT;

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'wrap';

    this.tokenLayer = document.createElement('span');

    this.input = document.createElement('input');

    this.wrapper.append(this.tokenLayer, this.input);
    shadowRoot.append(style, this.wrapper);

    this.input.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' && this.input.value.trim()) {
        event.preventDefault();
        this.list = [...this.list, this.input.value.trim()];
        this.input.value = '';
        this.commit();
      }

      if (event.key === 'Backspace' && !this.input.value && this.list.length > 0) {
        event.preventDefault();
        const next = [...this.list];
        const popped = next.pop() ?? '';
        this.list = next;
        this.input.value = popped;
        this.commit();
      }
    });
  }

  connectedCallback(): void {
    if (this.initialValue.length === 0) {
      this.initialValue = parseList(this.getAttribute('value'));
    }

    this.syncFromAttributes();
  }

  get value(): string {
    return this.getAttribute('value') ?? '[]';
  }

  set value(value: string) {
    this.setAttribute('value', value ?? '[]');
  }

  attributeChangedCallback(): void {
    this.syncFromAttributes();
  }

  protected getDefaultValue(): string[] {
    return this.initialValue;
  }

  protected serializeFormValue(value: string[]): string {
    return JSON.stringify(value);
  }

  protected onExternalValueChange(value: string[]): void {
    this.value = JSON.stringify(value);
    this.syncFromAttributes();
  }

  private syncFromAttributes(): void {
    this.list = parseList(this.getAttribute('value'));
    this.input.placeholder = this.getAttribute('placeholder') ?? '';
    this.input.disabled = this.hasAttribute('disabled');
    this.input.readOnly = this.hasAttribute('readonly');
    this.input.required = this.hasAttribute('required') && this.list.length === 0;

    this.renderTokens();
    this.setFormValue(this.list);
    this.syncValidation();
  }

  private renderTokens(): void {
    this.tokenLayer.innerHTML = '';

    for (const item of this.list) {
      const token = document.createElement('span');
      token.className = 'token';
      token.textContent = item;
      this.tokenLayer.appendChild(token);
    }
  }

  private commit(): void {
    this.value = JSON.stringify(this.list);
    this.dispatchEvent(new Event('input', { bubbles: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private syncValidation(): void {
    if (this.hasAttribute('required') && this.list.length === 0) {
      this.setInvalid('Please enter at least one item.', this.input);
      return;
    }

    this.setValid();
  }
}
