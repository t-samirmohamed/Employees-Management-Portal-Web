import type { Gender } from "@shared/types/enums";

export type AuthResponse = {
  token: string;
  expiresAtUtc: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
};
