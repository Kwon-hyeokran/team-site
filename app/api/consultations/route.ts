import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS consultations (
      id        SERIAL PRIMARY KEY,
      name      VARCHAR(100)  NOT NULL,
      email     VARCHAR(200)  NOT NULL,
      message   TEXT          NOT NULL,
      created_at TIMESTAMPTZ  DEFAULT NOW()
    )
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name    = (body.name    ?? "").trim();
    const email   = (body.email   ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "이름, 이메일, 문의 내용을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 주소를 입력해주세요." },
        { status: 400 }
      );
    }

    await ensureTable();

    await sql`
      INSERT INTO consultations (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[consultations POST]", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
