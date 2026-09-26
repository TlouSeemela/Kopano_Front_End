import { getCurrentSolution } from './state.js';
import { escapeHtml } from './solutions.js';

export const opportunities = [
  { id: 'municipal-services', organisation: 'CPSI', title: 'Improving municipal service fault reporting', description: 'Seeking citizen-focused approaches to report, route and monitor local service disruptions.', type: 'Technology', requirements: 12, match: 91 },
  { id: 'responsive-government', organisation: 'SITA', title: 'Digital tools for responsive local government', description: 'Solutions that shorten response times and improve visibility across public service teams.', type: 'Digital services', requirements: 9, match: 84 },
  { id: 'community-pilot', organisation: 'Innovation hub', title: 'Community technology pilot programme', description: 'A supported pilot route for technology addressing measurable community needs.', type: 'Pilot', requirements: 7, match: 76 }
];

function score(opportunity) {
  return Math.max(45, Math.min(96, opportunity.match + (getCurrentSolution().matchShift || 0)));
}

function matchCard(opportunity) {
  return `<article class="match-card"><div class="match-header"><span class="tag">${escapeHtml(opportunity.organisation)}</span><span class="match-value">${score(opportunity)}% match</span></div><h3>${escapeHtml(opportunity.title)}</h3><p>${escapeHtml(opportunity.description)}</p><button class="card-link" type="button" data-view="opportunities">Review match →</button></article>`;
}

export function renderOverviewMatches(container) {
  container.innerHTML = opportunities.map(matchCard).join('');
}

export function renderOpportunityList(container, filter = 'all') {
  const visible = opportunities.filter(item => filter === 'all' || item.organisation === filter || item.type === filter);
  container.innerHTML = visible.map(item => `<article class="panel opportunity-card"><div><span class="tag">${escapeHtml(item.organisation)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><div class="opportunity-meta"><span>${escapeHtml(item.type)}</span><span>${item.requirements} requirements</span><button class="card-link" type="button" data-view="documents">Review requirements →</button></div></div><div class="opportunity-score"><strong>${score(item)}%</strong><span>potential match</span></div></article>`).join('');
}
