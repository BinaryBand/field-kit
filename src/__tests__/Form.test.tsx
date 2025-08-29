import { fireEvent, render } from '@testing-library/react';
import { act } from '@testing-library/react';
import { vi } from 'vitest';

import Form from '@/controllers/components/Form';
import { html } from '@/controllers/utils';

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
});
