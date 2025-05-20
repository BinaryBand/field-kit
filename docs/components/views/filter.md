## Filter

<div class="tw-filter-group">
  <input class="form-control" placeholder="Text Filter" type="filter" />

  <ul>
    <li class="tw-filter-item">An item</li>
    <li class="tw-filter-item">A second item</li>
    <li class="tw-filter-item">A third item</li>
  </ul>
</div>

```html
<div class="tw-filter-group">
  <input type="filter" />
  <ul>
    <li class="tw-filter-item">An item</li>
    <li class="tw-filter-item">A second item</li>
    <li class="tw-filter-item">A third item</li>
  </ul>
</div>
```

<script setup>
  document.body.dispatchEvent(new Event('update'));
</script>
