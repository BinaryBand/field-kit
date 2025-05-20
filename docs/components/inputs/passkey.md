## List Input `input[type="passkey"]`

The passkey value will NOT appear at `event.formData[name]` during a submit event. Instead, the public key will be broadcasted in `event.currentTarget.value` during `change` events.

<DemoView query="input[type='list']">
<input class="btn" data-identifier="j@ne.com" data-user="Jane" name="Passkey" type="passkey" />

```html
<input data-identifier="j@ne.com" data-user="Jane" name="Passkey" type="passkey" />
```

</DemoView>

<script setup>
  import DemoView from './../../vue/DemoView.vue';

  if (typeof document !== 'undefined') {
    document.body.dispatchEvent(new Event('update'));
  }
</script>
