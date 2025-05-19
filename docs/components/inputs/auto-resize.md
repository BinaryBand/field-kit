### Auto-Resize Textarea

<textarea class="tw-auto-resize form-control" name="Multiline" placeholder="Text">
First Line
    Second Line
        Third Line
</textarea>

```html
<textarea class="tw-auto-resize">
First Line
    Second Line
        Third Line
</textarea>
```

<script setup>
  document.body.dispatchEvent(new Event('update'));
</script>
