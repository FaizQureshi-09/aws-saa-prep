import { examSources } from '../../data/examData';
import { removedFromScope, renamedServices } from '../../data/scopeData';
import { Callout } from '../../components/common/Callout/Callout';

/**
 * Prominent notice about the exam guide's 2026 revisions, so students know
 * the in-scope list differs from older PDFs and blog posts they may find.
 */
export function ExamUpdateBanner() {
  return (
    <Callout variant="warning" title="Read first: the official exam guide changed in 2026">
      <p>
        The exam is still <strong>SAA-C03</strong> (AWS's certification page lists no newer code).
        However, AWS's current{' '}
        <a href={examSources.examGuide.url} target="_blank" rel="noopener noreferrer">
          HTML exam guide
        </a>{' '}
        has a{' '}
        <a href={examSources.revisions.url} target="_blank" rel="noopener noreferrer">
          revision history
        </a>{' '}
        showing version 1.0 (28 August 2026) and version 1.1 (29 October 2026), and states that guide
        updates are published about one month before they are reflected on the exam.
      </p>
      <p>
        Compared with the 2023 PDF that most study material still copies, {removedFromScope.length}{' '}
        services are no longer in the in-scope list
        ({removedFromScope.map((item) => item.name.replace(/^(Amazon|AWS) /, '')).join(', ')}), and{' '}
        {renamedServices.map((item) => `${item.from} is now ${item.to}`).join('; ')}. This site is
        built on the current list. Re-check the guide the day you book your exam.
      </p>
    </Callout>
  );
}
