import '../src/index';

const template = document.getElementById('code-demo-template');

if (template instanceof HTMLTemplateElement) {
  document.querySelectorAll('.code-demo').forEach((item) => {
    const targetQuery = item.getAttribute('data-target') ?? '';
    const target = document.querySelector(targetQuery);
    const clone = template.content.cloneNode(true);

    if (target !== null && clone instanceof DocumentFragment) {
      const codeString = target.outerHTML;

      clone.querySelectorAll('.code-demo__code').forEach((codeContainer) => {
        codeContainer.textContent = codeString;
      });

      clone.querySelectorAll('.code-demo__copy').forEach((copyButton) => {
        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(codeString);
        });
      });
    }

    item.appendChild(clone);
  });
}

const signatureInput = document.querySelector("input[type='signature']");
const clearSignatureButton = document.querySelector('button#clear-signature-button');

if (clearSignatureButton instanceof HTMLButtonElement) {
  clearSignatureButton.addEventListener('click', () => {
    if (signatureInput instanceof HTMLInputElement) {
      signatureInput.value = '';
      signatureInput.dispatchEvent(new Event('change'));
    }
  });
}
