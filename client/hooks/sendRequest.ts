/* eslint-disable import/no-anonymous-default-export */
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RequestOptions {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  body?: {
    id?: string;
    email?: string;
    password?: string;
    username?: string;
  };
}

export default ({ url, method, body }: RequestOptions) => {
  const [errors, setErrors] = useState<string | string[]>("");
  const router = useRouter();

  const makeRequest = async () => {
    setErrors("");
    try {
      const response = await axios[method](url, body);
      console.log(`Success! ${response.data}`);
      router.push("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string | string[] }>;
      const message = error.response?.data?.message;

      if (Array.isArray(message)) {
        setErrors(message);
      } else if (typeof message === "string") {
        setErrors([message]);
      } else {
        setErrors(["An unexpected error occurred"]);
      }
    }
  };

  return { makeRequest, errors };
};
