import { Link } from 'react-router-dom';
import { serviceById } from '../../data/serviceCatalog';
import { hoursForDay, studyPlan, totalPlannedHours } from '../../data/studyPlanData';
import { SectionHeading } from '../../components/common/SectionHeading/SectionHeading';
import { Callout } from '../../components/common/Callout/Callout';

/**
 * Section 5: the 30-day timeline. Each day lists the services to study,
 * with per-day and total hours computed from the catalog's estimates.
 */
export function StudyTimeline() {
  const practiceHours = studyPlan
    .flatMap((week) => week.days)
    .reduce((sum, day) => sum + (day.taskHours ?? 0), 0);

  return (
    <section className="section" id="timeline">
      <div className="container">
        <SectionHeading
          eyebrow="5 · Timeline"
          title="30-day study plan"
          subtitle={`${totalPlannedHours.toFixed(1)} hours in total (${(totalPlannedHours - practiceHours).toFixed(1)} h learning + ${practiceHours} h practice and review) - roughly ${(totalPlannedHours / 30).toFixed(1)} hours per day on average.`}
        />

        <Callout variant="info" title="This plan is a recommendation, not an AWS schedule">
          Hours per service are editorial estimates (reading, a short hands-on lab and the page's
          questions). If you already work with AWS daily, compress Weeks 1-3 and spend the saved days on
          timed practice. Track your real hours on the <Link to="/tracker">Tracker</Link>.
        </Callout>

        <div className="timeline">
          {studyPlan.map((week) => (
            <article className="week-card" key={week.week}>
              <header className="week-card__header">
                <span className="week-card__number">Week {week.week}</span>
                <div>
                  <h3>{week.title}</h3>
                  <p>{week.goal}</p>
                </div>
              </header>

              <ol className="day-list">
                {week.days.map((day) => (
                  <li className="day-item" key={day.day}>
                    <div className="day-item__meta">
                      <span className="day-item__number">Day {day.day}</span>
                      <span className="day-item__hours">{hoursForDay(day).toFixed(2).replace(/\.?0+$/, '')} h</span>
                    </div>
                    <div className="day-item__body">
                      <strong>{day.focus}</strong>
                      {day.task ? <p className="day-item__task">{day.task}</p> : null}
                      {day.services.length > 0 ? (
                        <div className="day-item__chips">
                          {day.services.map((id) => (
                            <Link key={id} to={`/services/${id}`} className="related-chip related-chip--compact">
                              {serviceById[id]?.name ?? id}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
