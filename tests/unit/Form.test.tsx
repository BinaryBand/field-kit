import { fireEvent, render } from '@testing-library/react';
import { act } from '@testing-library/react';
import { vi } from 'vitest';

import Form from '@/controllers/components/Form';
import { html } from '@tools/misc';

// Centralize all mocks and hooks for better organization and test isolation.
// This ensures consistency across all tests in this file.
let cleanupRender: (() => void) | undefined;
const mockFetch = vi.spyOn(global, 'fetch');

afterEach(async () => {
  await act(async () => {
    // Await to flush microtasks from the previous test
  });
  cleanupRender?.();
  vi.clearAllMocks();
});

describe('Form Component', () => {
  beforeEach(() => {
    // Reset the DOM for each test
    document.body.innerHTML = '';
  });

  test.each([
    {
      name: 'Native Values',
      html: html`
        <form action="/submit-data" method="POST">
          <input name="username" type="text" value="testUser" />
          <input name="age" type="number" value="30" />
          <input name="isSubscribed" type="checkbox" checked />
          <select name="country">
            <option value="USA">USA</option>
            <option value="CAN" selected>Canada</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      `,
      expectedPayload: { username: 'testUser', age: 30, isSubscribed: true, country: 'CAN' },
    },
    {
      name: 'Nested Data',
      html: html`
        <form action="/submit-data" method="POST">
          <div data-tw-group="personalInfo">
            <input name="firstName" type="text" value="Jane" />
            <input name="lastName" type="text" value="Doe" />
            <div data-tw-group="contact">
              <input name="email" type="email" value="jane.doe@example.com" />
            </div>
          </div>
          <input name="favoriteColors" type="list" value='["Red","Green","Blue"]' />
          <div data-tw-array="skills">
            <input name="skill1" value="JavaScript" />
            <input name="skill2" value="React" />
            <input name="skill3" value="CSS" />
          </div>
          <button type="submit">Submit</button>
        </form>
      `,
      expectedPayload: {
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Doe',
          contact: { email: 'jane.doe@example.com' },
        },
        favoriteColors: ['Red', 'Green', 'Blue'],
        skills: ['JavaScript', 'React', 'CSS'],
      },
    },
    {
      name: 'Complex Nested Data',
      html: html`
        <form action="/submit-data" method="POST">
          <div data-tw-group="personalInfo">
            <input name="firstName" type="text" value="Jane" />
            <input name="lastName" type="text" value="Doe" />
            <div data-tw-group="contact">
              <input name="email" type="email" value="jane.doe@example.com" />
            </div>
          </div>
          <input name="favoriteColors" type="list" value='["Red","Green","Blue"]' />
          <div data-tw-array="skills">
            <input name="firstName" value="JavaScript" />
            <input name="lastName" value="React" />
          </div>
          <button type="submit">Submit</button>
        </form>
      `,
      expectedPayload: {
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Doe',
          contact: { email: 'jane.doe@example.com' },
        },
        favoriteColors: ['Red', 'Green', 'Blue'],
        skills: ['JavaScript', 'React'],
      },
    },
    {
      name: 'Custom Input Components',
      html: html`
        <form action="/submit-data" method="POST">
          <input name="ListInput" type="list" value='["item1", "item2", "item3"]' />
          <input name="Pin" type="pin" value="123456" />
          <button type="submit">Submit</button>
        </form>
      `,
      expectedPayload: { ListInput: ['item1', 'item2', 'item3'], Pin: '123456' },
    },
    {
      name: 'Edge Cases',
      html: html`
        <form action="/submit-data" method="POST">
          <input name="isSubscribed" type="checkbox" />
          <input name="emptyInput" type="text" value="" />
          <input name="invalidNumber" type="number" value="invalid" />
          <select name="emptySelect" multiple>
            <option value="1">1</option>
          </select>
          <input name="customNumber" type="text" data-type="number" value="100" />
          <button type="submit">Submit</button>
        </form>
      `,
      expectedPayload: {
        isSubscribed: false,
        emptyInput: '',
        invalidNumber: 0,
        emptySelect: [],
        customNumber: 100,
      },
    },
  ])('should handle forms with %s', async ({ html, expectedPayload }) => {
    // Arrange: Set up the DOM and get the target form element.
    document.body.innerHTML = html;
    const target = document.body.querySelector('form')!;

    // Act: Render and submit the form.
    await act(async () => render(<Form target={target} />));
    await act(async () => fireEvent.submit(target));

    // Assert: Check the fetch call and payload.
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, requestInit] = vi.mocked(global.fetch).mock.calls[0];
    const receivedPayload = JSON.parse(requestInit?.body as string);

    expect(url).toBe('http://localhost:3000/submit-data');
    expect(requestInit?.method).toBe('POST');
    expect(receivedPayload).toEqual(expectedPayload);
  });

  test('should handle GroupedInput form submission', async () => {
    // Arrange: Set up the DOM with a GroupedInput
    const html = /* html */ `
      <form action="/submit-data" method="POST">
        <select name="preferences" multiple>
          <option value="option1" data-group="group1" selected>Option 1</option>
          <option value="option2" data-group="group1">Option 2</option>
          <option value="option3" data-group="group2" selected>Option 3</option>
          <option value="option4" selected>Ungrouped Option</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    `;

    document.body.innerHTML = html;
    const target = document.body.querySelector('form')!;

    // Act: Render and submit the form
    await act(async () => render(<Form target={target} />));
    await act(async () => fireEvent.submit(target));

    // Assert: Check the fetch call and payload
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, requestInit] = vi.mocked(global.fetch).mock.calls[0];
    const receivedPayload = JSON.parse(requestInit?.body as string);

    expect(url).toBe('http://localhost:3000/submit-data');
    expect(requestInit?.method).toBe('POST');
    expect(receivedPayload).toEqual({
      preferences: ['option1', 'option3', 'option4'],
    });
  });

  test('should handle GroupedInput single select form submission', async () => {
    // Arrange: Set up the DOM with a single-select GroupedInput
    const html = /* html */ `
      <form action="/submit-data" method="POST">
        <select name="preference">
          <option value="option1" data-group="group1" selected>Option 1</option>
          <option value="option2" data-group="group1">Option 2</option>
          <option value="option3" data-group="group2">Option 3</option>
          <option value="option4">Ungrouped Option</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    `;

    document.body.innerHTML = html;
    const target = document.body.querySelector('form')!;

    // Act: Render and submit the form
    await act(async () => render(<Form target={target} />));
    await act(async () => fireEvent.submit(target));

    // Assert: Check the fetch call and payload
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, requestInit] = vi.mocked(global.fetch).mock.calls[0];
    const receivedPayload = JSON.parse(requestInit?.body as string);

    expect(url).toBe('http://localhost:3000/submit-data');
    expect(requestInit?.method).toBe('POST');
    expect(receivedPayload).toEqual({
      preference: 'option1',
    });
  });

  test('should handle array items with same field names as parent fields', async () => {
    // Edge case: array items should not override parent fields with same names
    // This simulates a product form where "Name" exists at both parent and array levels
    const html = /* html */ `
      <form action="/submit-data" method="POST">
        <input name="Name" type="text" value="ProductName123" />
        <input name="Category" type="text" value="Filters" />
        <div data-tw-array="Locations">
          <div>
            <input name="Name" type="text" value="Kitchen" />
            <input name="Active" type="checkbox" checked />
          </div>
          <div>
            <input name="Name" type="text" value="Bathroom" />
            <input name="Active" type="checkbox" />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    `;

    document.body.innerHTML = html;
    const target = document.body.querySelector('form')!;

    // Act: Render and submit the form
    await act(async () => render(<Form target={target} />));
    await act(async () => fireEvent.submit(target));

    // Assert: Check the fetch call and payload
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, requestInit] = vi.mocked(global.fetch).mock.calls[0];
    const receivedPayload = JSON.parse(requestInit?.body as string);

    expect(url).toBe('http://localhost:3000/submit-data');
    expect(requestInit?.method).toBe('POST');
    
    // The parent "Name" should be preserved and not overridden by array item names
    expect(receivedPayload).toEqual({
      Name: 'ProductName123',
      Category: 'Filters',
      Locations: [
        { Name: 'Kitchen', Active: true },
        { Name: 'Bathroom', Active: false },
      ],
    });
  });

  test('should handle array with grouped items having same field names as parent', async () => {
    // Edge case: array items wrapped in data-tw-group should not override parent fields
    // This matches the temp.html structure more closely
    const html = /* html */ `
      <form action="/submit-data" method="POST">
        <input name="Name" type="text" value="ProductName123" />
        <input name="Category" type="text" value="Filters" />
        <div data-tw-array="ChemicalLocations">
          <div data-tw-group="">
            <input name="Name" type="text" value="Kitchen" />
            <input name="Active" type="checkbox" checked />
          </div>
          <div data-tw-group="">
            <input name="Name" type="text" value="Bathroom" />
            <input name="Active" type="checkbox" />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    `;

    document.body.innerHTML = html;
    const target = document.body.querySelector('form')!;

    // Act: Render and submit the form
    await act(async () => render(<Form target={target} />));
    await act(async () => fireEvent.submit(target));

    // Assert: Check the fetch call and payload
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, requestInit] = vi.mocked(global.fetch).mock.calls[0];
    const receivedPayload = JSON.parse(requestInit?.body as string);

    expect(url).toBe('http://localhost:3000/submit-data');
    expect(requestInit?.method).toBe('POST');
    
    // The parent "Name" should be preserved and not overridden by array item names
    expect(receivedPayload).toEqual({
      Name: 'ProductName123',
      Category: 'Filters',
      ChemicalLocations: [
        { Name: 'Kitchen', Active: true },
        { Name: 'Bathroom', Active: false },
      ],
    });
  });

  test('should ignore empty name attributes (no "" key in payload)', async () => {
    document.body.innerHTML = html`
      <form action="/submit-data" method="POST">
        <input name="" type="text" value="should-be-ignored" />
        <input name="valid" type="text" value="ok" />
        <div data-tw-array="items">
          <div>
            <input name="" type="text" value="ignored-too" />
            <input name="Name" type="text" value="Item1" />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    `;

    const target = document.body.querySelector('form')!;

    await act(async () => render(<Form target={target} />));
    await act(async () => fireEvent.submit(target));

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, requestInit] = vi.mocked(global.fetch).mock.calls[0];
    const receivedPayload = JSON.parse(requestInit?.body as string);

    expect(receivedPayload).toEqual({
      valid: 'ok',
      items: ['Item1'],
    });
    expect(Object.prototype.hasOwnProperty.call(receivedPayload, '')).toBe(false);
  });
});