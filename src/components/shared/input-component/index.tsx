import { InputBase } from "./InputBase";
import { InputLabel } from "./InputLabel";
import { InputMaskedCep } from "./InputMaskedCep";
import { InputMaskedCurrency } from "./InputMaskedCurrency";
import { InputMaskedDate } from "./InputMaskedDate";
import { InputMaskedDateIso } from "./InputMaskedDateIso";
import { InputMaskedDocument } from "./InputMaskedDocument";
import { InputMaskedPhone } from "./InputMaskedPhone";
import { InputRoot } from "./InputRoot";
import { InputTextarea } from "./InputTextarea";
import { InputWrapper } from "./InputWrapper";
import { InputPassword } from "./inputPassword";

export const InputComponent = {
  root: InputRoot,
  inputBase: InputBase,
  maskedCep: InputMaskedCep,
  maskedCurrency: InputMaskedCurrency,
  maskedDate: InputMaskedDate,
  maskedDateIso: InputMaskedDateIso,
  maskedDocument: InputMaskedDocument,
  maskedPhone: InputMaskedPhone,
  label: InputLabel,
  password: InputPassword,
  textarea: InputTextarea,
  wrapper: InputWrapper,
};
