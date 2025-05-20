## Select Input

<DemoView query='select.tw-select-group[name="SingleSelect"]'>
<select class="tw-select-group form-control" data-placeholder="Single Select" name="SingleSelect">
  <option class="tw-option" value="alb">Albuquerque</option>
  <option class="tw-option" value="bos">Boston</option>
  <option class="tw-option" value="chi">Chicago</option>
</select>

```html
<select class="tw-select-group" data-placeholder="Single Select" name="SingleSelect">
  <option class="tw-option" value="alb">Albuquerque</option>
  <option class="tw-option" value="bos">Boston</option>
  <option class="tw-option" value="chi">Chicago</option>
</select>
```

</DemoView>

<hr />

#### Multiple

<select class="tw-select-group form-control" data-placeholder="Multiple Select" multiple type="number">
  <option class="tw-option" value="1">Albuquerque</option>
  <option class="tw-option" value="2">Boston</option>
  <option class="tw-option" value="3">Chicago</option>
</select>

```html
<select class="tw-select-group" data-placeholder="Multiple Select" multiple type="number">
  <option class="tw-option" value="1">Albuquerque</option>
  <option class="tw-option" value="2">Boston</option>
  <option class="tw-option" value="3">Chicago</option>
</select>
```

<script setup>
  import DemoView from './../../vue/DemoView.vue';
  document.body.dispatchEvent(new Event('update'));
</script>
