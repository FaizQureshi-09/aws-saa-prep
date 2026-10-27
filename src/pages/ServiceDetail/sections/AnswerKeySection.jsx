import { SourceBadge } from '../../../components/common/Badge/SourceBadge';
import { ServiceSection } from '../ServiceSection';

/**
 * Final section: the answer key with explanations, kept at the very end of
 * the page so students can attempt the questions first.
 * @param {{ questions: object[] }} props
 */
export function AnswerKeySection({ questions }) {
  return (
    <ServiceSection id="answer-key" number={13} title="Answer key">
      <ol className="answer-key">
        {questions.map((question, index) => (
          <li key={question.stem} className="answer-key__item">
            <div className="answer-key__head">
              <strong>
                Q{index + 1}: {question.answer.join(', ')}
              </strong>
              <SourceBadge source={question.source} />
            </div>
            <p>{question.explanation}</p>
          </li>
        ))}
      </ol>
    </ServiceSection>
  );
}
