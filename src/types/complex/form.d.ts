type FormType = string | string[] | number | number[] | boolean;

interface TwSubmitEvent extends SubmitEvent {
  formData?: Map<string, FormType>;
}

type IFormData = Map<string, FormType> | FormType[];

type TWFormData = FormType | IFormData;
