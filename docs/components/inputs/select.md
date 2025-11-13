## Select Input

## Demos

### Single Select

<FormDemo>
<select class="tw-select-group form-control" data-placeholder="Single Select" data-type="number" name="SingleSelect">
  <option class="tw-option" value="1">Albuquerque</option>
  <option class="tw-option" value="2">Boston</option>
  <option class="tw-option" value="3">Chicago</option>
</select>
</FormDemo>

```html
<select
  class="tw-select-group"
  data-placeholder="Single Select"
  name="SingleSelect"
  data-type="number"
>
  <option class="tw-option" value="1">Albuquerque</option>
  <option class="tw-option" value="2">Boston</option>
  <option class="tw-option" value="3">Chicago</option>
</select>
```

<hr />

### Multiple Select

<FormDemo>
<select class="tw-select-group form-control" data-placeholder="Multiple Select" multiple name="MultipleSelect">
  <option class="tw-option" value="alb">Albuquerque</option>
  <option class="tw-option" value="bos">Boston</option>
  <option class="tw-option" value="chi">Chicago</option>
</select>
</FormDemo>

```html
<select class="tw-select-group" data-placeholder="Multiple Select" multiple name="MultipleSelect">
  <option class="tw-option" value="alb">Albuquerque</option>
  <option class="tw-option" value="bos">Boston</option>
  <option class="tw-option" value="chi">Chicago</option>
</select>
```

<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
</script>
