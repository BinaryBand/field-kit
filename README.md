# Getting Started

Fieldkit is a custom HTML component library that extends native `input`, `textarea`, and `select` elements with enhanced behaviors and styling. This document provides instructions on how to integrate Fieldkit into your projects.

## Installation

### Prerequisites

Ensure NPM is installed and up-to-date: [NPM installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

- **npm (Node Package Manager):** Version 8 or higher is recommended. You can update npm using:
  ```sh
  npm install npm@latest -g
  ```

### Download and Compile

Follow these steps to download and build the component library:

```bash
# Clone project from GitHub
git clone https://github.com/BinaryBand/field-kit.git

# Navigate to the project directory
cd field-kit

# Install all dependencies
npm install

# Build: This will compile into the relative /dist directory
npm run build
```

#### Deep Dive

Run `npm run build:docs` to generate and explore more thorough documentation instructions.

### Migrate to Targeted HTML File

To use the custom Components in your HTML file, include the following tags within the `head` and before the closing `body` tags:

```html
<head>
  <link rel="stylesheet" href="/dist/fieldkit.css" type="text/css" />
</head>
<body>
  <!-- content -->
  <script src="/dist/main.umd.js" type="text/javascript" defer></script>
</body>
```

**Note**: The paths `/dist/fieldkit.css` and `/dist/main.umd.js` are relative to the root of your web project. Adjust these paths if your dist directory is located elsewhere.

## Usage

### Components

#### Inputs

These components are designed to behave like native HTML `input`, `textarea`, and `select` elements, inheriting their fundamental properties and events while providing enhanced styling and potentially custom behaviors.

##### Auto Resize Textarea

`textarea.tw-auto-resize`

```html
<textarea class="tw-auto-resize">
    <!-- content -->
</textarea>
```

##### List Input

`input[type=list]`

The list input type allows users to input a list of values. The value attribute should be a JSON string representing an array of strings.

```html
<input type="list" value='["One","Two","Three"]' />
```

##### Passkey Input

`input[type=passkey]`

The passkey input type is designed for WebAuthn passkey authentication.

```html
<input data-identifier="j@ne.com" data-user="Jane" type="passkey" />
```

- `[data-identifier]`: This attribute typically holds a unique identifier for the user, such as their email address.
- `[data-user]`: This attribute provides a human-readable username for display during the authentication process.

##### PIN Input

`input[type=pin]`

```html
<input data-size="6" type="pin" />
```

- `[data-size]`: You can customize the number of required digits.

##### Select

`select.tw-select-group`

```html
<select class="tw-select-group" data-placeholder="placeholder">
  <!-- ... -->
  <option class="tw-option" value>Option</option>
  <!-- ... -->
</select>
```

- `[data-placeholder]`: Select inputs don't have a native `placeholder` property so we have to make one.

##### Signature Input

`input[type=signature]`

The signature input allows users to draw on a canvas. The value attribute should be a base-64 string representing a 2-D image.

```html
<input type="signature" />
```

#### Calendar

`table.tw-calendar`

```html
<table class="tw-calendar">
  <tr class="tw-calendar-month" data-tw-year="2000" data-tw-month="1">
    <!-- ... -->
    <td class="tw-calendar-day" data-tw-day="1">
      <!-- content -->
    </td>
    <!-- ... -->
  </tr>
</table>
```

- `tr.tw-calendar-month`: Represents the month row.
  - `tr.tw-calendar-month[data-tw-year]`: Specifies the year.
  - `tr.tw-calendar-month[data-tw-month]`: Specifies the month (1-indexed).
- `td.tw-calendar-day`: Represents an individual day cell.
  - `td.tw-calendar-day[data-tw-day]`: Specifies the day.

#### Filter

`.tw-filter-group`

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
