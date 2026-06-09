"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

export default function ConsultationModal({ onClose }: Props) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "오류가 발생했습니다.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다.");
      setStatus("error");
    }
  }

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* modal card */}
      <div
        className="w-full max-w-md rounded-3xl p-8 relative"
        style={{
          background: "var(--airbnb-white)",
          boxShadow: "0 24px 56px rgba(0,0,0,0.18)",
        }}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-lg"
          style={{
            color: "var(--airbnb-gray)",
            background: "var(--airbnb-warm-bg)",
          }}
          aria-label="닫기"
        >
          ✕
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🎉</div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: "var(--airbnb-charcoal)" }}
            >
              문의가 접수됐습니다!
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--airbnb-gray)" }}>
              빠른 시일 내에 이메일로 답변 드리겠습니다.
            </p>
            <button onClick={onClose} className="airbnb-btn-primary">
              확인
            </button>
          </div>
        ) : (
          <>
            <h2
              className="text-xl font-bold mb-1"
              style={{ color: "var(--airbnb-charcoal)" }}
            >
              문의하기
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--airbnb-gray)" }}>
              궁금한 점을 남겨주시면 빠르게 답변 드리겠습니다.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이름 */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--airbnb-charcoal)" }}
                >
                  이름
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
                  style={{
                    border: "1.5px solid var(--airbnb-divider)",
                    color: "var(--airbnb-charcoal)",
                    background: "var(--airbnb-white)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--airbnb-charcoal)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--airbnb-divider)")
                  }
                />
              </div>

              {/* 이메일 */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--airbnb-charcoal)" }}
                >
                  이메일
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
                  style={{
                    border: "1.5px solid var(--airbnb-divider)",
                    color: "var(--airbnb-charcoal)",
                    background: "var(--airbnb-white)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--airbnb-charcoal)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--airbnb-divider)")
                  }
                />
              </div>

              {/* 문의 내용 */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--airbnb-charcoal)" }}
                >
                  문의 내용
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="궁금한 점을 자유롭게 적어주세요."
                  required
                  rows={4}
                  className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all resize-none"
                  style={{
                    border: "1.5px solid var(--airbnb-divider)",
                    color: "var(--airbnb-charcoal)",
                    background: "var(--airbnb-white)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--airbnb-charcoal)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--airbnb-divider)")
                  }
                />
              </div>

              {/* error message */}
              {status === "error" && (
                <p
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{
                    color: "#D70466",
                    background: "#fff0f5",
                  }}
                >
                  ⚠️ {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="airbnb-btn-primary w-full justify-center"
                style={{ opacity: status === "loading" ? 0.7 : 1 }}
              >
                {status === "loading" ? "전송 중..." : "문의 보내기"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
