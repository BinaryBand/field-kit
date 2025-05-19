### Signature Input

<input
    class="form-control"
    name="SignatureInput"
    placeholder="Sign Here"
    type="signature"
/>

```html
<input placeholder="Sign Here" type="signature" />
```

<script setup>
  document.body.dispatchEvent(new Event('update'));
</script>
