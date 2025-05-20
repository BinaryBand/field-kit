## Auto-Resize Textarea `textarea.tw-auto-resize`

<DemoView query="textarea.tw-auto-resize">
<textarea class="tw-auto-resize form-control" name="Multiline" placeholder="Text">
First Line
    Second Line
        Third Line
</textarea>

```html
<textarea class="tw-auto-resize" name="Multiline">
First Line
    Second Line
        Third Line
</textarea>
```

</DemoView>

<script setup>
  import DemoView from './../../vue/DemoView.vue';

  if (typeof document !== 'undefined') {
    document.body.dispatchEvent(new Event('update'));
  }
</script>
