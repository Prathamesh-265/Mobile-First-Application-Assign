"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { AuthResponse } from "../../types/user";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await api.post<{ data: AuthResponse }>("/auth/login", {
        email,
        password,
      });
      setSession(data.data.user, data.data.accessToken);
      router.push(searchParams.get("redirectTo") ?? "/dashboard");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data?.message ?? "Login failed")
          : "Login failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Log in
      </Button>

      <p className="text-center text-sm text-white/50">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-accent-400 hover:text-accent-300"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
