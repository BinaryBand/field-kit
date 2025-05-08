interface ITwSubmitEvent {
  formData?: Map<string, FormType>;
}

type TwSubmitEvent = SubmitEvent & ITwSubmitEvent;

type FormType = string | number | readonly string[] | readonly number[] | boolean | undefined;
