type FormType = string | string[] | number | number[] | boolean;

interface TwSubmitEvent extends SubmitEvent {
  formData?: Record<string, FormType>;
}

type IFormData = Record<string, FormType> | FormType[];

type TWFormData = FormType | IFormData;
