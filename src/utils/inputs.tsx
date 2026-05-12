export function applySelectedOptions(target: HTMLSelectElement, values: string[]): void {
  for (const option of target.options) {
    option.selected = values?.includes(option.value) ?? false;
  }
}

export function getSelectedOptionValues(target: HTMLSelectElement): string[] {
  return Array.from(target.selectedOptions).map(({ value }) => value);
}
