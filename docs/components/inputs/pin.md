## List Input `input[type="pin"]`

<DemoView query="input[type='pin']">
<input class="form-control" data-size="6" name="Pin" placeholder="000000" type="pin" />

```html
<input data-size="6" name="Pin" placeholder="000000" type="pin" />
```

</DemoView>

<script setup>
  import DemoView from './../../vue/DemoView.vue';
  document.body.dispatchEvent(new Event('update'));
</script>
