# Form

When a form is submitted, the library intercepts the standard `submit` event and adds a custom `formData` property to the event object. This `event.formData` is a `Map` object, automatically populated with the key-value pairs from the submitted form's input fields (where the keys are the `name` attributes of the fields and the values are their current values). You can access this data within the `submitForm` handler function using `event.formData`.

```html
<div class="tw-form">
  <!-- Inputs -->
</div>
```

```js
function handleSubmit(event) {
  event.preventDefault();
  console.log(event.formData);
}
```

<FormDemo>

## Array Value

<div class="border border-dotted paper stack" data-tw-array="ArrayName">
  <input class="form-control" name="First" value="1st" />
  <input class="form-control" name="Second" value="2nd" />
  <input class="form-control" name="Third" value="3rd" />
</div>

</FormDemo>

```html
<div data-tw-list="Array">
  <input name="First" value="1st" />
  <input name="Second" value="2nd" />
  <input name="Third" value="3rd" />
</div>
```

<FormDemo>

## Group Value

<div class="border border-dashed paper stack" data-tw-group="GroupName">
  <input class="form-control" name="Fourth" value="4th" />
  <input class="form-control" name="Fifth" value="5th" />
</div>

</FormDemo>

<FormDemo>

```html
<div data-tw-group="GroupName">
  <input name="First" value="1st" />
  <input name="Second" value="2nd" />
  <input name="Third" value="3rd" />
</div>
```

## Nested Complex Values

Complex form values can be nested.

<div class="border border-dashed paper stack" data-tw-group="Complex">
  <input class="form-control" name="Sixth" value="6th" />

  <div class="border border-dotted stack" data-tw-array="Array">
    <input class="form-control" name="Seventh" value="7th" />
    <input class="form-control" name="Eighth" value="8th" />
  </div>

  <div class="border border-dashed stack" data-tw-group="Group">
    <input class="form-control" name="Ninth" value="9th" />
    <input class="form-control" name="Tenth" value="10th" />
  </div>
</div>

```html
<div data-tw-group="Complex">
  <input name="Sixth" value="6th" />

  <div data-tw-list="Array">
    <input name="Seventh" value="7th" />
    <input name="Eighth" value="8th" />
  </div>

  <div class="border border-dashed stack" data-tw-group="Grandchild">
    <input name="Ninth" value="9th" />
    <input name="Tenth" value="10th" />
  </div>
</div>
```

</FormDemo>

<script setup lang='ts'>
  import FormDemo from './../vue/FormDemo.vue';
</script>
