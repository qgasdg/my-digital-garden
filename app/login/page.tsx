"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAction } from "./actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/write";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await loginAction(password, callbackUrl);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm px-8"
      >
        <h1
          className="font-serif text-2xl text-center mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          관리자 로그인
        </h1>

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="bg-transparent border border-[var(--border)] rounded-sm px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-colors"
        />

        {error && (
          <p className="text-sm text-center opacity-60">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="border border-[var(--accent)] text-[var(--accent)] px-4 py-3 text-sm rounded-sm hover:bg-[var(--accent)] hover:text-[var(--background)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
