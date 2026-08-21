"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { AuthResponse } from "../../types/user";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

function validate(name: string, email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (name.trim().length < 2)
    errors.name = "Name should be at least 2 characters";
  if (!/^\S+@\S+\.\S+$/.test(email))
    errors.email = "Enter a valid email address";
  if (password.length < 8)
    errors.password = "Password needs at least 8 characters";
  return errors;
}

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationErrors = validate(name, email, password);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const { data } = await api.post<{ data: AuthResponse }>(
        "/auth/register",
        {
          name,
          email,
          password,
        },
      );
      setSession(data.data.user, data.data.accessToken);
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.message ?? "Registration failed")
          : "Registration failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full name"
        name="name"
        placeholder="Alex Morgan"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoComplete="name"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="new-password"
      />

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Create account
      </Button>

      <p className="text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-accent-400 hover:text-accent-300"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
