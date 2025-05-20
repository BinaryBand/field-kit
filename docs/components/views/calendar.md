## Calendar

<table class="table tw-calendar">
  <tbody>
    <tr class="tw-calendar-month" data-tw-year="2021" data-tw-month="7">
      <td class="tw-calendar-day" data-tw-day="1">
        <div class="small text-secondary">First</div>
      </td>
      <td class="tw-calendar-day" data-tw-day="31">
        <div class="small text-secondary">Second</div>
      </td>
      <td class="tw-calendar-day" data-tw-day="5">
        <div class="small text-secondary">Third</div>
      </td>
    </tr>
  </tbody>
</table>

```html
<table class="tw-calendar">
  <tr class="tw-calendar-month" data-tw-year="2021" data-tw-month="7">
    <td class="tw-calendar-day" data-tw-day="1">First</td>
    <td class="tw-calendar-day" data-tw-day="31">Second</td>
    <td class="tw-calendar-day" data-tw-day="5">Third</td>
  </tr>
</table>
```

<script setup>
  document.body.dispatchEvent(new Event('update'));
</script>
