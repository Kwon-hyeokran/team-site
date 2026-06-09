"use client";

import { useState } from "react";

const QUESTS = [
  {
    id: "q1",
    time: "09:00 – 09:30",
    badge: "⚔️",
    title: "모험가의 귀환",
    subtitle: "출근 & 자리 세팅",
    xp: 100,
    color: "#E61E4D",
    items: [
      { id: "q1-1", text: "사원증 수령 및 착용 완료" },
      { id: "q1-2", text: "내 자리 위치 확인" },
      { id: "q1-3", text: "노트북·모니터 전원 켜기" },
      { id: "q1-4", text: "회사 Wi-Fi / VPN 연결" },
    ],
    tip: "자리에 앉으면 먼저 주변을 둘러보세요. 비상구 위치, 화장실, 탕비실 위치를 파악해두면 하루가 훨씬 편해집니다.",
  },
  {
    id: "q2",
    time: "09:30 – 10:30",
    badge: "🧭",
    title: "동료를 찾아라",
    subtitle: "팀원 인사 & 채널 합류",
    xp: 200,
    color: "#FF385C",
    items: [
      { id: "q2-1", text: "팀장님께 첫 인사드리기" },
      { id: "q2-2", text: "팀원 전원에게 1:1 인사" },
      { id: "q2-3", text: "슬랙 / Teams 계정 생성" },
      { id: "q2-4", text: "팀 공용 채널 전부 참여" },
      { id: "q2-5", text: "자기소개 메시지 채널에 올리기 👋" },
    ],
    tip: "자기소개는 짧고 가볍게! 이름 + 이전 경험 한 줄 + 앞으로 기대되는 것 한 줄이면 충분합니다. 이모지 하나 넣으면 더 친근해 보여요.",
  },
  {
    id: "q3",
    time: "10:30 – 12:00",
    badge: "🛡️",
    title: "무기를 장착하라",
    subtitle: "개발 환경 & 계정 세팅",
    xp: 300,
    color: "#E31C5F",
    items: [
      { id: "q3-1", text: "Node.js / Git 설치 확인" },
      { id: "q3-2", text: "GitHub 계정 생성 & 팀 Organization 합류" },
      { id: "q3-3", text: "Notion / Confluence 접근 권한 요청" },
      { id: "q3-4", text: "VS Code + 필수 익스텐션 설치" },
      { id: "q3-5", text: "사내 이메일 서명 세팅" },
    ],
    tip: "설치 중 막히는 게 있으면 바로 옆 동료에게 물어보세요. 첫날 질문은 민폐가 아니라 적극성의 증거입니다. 모르는 척이 더 손해!",
  },
  {
    id: "q4",
    time: "12:00 – 13:00",
    badge: "🍱",
    title: "용사의 휴식",
    subtitle: "점심 & 회사 탐색",
    xp: 50,
    color: "#FF8C00",
    items: [
      { id: "q4-1", text: "팀원과 함께 점심식사" },
      { id: "q4-2", text: "회사 주변 맛집 1곳 체크" },
      { id: "q4-3", text: "편의점 / 카페 위치 파악" },
    ],
    tip: "점심 자리는 최고의 온보딩 시간입니다. 업무 얘기 말고 가볍게 취미, 사는 곳, 좋아하는 것을 물어보세요. 관계의 기초가 쌓입니다.",
  },
  {
    id: "q5",
    time: "13:00 – 14:30",
    badge: "📖",
    title: "지식의 서를 읽어라",
    subtitle: "팀 문서 & 프로젝트 파악",
    xp: 250,
    color: "#D70466",
    items: [
      { id: "q5-1", text: "팀 위키 / README 처음부터 읽기" },
      { id: "q5-2", text: "현재 진행 중인 프로젝트 목록 파악" },
      { id: "q5-3", text: "최근 스프린트 / 이슈 트래커 훑기" },
      { id: "q5-4", text: "코드베이스 디렉토리 구조 파악" },
      { id: "q5-5", text: "모르는 용어 3개 이상 찾아 정리" },
    ],
    tip: "다 이해하려 하지 마세요. 지금은 '어떤 게 있구나' 감을 잡는 게 목표입니다. 모르는 것을 메모해두면 나중에 훨씬 빠르게 채워집니다.",
  },
  {
    id: "q6",
    time: "14:30 – 16:00",
    badge: "🗡️",
    title: "첫 번째 임무",
    subtitle: "실전 태스크 시작",
    xp: 400,
    color: "#E61E4D",
    items: [
      { id: "q6-1", text: "멘토에게 첫 번째 태스크 배정받기" },
      { id: "q6-2", text: "로컬에서 프로젝트 빌드 & 실행 성공" },
      { id: "q6-3", text: "간단한 이슈 1개 직접 확인해보기" },
      { id: "q6-4", text: "PR 또는 커밋 1개 만들어보기 (작아도 OK)" },
    ],
    tip: "완벽한 코드보다 '돌아가는 코드'가 우선입니다. 오늘은 결과물보다 프로세스를 익히는 게 목표예요. 두려워하지 말고 일단 시작!",
  },
  {
    id: "q7",
    time: "16:00 – 17:00",
    badge: "🏰",
    title: "귀환 보고",
    subtitle: "회고 & 내일 준비",
    xp: 150,
    color: "#FF385C",
    items: [
      { id: "q7-1", text: "오늘 배운 것 3가지 메모" },
      { id: "q7-2", text: "아직 모르는 것 목록 정리" },
      { id: "q7-3", text: "내일 할 일 우선순위 작성" },
      { id: "q7-4", text: "팀장님께 오늘 하루 간단히 보고" },
      { id: "q7-5", text: "자리 정리 & 노트북 잠금 후 퇴근 🎉" },
    ],
    tip: "첫날은 무조건 힘듭니다. 다 못 했어도 괜찮아요. 오늘 여기까지 온 것 자체가 대단한 겁니다. 내일의 당신은 오늘보다 훨씬 강해집니다.",
  },
];

