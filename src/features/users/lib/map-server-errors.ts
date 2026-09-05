// Same Identity backing store as signup, so POST /api/users surfaces the same error
// codes — see auth/lib/map-server-errors.ts (duplicated, not imported: no cross-feature
// import precedent exists in this codebase).
export const CREATE_USER_ERROR_CODE_TO_FIELD: Record<string, "email" | "password"> = {
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
