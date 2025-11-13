---
title: Filter Component
description: A real-time filtering interface for lists and data with search functionality
---

# Filter Component

A real-time filtering interface that allows users to search and filter through lists of items. Perfect for search functionality, data filtering, and content discovery.

## Demo

<div class="demo-container">
  <div class="tw-filter-group" id="filterDemo">
    <input 
      class="form-control" 
      placeholder="Filter items..." 
      type="filter" 
      id="filterInput" 
    />
    <ul id="filterList">
      <li class="tw-filter-item">Apple</li>
      <li class="tw-filter-item">Banana</li>
      <li class="tw-filter-item">Cherry</li>
      <li class="tw-filter-item">Date</li>
      <li class="tw-filter-item">Elderberry</li>
      <li class="tw-filter-item">Fig</li>
      <li class="tw-filter-item">Grape</li>
      <li class="tw-filter-item">Honeydew</li>
    </ul>
  </div>
</div>

<style>
.demo-container {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
}

.demo-container .tw-filter-group {
  max-width: 300px;
}

.demo-container input[type="filter"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.demo-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}
</style>

::: info Note
This demo uses simplified JavaScript for demonstration purposes. In your actual application, the filter component is powered by the TW Components library which provides more advanced features like debouncing, multiple filter inputs, and complex filtering logic.
:::

## Basic Usage

```html
<div class="tw-filter-group">
  <input type="filter" placeholder="Search..." />
  <ul>
    <li class="tw-filter-item">Item 1</li>
    <li class="tw-filter-item">Item 2</li>
    <li class="tw-filter-item">Item 3</li>
  </ul>
</div>
```

## Properties

### HTML Structure

| Element   | Class                  | Description                              |
| --------- | ---------------------- | ---------------------------------------- |
| Container | `.tw-filter-group`     | Wrapper element for the filter component |
| Input     | `input[type="filter"]` | Filter input field                       |
| List      | `ul` or `ol`           | Container for filterable items           |
| Items     | `.tw-filter-item`      | Individual filterable items              |

### HTML Attributes

| Attribute            | Type     | Default     | Description                           |
| -------------------- | -------- | ----------- | ------------------------------------- |
| `placeholder`        | `string` | `undefined` | Placeholder text for the filter input |
| `name`               | `string` | `undefined` | Form field name                       |
| `data-filter-target` | `string` | `undefined` | CSS selector for items to filter      |

## Examples

### Basic Filter

```html
<div class="tw-filter-group">
  <input type="filter" placeholder="Filter fruits..." />
  <ul>
    <li class="tw-filter-item">Apple</li>
    <li class="tw-filter-item">Banana</li>
    <li class="tw-filter-item">Cherry</li>
    <li class="tw-filter-item">Date</li>
  </ul>
</div>
```

### Custom Filter Target

```html
<div class="tw-filter-group">
  <input type="filter" data-filter-target=".product-card" placeholder="Search products..." />
  <div class="product-grid">
    <div class="product-card tw-filter-item">
      <h3>Product A</h3>
      <p>Description of product A</p>
    </div>
    <div class="product-card tw-filter-item">
      <h3>Product B</h3>
      <p>Description of product B</p>
    </div>
  </div>
</div>
```

### With Categories

```html
<div class="tw-filter-group">
  <input type="filter" placeholder="Filter by category or name..." />
  <div class="category-list">
    <div class="category">
      <h4>Fruits</h4>
      <ul>
        <li class="tw-filter-item" data-category="fruits">Apple</li>
        <li class="tw-filter-item" data-category="fruits">Banana</li>
      </ul>
    </div>
    <div class="category">
      <h4>Vegetables</h4>
      <ul>
        <li class="tw-filter-item" data-category="vegetables">Carrot</li>
        <li class="tw-filter-item" data-category="vegetables">Broccoli</li>
      </ul>
    </div>
  </div>
</div>
```

### Form Integration

````html
<form id="searchForm">
  <div class="tw-filter-group">
    <input type="filter" name="search" placeholder="Search items..." />
    <ul>
      <li class="tw-filter-item">JavaScript</li>
      <li class="tw-filter-item">TypeScript</li>
      <li class="tw-filter-item">React</li>
      <li class="tw-filter-item">Vue</li>
      <li class="tw-filter-item">Angular</li>
    </ul>
  </div>
