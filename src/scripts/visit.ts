/** Records where the visit came from for the lead form (src/utils/visit.ts). Storage may be blocked: then nothing. */
import { recordVisit, visitFrom } from '../utils/visit';

try {
  recordVisit(window.sessionStorage, visitFrom(window.location.href, document.referrer, document.documentElement.lang));
} catch {
  /* sessionStorage unavailable (private mode, blocked storage) */
}
