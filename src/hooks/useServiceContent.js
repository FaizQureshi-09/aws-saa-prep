import { useEffect, useState } from 'react';
import { loadServiceContent } from '../utils/serviceContentLoader';

/**
 * Loads a service's long-form study content on demand.
 *
 * @param {string | undefined} serviceId - catalog id from the route
 * @returns {{ content: object | null, status: 'loading' | 'ready' | 'missing' }}
 */
export function useServiceContent(serviceId) {
  const [state, setState] = useState({ serviceId: null, content: null, status: 'loading' });

  useEffect(() => {
    let isCancelled = false;
    loadServiceContent(serviceId)
      .then((content) => {
        if (isCancelled) return;
        setState({ serviceId, content, status: content ? 'ready' : 'missing' });
      })
      .catch(() => {
        if (!isCancelled) setState({ serviceId, content: null, status: 'missing' });
      });
    return () => {
      isCancelled = true;
    };
  }, [serviceId]);

  // Until the effect resolves for the current id, report "loading" so a
  // previous service's content is never shown under the new heading.
  if (state.serviceId !== serviceId) {
    return { content: null, status: 'loading' };
  }
  return { content: state.content, status: state.status };
}
