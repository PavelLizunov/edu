"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface QuizCardProps {
  question: string;
  /** 2-4 answer options, plain text */
  options: string[];
  /** 0-based index of the correct option */
  correct: number;
  /** Shown after the user answers. Plain text or MDX nodes. */
  explanation: ReactNode;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export function QuizCard({ question, options, correct, explanation }: QuizCardProps) {
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
    <div className="quiz" data-answered={pickedIdx !== null ? "1" : undefined}>
      <p className="quiz-q">{question}</p>
      <div className="quiz-options" role="radiogroup" aria-label="Варианты ответа">
        {options.map((opt, idx) => {
          const state = stateOf(idx);
          return (
            <button
              key={idx}
              type="button"
              className="quiz-opt"
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
        <div className="quiz-explain" role="status">
          <span className="icon" aria-hidden="true">
            →
          </span>
          <div>{explanation}</div>
        </div>
      )}
    </div>
  );
}
