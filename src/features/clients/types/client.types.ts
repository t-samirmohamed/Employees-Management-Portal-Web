export type Location = {
  id: number;
  name: string;
  email: string;
  contact: string;
};

export type ClientListItem = {
  id: number;
  name: string;
  email: string;
  contact: string;
};

export type ClientDetail = ClientListItem & {
  createdAt: string;
  locations: Location[];
};

export type ClientVisitStats = {
  clientId: number;
  range: string;
  visitCount: number;
};

export type CreateLocationRequest = {
  name: string;
  email: string;
  contact: string;
};

export type CreateClientRequest = {
  name: string;
  email: string;
  contact: string;
  locations?: CreateLocationRequest[];
};