</form>

## Styling ### CSS Custom Properties ```css :root { --tw-filter-input-border: 1px solid #dee2e6;
--tw-filter-input-border-radius: 4px; --tw-filter-input-padding: 0.375rem 0.75rem;
--tw-filter-input-background: #fff; --tw-filter-item-padding: 0.5rem;
--tw-filter-item-border-bottom: 1px solid #f8f9fa; --tw-filter-hidden-opacity: 0;
--tw-filter-transition: opacity 0.2s ease; }
````

### Custom Styling

```css
/* Filter input styling */
.tw-filter-group input[type='filter'] {
  border: var(--tw-filter-input-border);
  border-radius: var(--tw-filter-input-border-radius);
  padding: var(--tw-filter-input-padding);
  background: var(--tw-filter-input-background);
  width: 100%;
  margin-bottom: 1rem;
}

/* Filter items styling */
.tw-filter-item {
  padding: var(--tw-filter-item-padding);
  border-bottom: var(--tw-filter-item-border-bottom);
  transition: var(--tw-filter-transition);
}

/* Hidden items */
.tw-filter-item[hidden] {
  opacity: var(--tw-filter-hidden-opacity);
  display: none;
}

/* Highlight matching text */
.tw-filter-item mark {
  background-color: yellow;
  padding: 0;
}

/* No results state */
.tw-filter-group[data-no-results]::after {
  content: 'No items found';
  display: block;
  padding: 1rem;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}
```

## Events

### Standard HTML Events

| Event    | When Triggered                | Event Data                            |
| -------- | ----------------------------- | ------------------------------------- |
| `input`  | When filter text changes      | `e.target.value` contains filter text |
| `change` | When filter is applied        | `e.target.value` contains filter text |
| `focus`  | When filter input gains focus | Standard focus event                  |
| `blur`   | When filter input loses focus | Standard blur event                   |

### Custom Events

| Event               | When Triggered           | Event Data                                                    |
| ------------------- | ------------------------ | ------------------------------------------------------------- |
| `tw:filter:applied` | After items are filtered | `{ query: string, visibleCount: number, totalCount: number }` |
| `tw:filter:cleared` | When filter is cleared   | `{ totalCount: number }`                                      |

### Example Event Handling

```javascript
const filterGroup = document.querySelector('.tw-filter-group');
const filterInput = filterGroup.querySelector('input[type="filter"]');

// Listen for filter changes
filterInput.addEventListener('input', function (e) {
  console.log('Filter changed:', e.target.value);
});

// Listen for custom filter events
filterGroup.addEventListener('tw:filter:applied', function (e) {
  console.log('Filter applied:', e.detail);
  console.log(`Showing ${e.detail.visibleCount} of ${e.detail.totalCount} items`);
});
```

## Accessibility

### ARIA Support

- Filter input includes `aria-label` or `aria-describedby` for screen readers
- Results are announced when filter is applied
- Proper focus management
- Keyboard navigation support

### Keyboard Interaction

| Key          | Action                                   |
| ------------ | ---------------------------------------- |
| `Tab`        | Move focus to/from the filter input      |
| `Escape`     | Clear the filter                         |
| `Enter`      | Apply filter (if form submission needed) |
| `Arrow Keys` | Navigate through filtered results        |

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## Use Cases

- **Product catalogs**: Filter products by name, category, or attributes
- **User directories**: Search through lists of users or contacts
- **Documentation**: Filter through help articles or FAQ items
- **Tag management**: Filter through available tags or categories
- **Data tables**: Quick search through table rows
- **Navigation menus**: Filter through menu items or pages

## Performance Considerations

- **Debouncing**: Filter updates are debounced to prevent excessive filtering
- **Virtual scrolling**: For large lists, consider implementing virtual scrolling
- **Index searching**: Use search indices for complex data structures
- **Lazy loading**: Load items as needed for very large datasets

## Related Components

- [List Input](/components/inputs/list) - For managing arrays of selected items
- [Select Input](/components/inputs/select) - For choosing from predefined options
- [Auto-Resize Textarea](/components/inputs/auto-resize) - For multi-line search inputs
