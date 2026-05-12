export abstract class FormFieldElement<TValue = string> extends HTMLElement {
  static formAssociated = true;

  protected readonly internals: Partial<ElementInternals>;
  private fallbackInput: HTMLInputElement | null = null;

  constructor() {
    super();

    // jsdom and some older runtimes do not fully implement ElementInternals APIs.
    if (typeof this.attachInternals === 'function') {
      this.internals = this.attachInternals();
    } else {
      this.internals = {};
    }
  }

  protected abstract getDefaultValue(): TValue;
  protected abstract serializeFormValue(value: TValue): string | FormData | File | null;

  private canUseElementInternalsFormValue(): boolean {
    return typeof this.internals.setFormValue === 'function';
  }

  private ensureFallbackInput(): HTMLInputElement {
    if (this.fallbackInput) {
      return this.fallbackInput;
    }

    const input = document.createElement('input');
    input.type = 'hidden';
    input.setAttribute('data-fieldkit-fallback', 'true');
    input.setAttribute('aria-hidden', 'true');
    this.appendChild(input);
    this.fallbackInput = input;
    return input;
  }

  private syncFallbackFormValue(value: string | FormData | File | null): void {
    if (this.canUseElementInternalsFormValue()) {
      return;
    }

    const name = this.getAttribute('name') ?? '';
    const disabled = this.hasAttribute('disabled');
    const fallback = this.ensureFallbackInput();

    fallback.name = name;
    fallback.disabled = disabled || name.length === 0;

    if (value === null) {
      fallback.value = '';
      return;
    }

    if (typeof value === 'string') {
      fallback.value = value;
      return;
    }

    if (value instanceof FormData) {
      const first = value.entries().next().value;
      fallback.value = first ? String(first[1]) : '';
      return;
    }

    // Hidden inputs cannot carry File payloads; leave value empty.
    fallback.value = '';
  }

  protected setFormValue(value: TValue): void {
    const serialized = this.serializeFormValue(value);

    if (typeof this.internals.setFormValue === 'function') {
      this.internals.setFormValue(serialized);
    }

    this.syncFallbackFormValue(serialized);
  }

  protected setValid(): void {
    if (typeof this.internals.setValidity === 'function') {
      this.internals.setValidity({});
    }
  }

  protected setInvalid(message: string, anchor?: HTMLElement): void {
    if (typeof this.internals.setValidity === 'function') {
      this.internals.setValidity({ customError: true }, message, anchor);
    }
  }

  // Called by the browser when parent form.reset() is invoked.
  formResetCallback(): void {
    this.onExternalValueChange(this.getDefaultValue());
  }

  // Called by the browser during session restore/navigation restore.
  formStateRestoreCallback(state: string): void {
    this.onExternalValueChange(state as TValue);
  }

  protected onExternalValueChange(_value: TValue): void {
    // Subclasses can override to sync internal UI state.
  }
}
