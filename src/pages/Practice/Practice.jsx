import { useCallback, useState } from 'react';
import { useQuestionBank } from '../../hooks/useQuestionBank';
import { usePageTitle } from '../../hooks/usePageTitle';
import { readJson, writeJson } from '../../utils/safeStorage';
import { PageHeader } from '../../components/common/PageHeader/PageHeader';
import { PracticeSetup } from './PracticeSetup';
import { PracticeQuiz } from './PracticeQuiz';
import { PracticeResult } from './PracticeResult';
import './Practice.css';

const HISTORY_KEY = 'saa-prep-quiz-v1';

/**
 * Practice hub: pick filters, answer questions one at a time with instant
 * feedback, then review the score. Per-question history is kept in
 * localStorage on this device only.
 */
export function Practice() {
  usePageTitle('Practice');
  const { status, questions: bank } = useQuestionBank();
  const [phase, setPhase] = useState('setup');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState(() => readJson(HISTORY_KEY, {}));

  const start = useCallback((questions) => {
    setQuizQuestions(questions);
    setPhase('quiz');
  }, []);

  const finish = useCallback((finalResults) => {
    setResults(finalResults);
    setHistory((previous) => {
      const updated = { ...previous };
      finalResults.forEach(({ question, correct }) => {
        const entry = updated[question.id] ?? { attempts: 0, correct: 0 };
        updated[question.id] = { attempts: entry.attempts + 1, correct: entry.correct + (correct ? 1 : 0) };
      });
      writeJson(HISTORY_KEY, updated);
      return updated;
    });
    setPhase('result');
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="Practice questions"
        description="Official AWS sample questions and original scenario-style mocks across every service, with instant feedback and explanations."
      />
      <section className="section">
        <div className="container practice">
          {status === 'loading' ? <p>Loading the question bank...</p> : null}
          {status === 'ready' && phase === 'setup' ? <PracticeSetup bank={bank} history={history} onStart={start} /> : null}
          {phase === 'quiz' ? <PracticeQuiz questions={quizQuestions} onFinish={finish} onQuit={() => setPhase('setup')} /> : null}
          {phase === 'result' ? <PracticeResult results={results} onRestart={() => setPhase('setup')} /> : null}
        </div>
      </section>
    </>
  );
}
