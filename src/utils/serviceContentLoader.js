/**
 * Lazy loader for per-service study content. Vite turns each file in
 * src/data/services/ into its own code-split chunk, so a student only
 * downloads the pages they actually open (the Practice page loads all of
 * them on demand to build the question bank).
 */

const contentModules = import.meta.glob('../data/services/*.js');

/** Map: service id -> () => Promise<module>. */
const loaderById = Object.fromEntries(
  Object.entries(contentModules).map(([path, loader]) => [
    path.replace('../data/services/', '').replace('.js', ''),
    loader,
  ])
);

/**
 * Loads the study content for one service.
 * @param {string} serviceId
 * @returns {Promise<object | null>} the content object, or null if no page exists yet
 */
export async function loadServiceContent(serviceId) {
  const loader = loaderById[serviceId];
  if (!loader) return null;
  const module = await loader();
  return module.default;
}

/** Whether a content file exists for the id. */
export function hasServiceContent(serviceId) {
  return Boolean(loaderById[serviceId]);
}

/**
 * Loads every service's content (used to build the practice question bank).
 * @returns {Promise<{ serviceId: string, content: object }[]>}
 */
export async function loadAllServiceContent() {
  const entries = await Promise.all(
    Object.keys(loaderById).map(async (serviceId) => ({
      serviceId,
      content: await loadServiceContent(serviceId),
    }))
  );
  return entries.filter((entry) => entry.content);
}
