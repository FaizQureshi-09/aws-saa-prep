import { useMemo, useState } from 'react';
import { serviceCatalog } from '../../data/serviceCatalog';
import { Callout } from '../../components/common/Callout/Callout';

const COUNT_OPTIONS = [10, 20, 30, 65];

/**
 * Quiz setup form: filter the question bank by domain, source and service,
 * choose how many questions, then start.
 *
 * @param {object} props
 * @param {object[]} props.bank - all questions
 * @param {Record<string, { attempts: number, correct: number }>} props.history
 * @param {(questions: object[]) => void} props.onStart
 */
export function PracticeSetup({ bank, history, onStart }) {
  const [domain, setDomain] = useState('all');
  const [source, setSource] = useState('all');
  const [serviceId, setServiceId] = useState('all');
  const [count, setCount] = useState(20);
  const [onlyUnseen, setOnlyUnseen] = useState(false);

  const available = useMemo(
    () =>
      bank.filter((question) => {
        if (domain !== 'all' && question.domain !== Number(domain)) return false;
        if (source !== 'all' && question.source !== source) return false;
        if (serviceId !== 'all' && question.serviceId !== serviceId) return false;
        if (onlyUnseen && history[question.id]) return false;
        return true;
      }),
    [bank, domain, source, serviceId, onlyUnseen, history]
  );

  const servicesWithQuestions = useMemo(() => {
    const ids = new Set(bank.map((question) => question.serviceId));
    return serviceCatalog.filter((service) => ids.has(service.id));
  }, [bank]);

  const officialCount = bank.filter((question) => question.source === 'official').length;
  const attemptedCount = Object.keys(history).length;
  const correctCount = Object.values(history).filter((entry) => entry.correct > 0 && entry.correct === entry.attempts).length;

  const start = () => {
    const shuffled = [...available];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    onStart(shuffled.slice(0, count));
  };

  return (
    <div className="practice-setup">
      <Callout variant="warning" title="About this question bank">
        {bank.length} questions from all study pages: {officialCount} official AWS sample questions and{' '}
        {bank.length - officialCount} original mock questions. Real exam questions are not included -
        they are protected by AWS's candidate agreement. A percentage here is not directly comparable to
        the exam's scaled 100-1,000 score. For a full-length timed test use AWS's Official Practice Exam.
      </Callout>

      <form
        className="practice-form card"
        onSubmit={(event) => {
          event.preventDefault();
          start();
        }}
      >
        <label>
          Exam domain
          <select value={domain} onChange={(event) => setDomain(event.target.value)}>
            <option value="all">All domains</option>
            <option value="1">Domain 1 - Secure Architectures</option>
            <option value="2">Domain 2 - Resilient Architectures</option>
            <option value="3">Domain 3 - High-Performing Architectures</option>
            <option value="4">Domain 4 - Cost-Optimized Architectures</option>
          </select>
        </label>
        <label>
          Question source
          <select value={source} onChange={(event) => setSource(event.target.value)}>
            <option value="all">Official + mock</option>
            <option value="official">Official AWS samples only</option>
            <option value="mock">Mock (original) only</option>
          </select>
        </label>
        <label>
          Service
          <select value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
            <option value="all">All services</option>
            {servicesWithQuestions.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Number of questions
          <select value={count} onChange={(event) => setCount(Number(event.target.value))}>
            {COUNT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="practice-form__check">
          <input type="checkbox" checked={onlyUnseen} onChange={(event) => setOnlyUnseen(event.target.checked)} />
          Only questions I have not attempted
        </label>

        <div className="practice-form__footer">
          <p>
            <strong>{available.length}</strong> matching question{available.length === 1 ? '' : 's'}
            {attemptedCount > 0 ? ` · you have attempted ${attemptedCount} (${correctCount} always correct)` : ''}
          </p>
          <button type="submit" className="btn btn--primary" disabled={available.length === 0}>
            Start quiz ({Math.min(count, available.length)})
          </button>
        </div>
      </form>
    </div>
  );
}
