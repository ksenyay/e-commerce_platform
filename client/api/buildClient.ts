import axios from "axios";

export const buildClient = (sessionCookie?: string) => {
  return axios.create({
    baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    headers: {
      cookie: sessionCookie ? `session=${sessionCookie}` : "",
      Host: "sound.io",
    },
  });
};
