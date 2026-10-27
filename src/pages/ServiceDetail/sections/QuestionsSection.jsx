import { Callout } from '../../../components/common/Callout/Callout';
import { ServiceSection } from '../ServiceSection';
import { QuestionCard } from '../QuestionCard';

/**
 * Section 9: practice questions. Each is labelled as an official AWS sample
 * or an original mock question; answers are in the answer key at the end.
 * @param {{ questions: object[] }} props
 */
export function QuestionsSection({ questions }) {
  return (
    <ServiceSection id="questions" number={9} title="Practice questions">
      <Callout variant="warning" title="About these questions">
        Each question is labelled <strong>Official AWS sample</strong> (published by AWS in its
        SAA-C03 sample-question PDF) or <strong>Mock (original)</strong> (written for this site in
        the exam's scenario style). Real exam questions are protected by AWS's candidate agreement,
        so no leaked or "brain dump" content is reproduced here. The answer key is at the bottom of
        this page.
      </Callout>
      <div className="question-list">
        {questions.map((question, index) => (
          <QuestionCard key={question.stem} number={index + 1} question={question} />
        ))}
      </div>
    </ServiceSection>
  );
}
