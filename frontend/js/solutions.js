import { getCurrentSolution, getState, readinessScore } from './state.js';

const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

export function renderSolutions(container) {
  const state = getState();
  container.innerHTML = state.solutions.map(solution => `
    <div class="solution-row ${solution.id === state.activeSolutionId ? 'active' : ''}">
      <button class="solution-select" type="button" data-solution-id="${escapeHtml(solution.id)}" aria-pressed="${solution.id === state.activeSolutionId}" title="${escapeHtml(solution.name)}">
        <strong>${escapeHtml(solution.name)}</strong>
      </button>
      <button class="solution-more" type="button" data-solution-options="${escapeHtml(solution.id)}" aria-label="Options for ${escapeHtml(solution.name)}">⋮</button>
    </div>`).join('');
}

export function renderOverview(panel, requirementsContainer) {
  const solution = getCurrentSolution();
  const score = readinessScore(solution);
  const label = score >= 80 ? 'Submission ready' : score >= 70 ? 'Good foundation' : 'Needs attention';
  panel.innerHTML = `
    <div class="score-ring" style="--score:${score}"><strong>${score}%</strong><small>ready</small></div>
    <div class="readiness-copy"><h2>${escapeHtml(solution.name)}</h2><p>Your strongest areas are problem alignment and prototype maturity. Add evidence to improve this profile.</p><div class="progress"><span style="width:${score}%"></span></div><div class="progress-label"><span>Current readiness</span><strong>${label}</strong></div></div>`;
  requirementsContainer.innerHTML = solution.documents.slice(0, 3).map(item => `
    <div class="requirement ${item.status === 'Missing' ? '' : 'complete'}"><span class="requirement-icon">${item.status === 'Missing' ? '!' : '✓'}</span><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.detail)}</small></span></div>`).join('');
}

export { escapeHtml };
