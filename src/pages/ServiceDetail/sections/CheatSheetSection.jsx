import { ServiceSection } from '../ServiceSection';

/**
 * Section 10 (added by the architect's view of exam prep): key facts and
 * limits to memorise plus "if you see X, think Y" exam traps.
 * @param {{ keyFacts: string[], traps: { clue: string, answer: string }[] }} props
 */
export function CheatSheetSection({ keyFacts, traps }) {
  return (
    <ServiceSection id="cheat-sheet" number={10} title="Key facts, limits and exam traps">
      <h3 className="service-subheading">Facts and limits to memorise</h3>
      <ul className="prose-list">
        {keyFacts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      <h3 className="service-subheading">If the question says... think...</h3>
      <div className="trap-table" role="table">
        {traps.map((trap) => (
          <div className="trap-row" role="row" key={trap.clue}>
            <div className="trap-row__clue" role="cell">{trap.clue}</div>
            <div className="trap-row__answer" role="cell">{trap.answer}</div>
          </div>
        ))}
      </div>
    </ServiceSection>
  );
}
