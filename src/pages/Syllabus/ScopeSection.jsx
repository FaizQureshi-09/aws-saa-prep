import { examSources } from '../../data/examData';
import { inScopeByCategory, outOfScopeByCategory, removedFromScope, renamedServices } from '../../data/scopeData';
import { SectionHeading } from '../../components/common/SectionHeading/SectionHeading';
import { Callout } from '../../components/common/Callout/Callout';

/**
 * Section 4: the official in-scope and out-of-scope service lists, and what
 * changed since the 2023 exam-guide PDF.
 */
export function ScopeSection() {
  return (
    <section className="section section-alt" id="scope">
      <div className="container">
        <SectionHeading
          eyebrow="4 · Scope"
          title="What is in scope and what is not"
          subtitle="Copied from the current official exam guide. AWS calls both lists non-exhaustive and subject to change."
        />

        <Callout variant="tip" title="Out of scope does not mean unused in the real world">
          <strong>AWS Tools and SDKs</strong>, <strong>CodeBuild</strong>, <strong>CodeDeploy</strong>,{' '}
          <strong>CodeCommit</strong>, <strong>CDK</strong> and <strong>CloudShell</strong> are explicitly
          out of scope for SAA-C03, so you will not be tested on writing SDK code or CI/CD pipelines
          with CodeBuild. The AWS CLI and CloudFormation, however, are in scope.
        </Callout>

        <h3 className="subsection-title">
          In-scope services{' '}
          <a href={examSources.inScope.url} target="_blank" rel="noopener noreferrer" className="fact-source">
            Official list
          </a>
        </h3>
        <div className="scope-grid">
          {inScopeByCategory.map((group) => (
            <article className="scope-card" key={group.category}>
              <h4>{group.category}</h4>
              <ul>
                {group.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <h3 className="subsection-title">
          Out-of-scope services{' '}
          <a href={examSources.outOfScope.url} target="_blank" rel="noopener noreferrer" className="fact-source">
            Official list
          </a>
        </h3>
        <div className="scope-grid scope-grid--muted">
          {outOfScopeByCategory.map((group) => (
            <article className="scope-card" key={group.category}>
              <h4>{group.category}</h4>
              <ul>
                {group.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <h3 className="subsection-title">Changes since the 2023 exam guide PDF</h3>
        <p className="card__note">
          Only Elastic Transcoder's removal is stated in AWS's own revision table; the others come from
          our comparison of the 2023 PDF list with the current list. A service missing from the list can
          still exist - it is just no longer a stated exam target.
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">What we found</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {removedFromScope.map((item) => (
                <tr key={item.name}>
                  <td>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                  </td>
                  <td>{item.note}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
              {renamedServices.map((item) => (
                <tr key={item.from}>
                  <td>
                    {item.from} → {item.to}
                  </td>
                  <td>{item.note}</td>
                  <td>Renamed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
