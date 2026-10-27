import { ServiceSection } from '../ServiceSection';

/**
 * Section 2: real-world use cases as a card grid.
 * @param {{ useCases: { title: string, detail: string }[] }} props
 */
export function UseCasesSection({ useCases }) {
  return (
    <ServiceSection id="use-cases" number={2} title="Use cases">
      <div className="usecase-grid">
        {useCases.map((useCase) => (
          <div className="usecase-card" key={useCase.title}>
            <h3>{useCase.title}</h3>
            <p>{useCase.detail}</p>
          </div>
        ))}
      </div>
    </ServiceSection>
  );
}
