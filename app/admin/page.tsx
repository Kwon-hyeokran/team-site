"use client";

import { useState, useCallback } from "react";

interface Consultation {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

type Screen = "login" | "list";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminPage() {
  const [screen, setScreen] = useState<Screen>("login");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<Consultation[]>([]);
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [storedPw, setStoredPw] = useState("");

  const fetchData = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/consultations", {
        headers: { "x-admin-password": pw },
      });
      if (res.status === 401) {
        setLoginError("비밀번호가 올바르지 않습니다.");
        setLoading(false);
        return false;
      }
      const json = await res.json();
      setData(json.consultations ?? []);
      return true;
    } catch {
      setLoginError("서버 연결에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const ok = await fetchData(password);
    if (ok) {
      setStoredPw(password);
      setScreen("list");
    }
  }

  async function handleRefresh() {
    await fetchData(storedPw);
  }

  /* ── 로그인 화면 ── */
  if (screen === "login") {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--airbnb-warm-bg)" }}
      >
        <div
          className="w-full max-w-sm rounded-3xl p-8"
          style={{ background: "var(--airbnb-white)", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
        >
          <div className="text-center mb-6">
            <span className="text-4xl">🔐</span>
            <h1 className="text-xl font-bold mt-3" style={{ color: "var(--airbnb-charcoal)" }}>
              관리자 로그인
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--airbnb-gray)" }}>
              Team RAN 관리자 전용 페이지입니다
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호 입력"
              required
              className="w-full px-4 py-3 text-sm rounded-xl outline-none"
              style={{
                border: "1.5px solid var(--airbnb-divider)",
                color: "var(--airbnb-charcoal)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--airbnb-charcoal)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--airbnb-divider)")}
            />
            {loginError && (
              <p className="text-xs px-3 py-2 rounded-lg"
                style={{ color: "#D70466", background: "#fff0f5" }}>
                ⚠️ {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="airbnb-btn-primary w-full"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "확인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* ── 목록 화면 ── */
  return (
    <main className="min-h-screen" style={{ background: "var(--airbnb-warm-bg)" }}>

      {/* 상세 모달 */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="w-full max-w-lg rounded-3xl p-8 relative"
            style={{ background: "var(--airbnb-white)", boxShadow: "0 24px 56px rgba(0,0,0,0.18)" }}>
            <button onClick={() => setSelected(null)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: "var(--airbnb-warm-bg)", color: "var(--airbnb-gray)" }}>
              ✕
            </button>
            <p className="text-xs font-semibold mb-4" style={{ color: "var(--airbnb-coral)" }}>
              #{selected.id} · {formatDate(selected.created_at)}
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold" style={{ color: "var(--airbnb-charcoal)" }}>이름</span>
                <p className="mt-0.5" style={{ color: "var(--airbnb-gray)" }}>{selected.name}</p>
              </div>
              <div>
                <span className="font-semibold" style={{ color: "var(--airbnb-charcoal)" }}>이메일</span>
                <p className="mt-0.5" style={{ color: "var(--airbnb-gray)" }}>{selected.email}</p>
              </div>
              <div>
                <span className="font-semibold" style={{ color: "var(--airbnb-charcoal)" }}>문의 내용</span>
                <p className="mt-1 leading-relaxed whitespace-pre-wrap p-3 rounded-xl text-sm"
                  style={{ background: "var(--airbnb-warm-bg)", color: "var(--airbnb-charcoal)" }}>
                  {selected.message}
                </p>
              </div>
            </div>
            <a
              href={`mailto:${selected.email}?subject=Re: Team RAN 문의 답변`}
              className="airbnb-btn-primary mt-6 w-full justify-center"
            >
              ✉️ 이메일로 답장하기
            </a>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <header className="airbnb-frosted sticky top-0 z-40"
        style={{ borderBottom: "1px solid var(--airbnb-divider)", boxShadow: "0 1px 12px rgba(0,0,0,0.08)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-base font-bold" style={{ color: "var(--airbnb-coral)" }}>Team RAN</span>
            <span className="text-sm font-semibold ml-3" style={{ color: "var(--airbnb-charcoal)" }}>
              관리자 · 문의 목록
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleRefresh}
              className="text-sm px-4 py-2 rounded-full font-medium transition-colors"
              style={{ background: "var(--airbnb-warm-bg)", color: "var(--airbnb-gray)" }}>
              {loading ? "..." : "새로고침"}
            </button>
            <button onClick={() => setScreen("login")}
              className="text-sm px-4 py-2 rounded-full font-medium"
              style={{ background: "var(--airbnb-warm-bg)", color: "var(--airbnb-gray)" }}>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* 요약 카드 */}
        <div className="airbnb-card p-6 mb-8 flex items-center gap-4">
          <span className="text-4xl">📬</span>
          <div>
            <p className="text-2xl font-extrabold" style={{ color: "var(--airbnb-charcoal)" }}>
              {data.length}건
            </p>
            <p className="text-sm" style={{ color: "var(--airbnb-gray)" }}>총 접수된 문의</p>
          </div>
        </div>

        {/* 문의 목록 */}
        {data.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--airbnb-gray)" }}>
            <p className="text-4xl mb-4">📭</p>
            <p className="text-sm">아직 접수된 문의가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="airbnb-card w-full text-left px-6 py-5 flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "linear-gradient(135deg, var(--airbnb-rausch-1), var(--airbnb-rausch-3))" }}>
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm" style={{ color: "var(--airbnb-charcoal)" }}>
                      {c.name}
                    </span>
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--airbnb-gray-light)" }}>
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--airbnb-coral)" }}>{c.email}</p>
                  <p className="text-sm mt-1 truncate" style={{ color: "var(--airbnb-gray)" }}>
                    {c.message}
                  </p>
                </div>
                <span className="flex-shrink-0 text-sm" style={{ color: "var(--airbnb-gray-light)" }}>›</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
