import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DomainBadge } from '../../components/common/Badge/DomainBadge';
import { SourceBadge } from '../../components/common/Badge/SourceBadge';
import { serviceById } from '../../data/serviceCatalog';
import { optionLetter } from '../ServiceDetail/QuestionCard';

/** True when the selected letters exactly match the correct answer set. */
const isCorrectSelection = (selected, answer) =>
  selected.length === answer.length && answer.every((letter) => selected.includes(letter));

/**
 * One-question-at-a-time quiz runner with instant feedback after "Check".
 *
 * @param {object} props
 * @param {object[]} props.questions - the shuffled quiz questions
 * @param {(results: { question: object, selected: string[], correct: boolean }[]) => void} props.onFinish
 * @param {() => void} props.onQuit
 */
export function PracticeQuiz({ questions, onFinish, onQuit }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [results, setResults] = useState([]);

  const question = questions[index];
  const needed = question.answer.length;
  const isLast = index === questions.length - 1;

  const toggleOption = (letter) => {
    if (isChecked) return;
    if (needed === 1) {
      setSelected([letter]);
      return;
    }
    setSelected((previous) =>
      previous.includes(letter) ? previous.filter((item) => item !== letter) : [...previous, letter]
    );
  };

  const check = () => setIsChecked(true);

  const next = () => {
    const updated = [...results, { question, selected, correct: isCorrectSelection(selected, question.answer) }];
    if (isLast) {
      onFinish(updated);
      return;
    }
    setResults(updated);
    setIndex((previous) => previous + 1);
    setSelected([]);
    setIsChecked(false);
  };

  return (
    <div className="quiz card">
      <div className="quiz__progress">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <div className="quiz__bar" aria-hidden="true">
          <span style={{ width: `${((index + (isChecked ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <button type="button" className="btn btn--ghost btn--small" onClick={onQuit}>
          Quit
        </button>
      </div>

      <div className="quiz__meta">
        <SourceBadge source={question.source} />
        <DomainBadge domain={question.domain} />
        <span className="quiz__service">{serviceById[question.serviceId]?.name}</span>
      </div>

      <p className="quiz__stem">{question.stem}</p>
      {needed > 1 ? <p className="quiz__hint">Select {needed} answers.</p> : null}

      <ul className="quiz__options">
        {question.options.map((option, optionIndex) => {
          const letter = optionLetter(optionIndex);
          const isSelected = selected.includes(letter);
          const isAnswer = question.answer.includes(letter);
          let stateClass = '';
          if (isChecked && isAnswer) stateClass = 'quiz__option--correct';
          else if (isChecked && isSelected) stateClass = 'quiz__option--wrong';
          else if (isSelected) stateClass = 'quiz__option--selected';
          return (
            <li key={letter}>
              <button
                type="button"
                className={`quiz__option ${stateClass}`}
                aria-pressed={isSelected}
                onClick={() => toggleOption(letter)}
              >
                <span className="question-card__letter">{letter}</span>
                <span>{option}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {isChecked ? (
        <div
          className={`quiz__feedback ${
            isCorrectSelection(selected, question.answer) ? 'quiz__feedback--correct' : 'quiz__feedback--wrong'
          }`}
        >
          <strong>
            {isCorrectSelection(selected, question.answer) ? 'Correct' : `Not quite - answer: ${question.answer.join(', ')}`}
          </strong>
          <p>{question.explanation}</p>
          <Link to={`/services/${question.serviceId}`}>Revise {serviceById[question.serviceId]?.name}</Link>
        </div>
      ) : null}

      <div className="quiz__actions">
        {isChecked ? (
          <button type="button" className="btn btn--primary" onClick={next}>
            {isLast ? 'Finish' : 'Next question'}
          </button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={check} disabled={selected.length === 0}>
            Check answer
          </button>
        )}
      </div>
    </div>
  );
}
