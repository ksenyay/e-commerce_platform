import axios from "axios";

export const buildClient = (sessionCookie?: string) => {
  return axios.create({
    headers: {
      cookie: sessionCookie ? `session=${sessionCookie}` : "",
    },
  });
};
