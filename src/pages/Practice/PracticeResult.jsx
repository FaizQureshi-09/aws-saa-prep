import { Link } from 'react-router-dom';
import { serviceById } from '../../data/serviceCatalog';
import { Callout } from '../../components/common/Callout/Callout';

/**
 * Score summary after a quiz, with a per-domain breakdown and links back
 * to the study pages of every missed question.
 *
 * @param {object} props
 * @param {{ question: object, selected: string[], correct: boolean }[]} props.results
 * @param {() => void} props.onRestart
 */
export function PracticeResult({ results, onRestart }) {
  const total = results.length;
  const correct = results.filter((result) => result.correct).length;
  const percent = total ? (correct / total) * 100 : 0;
  const missed = results.filter((result) => !result.correct);

  const byDomain = [1, 2, 3, 4]
    .map((domain) => {
      const inDomain = results.filter((result) => result.question.domain === domain);
      return { domain, total: inDomain.length, correct: inDomain.filter((result) => result.correct).length };
    })
    .filter((entry) => entry.total > 0);

  return (
    <div className="quiz-result card">
      <h2>Quiz complete</h2>
      <p className="quiz-result__score">
        {correct} / {total} <span>({percent.toFixed(0)}%)</span>
      </p>

      <ul className="quiz-result__domains">
        {byDomain.map((entry) => (
          <li key={entry.domain}>
            <span>Domain {entry.domain}</span>
            <strong>
              {entry.correct} / {entry.total}
            </strong>
          </li>
        ))}
      </ul>

      <Callout variant="info" title="Reading your score">
        This percentage is not the exam's scaled score (100-1,000, pass at 720), and AWS does not publish
        a raw-percentage pass mark. Use it to find weak services, then take AWS's Official Practice Exam
        for a calibrated, timed estimate.
      </Callout>

      {missed.length > 0 ? (
        <>
          <h3>Revise these</h3>
          <ul className="quiz-result__missed">
            {missed.map(({ question }) => (
              <li key={question.id}>
                <Link to={`/services/${question.serviceId}`}>{serviceById[question.serviceId]?.name}</Link>
                <span>{question.stem.slice(0, 110)}...</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Perfect - no missed questions in this set.</p>
      )}

      <button type="button" className="btn btn--primary" onClick={onRestart}>
        New quiz
      </button>
    </div>
  );
}
