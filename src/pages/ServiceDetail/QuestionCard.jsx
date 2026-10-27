import { useState } from 'react';
import { DomainBadge } from '../../components/common/Badge/DomainBadge';
import { SourceBadge } from '../../components/common/Badge/SourceBadge';

const NUMBER_WORDS = { 2: 'TWO', 3: 'THREE', 4: 'FOUR' };

/** Returns the A, B, C... label for an option index. */
export const optionLetter = (index) => String.fromCharCode(65 + index);

/**
 * One practice question with a per-question "show answer" toggle. The
 * permanent answer key for the whole set is rendered at the end of the page.
 *
 * @param {object} props
 * @param {number} props.number - 1-based question number
 * @param {object} props.question - question object from the service content
 */
export function QuestionCard({ number, question }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const requiredCount = question.answer.length;

  return (
    <article className="question-card">
      <header className="question-card__header">
        <span className="question-card__number">Q{number}</span>
        <SourceBadge source={question.source} />
        <DomainBadge domain={question.domain} />
        {question.reference ? <span className="question-card__reference">{question.reference}</span> : null}
      </header>

      <p className="question-card__stem">{question.stem}</p>
      {question.multi || requiredCount > 1 ? (
        <p className="question-card__hint">
          Select {NUMBER_WORDS[requiredCount] ?? requiredCount} correct answers.
        </p>
      ) : null}

      <ol className="question-card__options">
        {question.options.map((option, index) => {
          const letter = optionLetter(index);
          const isCorrect = isRevealed && question.answer.includes(letter);
          return (
            <li key={letter} className={isCorrect ? 'question-card__option question-card__option--correct' : 'question-card__option'}>
              <span className="question-card__letter">{letter}</span>
              <span>{option}</span>
            </li>
          );
        })}
      </ol>

      <button type="button" className="btn btn--ghost btn--small no-print" onClick={() => setIsRevealed((previous) => !previous)}>
        {isRevealed ? 'Hide answer' : 'Show answer'}
      </button>

      {isRevealed ? (
        <div className="question-card__answer">
          <strong>Answer: {question.answer.join(', ')}</strong>
          <p>{question.explanation}</p>
        </div>
      ) : null}
    </article>
  );
}
