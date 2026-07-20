// ASP.NET Identity groups signup validation errors by *code* (e.g. "PasswordTooShort"),
// not by field name. This maps each known code to the form field it should attach to.
export const SIGNUP_ERROR_CODE_TO_FIELD: Record<string, "email" | "password"> = {
  DuplicateUserName: "email",
  DuplicateEmail: "email",
  InvalidEmail: "email",
  PasswordTooShort: "password",
  PasswordRequiresDigit: "password",
  PasswordRequiresLower: "password",
  PasswordRequiresUpper: "password",
  PasswordRequiresNonAlphanumeric: "password",
  PasswordRequiresUniqueChars: "password",
};
