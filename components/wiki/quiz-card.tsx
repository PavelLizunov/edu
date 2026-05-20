"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface QuizCardProps {
  question: string;
  /** 2-4 options as plain text */
  options: string[];
  /** 0-based index of the correct option */
  correct: number;
  /** Shown after answer; plain string or MDX */
  explanation: ReactNode;
  /** Small badge sticker on top-right (e.g. "quiz · 01") */
  label?: string;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export function QuizCard({
  question,
  options,
  correct,
  explanation,
  label = "quiz · 01",
}: QuizCardProps) {
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);

  function onPick(idx: number) {
    if (pickedIdx !== null) return;
    setPickedIdx(idx);
  }

  function stateOf(idx: number): "correct" | "incorrect" | undefined {
    if (pickedIdx === null) return undefined;
    if (idx === correct) return "correct";
    if (idx === pickedIdx) return "incorrect";
    return undefined;
  }

  return (
    <div
      className="quiz"
      data-answered={pickedIdx !== null ? "1" : undefined}
    >
      <span className="quiz-label">{label}</span>
      <p className="q">{question}</p>
      <div className="options" role="radiogroup" aria-label="Варианты ответа">
        {options.map((opt, idx) => {
          const state = stateOf(idx);
          return (
            <button
              key={idx}
              type="button"
              className="opt"
              data-letter={LETTERS[idx] ?? String(idx + 1)}
              data-state={state}
              onClick={() => onPick(idx)}
              disabled={pickedIdx !== null}
              aria-pressed={pickedIdx === idx}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {pickedIdx !== null && (
        <div className="explain" role="status">
          <span className="ico" aria-hidden="true">
            →
          </span>
          <div>{explanation}</div>
        </div>
      )}
    </div>
  );
}
