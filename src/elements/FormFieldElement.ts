export abstract class FormFieldElement<TValue = string> extends HTMLElement {
  static formAssociated = true;

  protected readonly internals: Partial<ElementInternals>;

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

  protected setFormValue(value: TValue): void {
    if (typeof this.internals.setFormValue === 'function') {
      this.internals.setFormValue(this.serializeFormValue(value));
    }
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
