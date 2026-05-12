import { FormFieldElement } from './FormFieldElement';

const STYLE_TEXT = `
:host {
  display: inline-flex;
  gap: 8px;
}

input {
  width: 2rem;
  min-width: 0;
  padding: 10px 8px;
  text-align: center;
  font: inherit;
  color: inherit;
  background: transparent;
}
`;

function isDigit(value: string): boolean {
  return /^\d$/.test(value);
}

export default class PinInputElement extends FormFieldElement<string> {
  static formAssociated = true;

  static get observedAttributes(): string[] {
    return ['value', 'data-size', 'required', 'disabled', 'readonly', 'name'];
  }

  private readonly inputs: HTMLInputElement[] = [];
  private readonly container: HTMLSpanElement;
  private initialValue = '';

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = STYLE_TEXT;

    this.container = document.createElement('span');
    shadowRoot.append(style, this.container);
  }

  connectedCallback(): void {
    if (!this.initialValue) {
      this.initialValue = this.value;
    }

    this.renderInputs();
    this.syncFromAttributes();
  }

  get value(): string {
    return this.getAttribute('value') ?? '';
  }

  set value(value: string) {
    this.setAttribute('value', value ?? '');
  }

  get size(): number {
    const raw = Number(this.getAttribute('data-size'));
    return Number.isFinite(raw) && raw > 0 ? Math.min(raw, 12) : 6;
  }

  attributeChangedCallback(): void {
    const shouldRerender = this.inputs.length !== this.size;
    if (shouldRerender) {
      this.renderInputs();
    }

    this.syncFromAttributes();
  }

  protected getDefaultValue(): string {
    return this.initialValue;
  }

  protected serializeFormValue(value: string): string {
    return value;
  }

  protected onExternalValueChange(value: string): void {
    this.value = value;
    this.syncFromAttributes();
  }

  private renderInputs(): void {
    this.inputs.splice(0, this.inputs.length);
    this.container.innerHTML = '';

    for (let i = 0; i < this.size; i += 1) {
      const input = document.createElement('input');
      input.maxLength = 1;
      input.setAttribute('inputmode', 'numeric');
      input.dataset.index = `${i}`;

      input.addEventListener('input', () => {
        const next = input.value.slice(0, 1);
        if (!isDigit(next)) {
          input.value = '';
          return;
        }

        input.value = next;
        this.commitFromInputs();
        this.focusIndex(i + 1);
        this.dispatchEvent(new Event('input', { bubbles: true }));
        this.dispatchEvent(new Event('change', { bubbles: true }));
      });

      input.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.focusIndex(i - 1);
          return;
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.focusIndex(i + 1);
          return;
        }

        if (event.key === 'Backspace' || event.key === 'Delete') {
          event.preventDefault();
          input.value = '';
          this.commitFromInputs();
          if (event.key === 'Backspace') this.focusIndex(i - 1);
          this.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      input.addEventListener('paste', (event: ClipboardEvent) => {
        event.preventDefault();
        const text = event.clipboardData?.getData('text') ?? '';
        let target = i;
        for (const ch of text) {
          if (target >= this.inputs.length) break;
          if (isDigit(ch)) {
            this.inputs[target].value = ch;
            target += 1;
          }
        }

        this.commitFromInputs();
        this.focusIndex(target);
        this.dispatchEvent(new Event('change', { bubbles: true }));
      });

      this.inputs.push(input);
      this.container.appendChild(input);
    }
  }

  private syncFromAttributes(): void {
    const disabled = this.hasAttribute('disabled');
    const readonly = this.hasAttribute('readonly');

    for (const input of this.inputs) {
      input.disabled = disabled;
      input.readOnly = readonly;
    }

    const normalized = this.normalizeValue(this.value);
    for (let i = 0; i < this.inputs.length; i += 1) {
      this.inputs[i].value = normalized[i] ?? '';
    }

    this.setFormValue(normalized.join(''));
    this.syncValidation();
  }

  private normalizeValue(value: string): string[] {
    return `${value}`
      .split('')
      .filter((digit) => isDigit(digit))
      .slice(0, this.size);
  }

  private commitFromInputs(): void {
    const next = this.inputs.map((input) => input.value || '').join('');
    this.value = next;
  }

  private focusIndex(index: number): void {
    const clamped = Math.max(0, Math.min(this.inputs.length - 1, index));
    this.inputs[clamped]?.focus();
    this.inputs[clamped]?.select();
  }

  private syncValidation(): void {
    if (this.hasAttribute('required') && this.value.length < this.size) {
      this.setInvalid('Please complete all required PIN digits.', this.inputs[0]);
      return;
    }

    this.setValid();
  }
}
