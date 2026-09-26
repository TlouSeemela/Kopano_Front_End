import { getCurrentSolution, readinessScore } from './state.js';
import { opportunities } from './opportunities.js';
import { escapeHtml } from './solutions.js';

export function renderProfile(container) {
  const solution = getCurrentSolution();
  const available = solution.documents.filter(item => item.status !== 'Missing');
  container.innerHTML = `<article class="profile-page"><header class="profile-cover"><div><h2>${escapeHtml(solution.name)}</h2><p>${escapeHtml(solution.description || 'Add a clear description of how this solution works.')}</p></div><span class="profile-active">✓ Profile active</span></header><div class="profile-body"><div><section class="profile-section"><span class="overline">Problem and approach</span><h3>${escapeHtml(solution.name)}</h3><p>${escapeHtml(solution.problem || 'Add the public-service problem this solution addresses.')}</p></section><section class="profile-section"><span class="overline">Potential opportunity alignment</span><h3>${escapeHtml(opportunities[0].title)}</h3><p><strong>Why it may align:</strong> the solution supports a measurable public-service need and has evidence that can be reviewed against the opportunity requirements.</p></section><section class="profile-section"><span class="overline">Evidence available</span><p>${available.length ? available.map(item => escapeHtml(item.name)).join(' · ') : 'No evidence shared yet.'}</p></section></div><aside class="profile-aside"><span class="tag">Kopano assessment</span><div class="profile-score">${readinessScore(solution)}%</div><strong>Opportunity readiness</strong><p>Calculated from profile completeness and locally stored evidence.</p><section class="profile-section"><strong>Pilot outline</strong><p>${escapeHtml(solution.pilot)}</p><strong>Success measure</strong><p>${escapeHtml(solution.measure)}</p></section></aside></div></article>`;
}

export function profileLink() {
  return `https://kopano.example/profile/${encodeURIComponent(getCurrentSolution().id)}`;
}
