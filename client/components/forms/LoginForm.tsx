"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import ErrorMessage from "../ErrorMessage";
import useRequest from "../../hooks/sendRequest";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { makeRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
  });

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    makeRequest();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={submitForm}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-7 space-y-5"
        >
          <div className="text-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={80}
              height={80}
              className="mx-auto mb-2 rounded-2xl"
              priority
            />
            <h1 className="text-xl font-semibold">Welcome back!</h1>
          </div>

          {errors && Array.isArray(errors) && errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <ErrorMessage errors={errors} />
            </div>
          )}

          <div className="space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 focus:border-primary/50 rounded-xl h-12 pr-40"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 pr-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full font-semibold h-10.5 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-200"
          >
            Login
          </Button>

          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              Do not have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
