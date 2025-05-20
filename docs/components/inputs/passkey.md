## List Input

The passkey value will NOT appear at `event.formData[name]` during a submit event. Instead, the public key will be broadcasted in `event.currentTarget.value` during `change` events.

## Demo

<input class="btn" data-identifier="j@ne.com" data-user="Jane" name="Passkey" type="passkey" />

```html
<input data-identifier="j@ne.com" data-user="Jane" name="Passkey" type="passkey" />
```
