## Signature Input

The signature input provides an interactive canvas for users to draw their signatures. The value attribute of this input will contain a base-64 encoded string representing the drawn 2D image of the signature.

## Demo

<FormDemo>
<SignatureDemo />
</FormDemo>

```html
<input name="Signature" placeholder="Sign Here" type="signature" />
<button onClick="handleClearClick">Clear Input</button>
```

```js
function handleClearClick() {
  const signatureElement = document.querySelector("input[name='Signature']");
  signatureInput.value = '';
  signatureInput.dispatchEvent(new Event('change'));
}
```

<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
  import SignatureDemo from './../../vue/SignatureDemo.vue'
</script>
