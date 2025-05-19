### PIN Input

<input
    class="form-control"
    data-size="6"
    placeholder="000000"
    type="pin"
    value="123456"
/>

```html
<input data-size="6" placeholder="000000" type="pin" value="123456" />
```

<script setup>
  document.body.dispatchEvent(new Event('update'));
</script>
