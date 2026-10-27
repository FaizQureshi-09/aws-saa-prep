import { CodeBlock } from '../../../components/common/CodeBlock/CodeBlock';
import { ServiceSection } from '../ServiceSection';

/**
 * Section 4: the most useful AWS CLI commands, each with a one-line purpose.
 * @param {{ commands: { command: string, description: string }[] }} props
 */
export function CliSection({ commands }) {
  return (
    <ServiceSection id="cli" number={4} title="Important CLI commands">
      <p className="service-section__note">
        The AWS CLI is in scope for SAA-C03. You will not be asked to type commands, but reading
        them helps you understand what each feature does.
      </p>
      <div className="cli-list">
        {commands.map((item) => (
          <div className="cli-item" key={item.command}>
            <p className="cli-item__description">{item.description}</p>
            <CodeBlock code={item.command} language="bash" />
          </div>
        ))}
      </div>
    </ServiceSection>
  );
}
