import { useEffect, useState } from 'react';
import { loadAllServiceContent } from '../utils/serviceContentLoader';

/**
 * Loads every service's practice questions into one flat bank. Each
 * question gets a stable id (`serviceId:index`) and its owning serviceId.
 *
 * @returns {{ status: 'loading' | 'ready', questions: object[] }}
 */
export function useQuestionBank() {
  const [state, setState] = useState({ status: 'loading', questions: [] });

  useEffect(() => {
    let isCancelled = false;
    loadAllServiceContent().then((entries) => {
      if (isCancelled) return;
      const questions = entries.flatMap(({ serviceId, content }) =>
        (content.questions ?? []).map((question, index) => ({
          ...question,
          id: `${serviceId}:${index}`,
          serviceId,
        }))
      );
      setState({ status: 'ready', questions });
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  return state;
}
