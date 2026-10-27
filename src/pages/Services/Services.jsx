import { useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { categories, tiers } from '../../data/categoriesData';
import { serviceCatalog, totalCatalogHours } from '../../data/serviceCatalog';
import { quickReference } from '../../data/scopeData';
import { useProgressTracker } from '../../hooks/useProgressTracker';
import { usePageTitle } from '../../hooks/usePageTitle';
import { PageHeader } from '../../components/common/PageHeader/PageHeader';
import { SectionHeading } from '../../components/common/SectionHeading/SectionHeading';
import { SourceList } from '../../components/common/SourceList/SourceList';
import { ServiceCard } from './ServiceCard';
import './Services.css';

/**
 * Searchable, filterable catalog of every study page, grouped by AWS
 * category, with the quick-reference list for in-scope services that do
 * not need a dedicated page.
 */
export function Services() {
  usePageTitle('Services');
  const { rowByServiceId } = useProgressTracker();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');

  const filteredServices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return serviceCatalog.filter((service) => {
      if (categoryFilter !== 'all' && service.category !== categoryFilter) return false;
      if (tierFilter !== 'all' && service.tier !== tierFilter) return false;
      if (domainFilter !== 'all' && !service.domains.includes(Number(domainFilter))) return false;
      if (!needle) return true;
      return `${service.name} ${service.summary} ${service.id}`.toLowerCase().includes(needle);
    });
  }, [query, categoryFilter, tierFilter, domainFilter]);

  const groupedServices = categories
    .map((category) => ({
      category,
      services: filteredServices.filter((service) => service.category === category.id),
    }))
    .filter((group) => group.services.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Study guides"
        title="Every service, one page each"
        description={`${serviceCatalog.length} study pages covering the exam-guide scope, about ${totalCatalogHours.toFixed(1)} hours of recommended study. Each page has an introduction, use cases, CLI, SDK, examples, a flow diagram, question types, practice questions and sources.`}
      />

      <section className="section">
        <div className="container">
          <div className="service-filters">
            <label className="service-filters__search">
              <FaSearch aria-hidden="true" />
              <span className="visually-hidden">Search services</span>
              <input
                type="search"
                placeholder="Search services (for example: lambda, encryption, cache)"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label>
              <span className="visually-hidden">Category</span>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="visually-hidden">Priority</span>
              <select value={tierFilter} onChange={(event) => setTierFilter(event.target.value)}>
                <option value="all">All priorities</option>
                {tiers.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="visually-hidden">Exam domain</span>
              <select value={domainFilter} onChange={(event) => setDomainFilter(event.target.value)}>
                <option value="all">All domains</option>
                <option value="1">Domain 1 - Secure</option>
                <option value="2">Domain 2 - Resilient</option>
                <option value="3">Domain 3 - High-Performing</option>
                <option value="4">Domain 4 - Cost-Optimized</option>
              </select>
            </label>
          </div>

          <p className="services__count" role="status">
            Showing {filteredServices.length} of {serviceCatalog.length} pages
          </p>

          {groupedServices.length === 0 ? (
            <p className="services__empty">No service matches those filters.</p>
          ) : (
            groupedServices.map(({ category, services }) => (
              <div className="services__group" key={category.id}>
                <h2 className="services__group-title" style={{ '--group-color': category.color }}>
                  {category.label} <span>{services.length}</span>
                </h2>
                <div className="services__grid">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} status={rowByServiceId[service.id]?.status} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            eyebrow="Also in scope"
            title="Services without a dedicated page"
            subtitle="Named in the current in-scope list but rarely tested in depth. A one-line purpose and the official documentation link is enough for the exam."
          />
          <div className="quickref-grid">
            {quickReference.map((item) => (
              <article className="quickref-card" key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.purpose}</p>
                <SourceList sources={[{ title: 'Official documentation', url: item.url }]} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
