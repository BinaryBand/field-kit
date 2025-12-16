---
title: Calendar
description: Interactive calendar component with automatic date generation and customizable month/year display
---

# Calendar

Interactive calendar component with automatic date generation and customizable month/year display

## Demo

<div style="margin: 1rem 0;">
  <table class="tw-calendar" style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr class="tw-calendar-month" data-tw-year="2025" data-tw-month="1">
        <td class="tw-calendar-day" data-tw-day="1" style="padding: 0.5rem; text-align: center; border: 1px solid #ddd;">
          <div>1</div>
        </td>
        <td class="tw-calendar-day" data-tw-day="15" style="padding: 0.5rem; text-align: center; border: 1px solid #ddd; background: #e3f2fd;">
          <div style="font-weight: bold;">15</div>
          <div style="font-size: 0.75rem; color: #666;">Today</div>
        </td>
        <td class="tw-calendar-day" data-tw-day="25" style="padding: 0.5rem; text-align: center; border: 1px solid #ddd;">
          <div>25</div>
          <div style="font-size: 0.75rem; color: #007bff;">Event</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Basic Usage

```html
<table class="tw-calendar">
  <thead>
    <tr>
      <th>Sun</th>
      <th>Mon</th>
      <th>Tue</th>
      <th>Wed</th>
      <th>Thu</th>
      <th>Fri</th>
      <th>Sat</th>
    </tr>
  </thead>
  <tbody>
    <tr class="tw-calendar-month" data-tw-year="2025" data-tw-month="1">
      <td class="tw-calendar-day" data-tw-day="15">
        <div>15</div>
        <div>Event Name</div>
      </td>
    </tr>
  </tbody>
</table>
```

## Properties

### CSS Classes

| Class | Element | Description |
| ----- | ------- | ----------- |
| `tw-calendar` | `<table>` | Activates calendar component |
| `tw-calendar-month` | `<tr>` | Designates the row for calendar days |
| `tw-calendar-day` | `<td>` | Marks specific days with content |

### HTML Attributes

| Attribute | Element | Type | Default | Description |
| --------- | ------- | ---- | ------- | ----------- |
| `data-tw-year` | `<tr class="tw-calendar-month">` | `number` | Current year | Year to display (e.g., 2025) |
| `data-tw-month` | `<tr class="tw-calendar-month">` | `number` | Current month | Month to display (1-12) |
| `data-tw-day` | `<td class="tw-calendar-day">` | `number` | - | Day of month for this cell (1-31) |

### Generated Attributes

The component automatically sets these attributes on the `tw-calendar-month` row:

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| `data-tw-blank-days` | `number` | Number of blank days at start of month |
| `data-tw-total-days` | `number` | Total days in the month |

## Examples

### Current Month Calendar

```html
<table class="tw-calendar">
  <thead>
    <tr>
      <th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th>
    </tr>
  </thead>
  <tbody>
    <!-- Leave year/month empty to use current date -->
    <tr class="tw-calendar-month">
      <td class="tw-calendar-day" data-tw-day="1">1</td>
      <td class="tw-calendar-day" data-tw-day="15">15</td>
    </tr>
  </tbody>
</table>
```

### Specific Month and Year

```html
<table class="tw-calendar">
  <tbody>
    <tr class="tw-calendar-month" data-tw-year="2025" data-tw-month="12">
      <td class="tw-calendar-day" data-tw-day="25">
        <div>25</div>
        <div>Christmas</div>
      </td>
    </tr>
  </tbody>
</table>
```

### Calendar with Events

```html
<table class="tw-calendar">
  <thead>
    <tr>
      <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
    </tr>
  </thead>
  <tbody>
    <tr class="tw-calendar-month" data-tw-year="2025" data-tw-month="1">
      <td class="tw-calendar-day" data-tw-day="1">
        <div class="day-number">1</div>
        <div class="event">New Year's Day</div>
      </td>
      <td class="tw-calendar-day" data-tw-day="15">
        <div class="day-number">15</div>
        <div class="event">Team Meeting</div>
      </td>
      <td class="tw-calendar-day" data-tw-day="20">
        <div class="day-number">20</div>
        <div class="event">Project Deadline</div>
      </td>
    </tr>
  </tbody>
</table>

<style>
.tw-calendar {
  width: 100%;
  border-collapse: collapse;
}

.tw-calendar th {
  background: #f8f9fa;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
}

.tw-calendar-day {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  vertical-align: top;
  min-height: 80px;
}

.day-number {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.event {
  font-size: 0.75rem;
  color: #007bff;
  margin-top: 0.25rem;
}
</style>
```

