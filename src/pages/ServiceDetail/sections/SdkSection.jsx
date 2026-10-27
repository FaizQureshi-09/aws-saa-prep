import { CodeBlock } from '../../../components/common/CodeBlock/CodeBlock';
import { Callout } from '../../../components/common/Callout/Callout';
import { ServiceSection } from '../ServiceSection';

/**
 * Section 5: SDK availability and example calls.
 * @param {{ sdk: { summary: string, snippets: { title: string, language: string, code: string }[] } }} props
 */
export function SdkSection({ sdk }) {
  return (
    <ServiceSection id="sdk" number={5} title="SDK availability and important calls">
      <Callout variant="info" title="Exam scope">
        {sdk.summary}
      </Callout>
      <div className="sdk-list">
        {sdk.snippets.map((snippet) => (
          <CodeBlock key={snippet.title} code={snippet.code} language={snippet.language} title={snippet.title} />
        ))}
      </div>
    </ServiceSection>
  );
}