const TOTAL_XP = QUESTS.reduce((s, q) => s + q.xp, 0);

export default function OnboardingPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>("q1");

  function toggle(itemId: string) {
    setChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  function toggleQuest(qId: string) {
    setExpanded((prev) => (prev === qId ? null : qId));
  }

  const totalItems = QUESTS.flatMap((q) => q.items).length;
  const doneItems = Object.values(checked).filter(Boolean).length;
  const progressPct = Math.round((doneItems / totalItems) * 100);

  const earnedXP = QUESTS.reduce((sum, q) => {
    const all = q.items.every((i) => checked[i.id]);
    return sum + (all ? q.xp : 0);
  }, 0);

  function questProgress(q: (typeof QUESTS)[0]) {
    const done = q.items.filter((i) => checked[i.id]).length;
    return { done, total: q.items.length, complete: done === q.items.length };
  }

  return (
    <main style={{ background: "var(--airbnb-warm-bg)", color: "var(--airbnb-charcoal)", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <header className="airbnb-frosted sticky top-0 z-50 w-full"
        style={{ borderBottom: "1px solid var(--airbnb-divider)", boxShadow: "0 1px 12px rgba(0,0,0,0.08)" }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-base font-bold" style={{ color: "var(--airbnb-coral)" }}>
            ⚡ Team RAN
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--airbnb-gray)" }}>
            {earnedXP.toLocaleString()} / {TOTAL_XP.toLocaleString()} XP
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="text-center px-6 pt-16 pb-10"
        style={{ background: "linear-gradient(160deg, #fff5f7 0%, var(--airbnb-warm-cream) 60%, var(--airbnb-warm-bg) 100%)" }}>
        <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "var(--airbnb-coral)" }}>
          Day 1 Quest
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
          style={{ color: "var(--airbnb-charcoal)" }}>
          안녕하세요. DA팀에<br />오신 걸 환영합니다 🫡
        </h1>
        <p className="text-base max-w-md mx-auto mb-8" style={{ color: "var(--airbnb-gray)" }}>
          설레는 입사 첫날! 오늘 하루를 7개의 퀘스트로 완벽하게 정복해보세요.
          <br />모든 퀘스트를 클리어하면 진정한 DA 팀원이 됩니다.
        </p>

        {/* Progress bar */}
        <div className="max-w-sm mx-auto">
          <div className="flex justify-between text-xs font-medium mb-2"
            style={{ color: "var(--airbnb-gray)" }}>
            <span>전체 진행률</span>
            <span>{doneItems} / {totalItems} 완료 ({progressPct}%)</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--airbnb-divider)" }}>
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(to right, var(--airbnb-rausch-1), var(--airbnb-rausch-3))",
              }}
            />
          </div>
          {progressPct === 100 && (
            <p className="mt-3 text-sm font-bold" style={{ color: "var(--airbnb-coral)" }}>
              🎉 모든 퀘스트 클리어! 오늘 하루 정말 수고했어요!
            </p>
          )}
        </div>
      </section>

      {/* ── Quest List ── */}
      <section className="max-w-3xl mx-auto px-4 pb-24 pt-6 w-full space-y-4">
        {QUESTS.map((q, idx) => {
          const qp = questProgress(q);
          const isOpen = expanded === q.id;

          return (
            <div key={q.id} className="airbnb-card overflow-hidden">
              {/* Quest Header */}
              <button
                onClick={() => toggleQuest(q.id)}
                className="w-full text-left px-6 py-5 flex items-center gap-4"
                style={{ background: qp.complete ? "#fff5f7" : "var(--airbnb-white)" }}
              >
                {/* Number badge */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: qp.complete ? "#22c55e" : `linear-gradient(135deg, ${q.color}, #D70466)` }}>
                  {qp.complete ? "✓" : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,56,92,0.1)", color: "var(--airbnb-coral)" }}>
                      {q.time}
                    </span>
                    <span className="text-xs" style={{ color: "var(--airbnb-gray-light)" }}>
                      +{q.xp} XP
                    </span>
                  </div>
                  <p className="text-base font-bold mt-0.5" style={{ color: "var(--airbnb-charcoal)" }}>
                    {q.badge} {q.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--airbnb-gray)" }}>
                    {q.subtitle} · {qp.done}/{qp.total} 완료
                  </p>
                </div>

                <span className="flex-shrink-0 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "var(--airbnb-gray-light)" }}>
                  ▾
                </span>
              </button>

              {/* Quest Body */}
              {isOpen && (
                <div className="px-6 pb-6 border-t" style={{ borderColor: "var(--airbnb-divider)" }}>
                  {/* Checklist */}
                  <ul className="mt-4 space-y-3">
                    {q.items.map((item) => (
                      <li key={item.id}
                        onClick={() => toggle(item.id)}
                        className="flex items-start gap-3 cursor-pointer group">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all duration-150"
                          style={{
                            borderColor: checked[item.id] ? "var(--airbnb-coral)" : "var(--airbnb-divider)",
                            background: checked[item.id] ? "var(--airbnb-coral)" : "transparent",
                          }}>
                          {checked[item.id] && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        <span className="text-sm leading-relaxed transition-colors"
                          style={{
                            color: checked[item.id] ? "var(--airbnb-gray-light)" : "var(--airbnb-charcoal)",
                            textDecoration: checked[item.id] ? "line-through" : "none",
                          }}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Tip box */}
                  <div className="mt-5 rounded-xl p-4 text-sm leading-relaxed"
                    style={{ background: "#fff5f7", borderLeft: `3px solid ${q.color}`, color: "var(--airbnb-gray)" }}>
                    <span className="font-semibold" style={{ color: q.color }}>💡 어드바이저 팁 &nbsp;</span>
                    {q.tip}
                  </div>

                  {/* Quest complete banner */}
                  {qp.complete && (
                    <div className="mt-4 rounded-xl py-3 px-4 text-center text-sm font-bold"
                      style={{ background: "linear-gradient(to right, var(--airbnb-rausch-1), var(--airbnb-rausch-3))", color: "#fff" }}>
                      🎊 퀘스트 클리어! +{q.xp} XP 획득
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 text-center text-xs"
        style={{ borderTop: "1px solid var(--airbnb-divider)", color: "var(--airbnb-gray-light)" }}>
        © 2026 Team RAN · 오늘도 함께라서 든든합니다 ⚡
      </footer>
    </main>
  );
}