### Dynamic Month Navigation

```html
<div>
  <button onclick="previousMonth()">← Previous</button>
  <span id="currentMonth">January 2025</span>
  <button onclick="nextMonth()">Next →</button>
</div>

<table class="tw-calendar" id="calendar">
  <thead>
    <tr>
      <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
    </tr>
  </thead>
  <tbody>
    <tr class="tw-calendar-month" id="calendarMonth" data-tw-year="2025" data-tw-month="1">
      <!-- Calendar days go here -->
    </tr>
  </tbody>
</table>

<script>
let currentYear = 2025;
let currentMonth = 1;

function updateCalendar() {
  const row = document.getElementById('calendarMonth');
  row.setAttribute('data-tw-year', currentYear);
  row.setAttribute('data-tw-month', currentMonth);
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('currentMonth').textContent = 
    `${monthNames[currentMonth - 1]} ${currentYear}`;
  
  // Trigger component update
  document.body.dispatchEvent(new Event('update'));
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  }
  updateCalendar();
}

function previousMonth() {
  currentMonth--;
  if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  updateCalendar();
}
</script>
```

## Behavior

### Automatic Day Generation

The Calendar component automatically:
- Calculates the correct number of days for the specified month/year
- Determines blank days at the start of the month (based on day of week)
- Creates placeholder cells for all 31 possible days
- Only specified `tw-calendar-day` cells will have content

### Month Calculation

- If `data-tw-year` and `data-tw-month` are not specified, uses current date
- Handles leap years automatically
- Correctly calculates days for all months (28-31 days)
- Updates when attributes change via JavaScript

### Day Positioning

The component uses the `data-tw-day` attribute to position content:
- Days automatically appear in correct calendar position
- Can specify any days without needing sequential order
- Multiple events on same day by adding multiple elements within the cell

## Events

The Calendar component responds to attribute changes:

```javascript
// Get calendar row
const calendarRow = document.querySelector('.tw-calendar-month');

// Change month
calendarRow.setAttribute('data-tw-year', '2025');
calendarRow.setAttribute('data-tw-month', '6');

// Trigger component re-render
document.body.dispatchEvent(new Event('update'));
```

## Styling

### Basic Calendar Styling

```css
.tw-calendar {
  width: 100%;
  border-collapse: collapse;
  font-family: system-ui, -apple-system, sans-serif;
}

.tw-calendar th {
  background: #f8f9fa;
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  border: 1px solid #dee2e6;
}

.tw-calendar-day {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  vertical-align: top;
  min-height: 80px;
  background: white;
  cursor: pointer;
  transition: background 0.2s;
}

.tw-calendar-day:hover {
  background: #f8f9fa;
}

/* Empty cells */
._tw-calendar-day-placeholder:not(.tw-calendar-day) {
  background: #f8f9fa;
}
```

### Event Highlighting

```css
.tw-calendar-day[data-tw-day="15"] {
  background: #e3f2fd;
}

.tw-calendar-day .event {
  background: #007bff;
  color: white;
  padding: 0.25rem;
  border-radius: 3px;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
```

## Accessibility

- Use semantic HTML table structure
- Include proper `<thead>` with day names
- Ensure sufficient color contrast for events
- Add `aria-label` for important dates
- Support keyboard navigation for interactive calendars

```html
<td class="tw-calendar-day" data-tw-day="25" aria-label="Christmas Day">
  <div>25</div>
  <div>Christmas</div>
</td>
```

## Use Cases

### Event Calendar

Display events, meetings, or deadlines on specific dates.

### Date Picker

Create an interactive date selection interface.

### Scheduling

Show availability, bookings, or appointments.

### Project Timeline

Display project milestones and deadlines.

### Availability Calendar

Show available/unavailable dates for bookings.

## Browser Support

The Calendar component works in all modern browsers:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers with table support

## Related Components

- [Filter](/components/views/filter) - For filtering calendar events
- [Select Input](/components/inputs/select) - For month/year selection
