// Define the structure of your form data values
type FormType = string | string[] | number | number[] | boolean | undefined;

// Extend the native SubmitEvent if you're adding properties to it
interface TwSubmitEvent extends SubmitEvent {
  formData?: Map<string, FormType>;
}
