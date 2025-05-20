## Signature Input `input[type="signature"]`

The signature input provides an interactive canvas for users to draw their signatures. The value attribute of this input will contain a base-64 encoded string representing the drawn 2D image of the signature.

<DemoView query="input[type='signature']">
<input class="form-control" name="Signature" placeholder="Sign Here" type="signature" />

<button class="btn" @click="handleClearClick">Clear</button>

```html
<input name="Signature" placeholder="Sign Here" type="signature" />
```

</DemoView>

<script setup>
  import DemoView from './../../vue/DemoView.vue';
  document.body.dispatchEvent(new Event('update'));

  function handleClearClick() {
    const signatureInput = document.querySelector("input[type='signature']");
    signatureInput.value = '';
    signatureInput.dispatchEvent(new Event('change'));
  };
</script>
