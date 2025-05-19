### List Input

<input
    class="form-control"
    placeholder="List Input"
    type="list"
    value='["One","Two","Three"]'
/>

```html
<input type="list" value='["One","Two","Three"]' />
```

<script setup>
  document.body.dispatchEvent(new Event('update'));
</script>
