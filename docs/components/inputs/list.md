## List Input `input[type="list"]`

<DemoView query="input[type='list']">
<input
  class="form-control"
  name="ListInput"
  placeholder="List Input"
  type="list"
  value='["One","Two","Three"]'
/>

```html
<input name="ListInput" type="list" />
```

</DemoView>

<script setup>
  import DemoView from './../../vue/DemoView.vue';

  if (typeof document !== 'undefined') {
    document.body.dispatchEvent(new Event('update'));
  }
</script>
