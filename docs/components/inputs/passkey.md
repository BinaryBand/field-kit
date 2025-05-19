### Passkey Input

<input
    class="btn"
    data-identifier="j@ne.com"
    data-user="Jane"
    type="passkey"
/>

```html
<input data-identifier="j@ne.com" data-user="Jane" type="passkey" />
```

<script setup>
  document.body.dispatchEvent(new Event('update'));
</script>
