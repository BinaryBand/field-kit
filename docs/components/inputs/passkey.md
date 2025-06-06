## List Input

The passkey value will NOT appear at `event.formData[name]` during a submit event. Instead, the public key will be broadcasted in `event.currentTarget.value` during `change` events.

## Demo

<FormDemo>

<input class="btn" data-identifier="j@ne.com" data-user="Jane" id="passkey-input" name="Passkey" type="passkey" />

</FormDemo>

```html
<input data-identifier="j@ne.com" data-user="Jane" name="Passkey" type="passkey" />
```

<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
</script>
