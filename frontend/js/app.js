import { addRequiredDocument, addSolution, deleteSolution, getCurrentSolution, getState, renameSolution, selectSolution, subscribe } from './state.js';
import { renderOverview, renderSolutions } from './solutions.js';
import { renderOpportunityList, renderOverviewMatches } from './opportunities.js';
import { renderDocuments } from './documents.js';
import { profileLink, renderProfile } from './profile.js';
import { closeDialog, closeDrawer, navigate, openDrawer, showToast } from './ui.js';

let managedSolutionId = null;
let pendingRequirementId = null;

function render() {
  const solution = getCurrentSolution();
  document.querySelector('#current-solution-name').textContent = solution.name;
  document.querySelector('#solution-count').textContent = getState().solutions.length;
  renderSolutions(document.querySelector('#solution-list'));
  renderOverview(document.querySelector('#readiness-panel'), document.querySelector('#requirements-list'));
  renderOverviewMatches(document.querySelector('#overview-matches'));
  renderOpportunityList(document.querySelector('#opportunity-list'));
  renderDocuments(document.querySelector('#document-list'), document.querySelector('#selected-match'));
  renderProfile(document.querySelector('#profile-stage'));
  document.querySelector('#profile-link').value = profileLink();
}

subscribe((_, message) => { render(); if (message) showToast(message); });

document.addEventListener('click', event => {
  const uploadButton = event.target.closest('[data-upload-requirement]');
  if (uploadButton) {
    pendingRequirementId = uploadButton.dataset.uploadRequirement;
    const fileInput = document.querySelector('#file-input');
    fileInput.value = '';
    fileInput.click();
    return;
  }
  const documentToggle = event.target.closest('[data-document-toggle]');
  if (documentToggle) {
    const guidance = document.getElementById(documentToggle.getAttribute('aria-controls'));
    const isOpen = documentToggle.getAttribute('aria-expanded') === 'true';
    documentToggle.setAttribute('aria-expanded', String(!isOpen));
    guidance.hidden = isOpen;
    return;
  }
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) { navigate(viewButton.dataset.view); return; }
  const solutionButton = event.target.closest('[data-solution-id]');
  if (solutionButton) { selectSolution(solutionButton.dataset.solutionId); closeDrawer(); return; }
  const optionButton = event.target.closest('[data-solution-options]');
  if (optionButton) {
    managedSolutionId = optionButton.dataset.solutionOptions;
    const solution = getState().solutions.find(item => item.id === managedSolutionId);
    document.querySelector('#solution-actions-title').textContent = solution.name;
    const isOnlySolution = getState().solutions.length === 1;
    document.querySelector('#delete-action').disabled = isOnlySolution;
    document.querySelector('#delete-disabled-note').hidden = !isOnlySolution;
    document.querySelector('#solution-actions-dialog').showModal();
    return;
  }
  const closeButton = event.target.closest('[data-close-dialog]');
  if (closeButton) closeDialog(closeButton.dataset.closeDialog);
});

document.querySelector('#add-solution').addEventListener('click', () => { addSolution(); closeDrawer(); });
document.querySelector('#rename-action').addEventListener('click', () => {
  const solution = getState().solutions.find(item => item.id === managedSolutionId);
  closeDialog('solution-actions-dialog');
  document.querySelector('#rename-input').value = solution.name;
  document.querySelector('#rename-dialog').showModal();
  requestAnimationFrame(() => document.querySelector('#rename-input').select());
});
document.querySelector('#rename-form').addEventListener('submit', event => {
  event.preventDefault();
  if (renameSolution(managedSolutionId, document.querySelector('#rename-input').value)) closeDialog('rename-dialog');
});
document.querySelector('#delete-action').addEventListener('click', () => {
  const solution = getState().solutions.find(item => item.id === managedSolutionId);
  if (!solution || getState().solutions.length === 1) return;
  closeDialog('solution-actions-dialog');
  document.querySelector('#delete-copy').textContent = `Are you sure you want to delete ${solution.name}?`;
  document.querySelector('#delete-dialog').showModal();
});
document.querySelector('#confirm-delete').addEventListener('click', () => { if (deleteSolution(managedSolutionId)) closeDialog('delete-dialog'); });

const fileInput = document.querySelector('#file-input');
fileInput.addEventListener('change', () => {
  if (fileInput.files[0] && pendingRequirementId) addRequiredDocument(pendingRequirementId, fileInput.files[0]);
  fileInput.value = '';
  pendingRequirementId = null;
});

document.querySelector('#share-profile').addEventListener('click', () => document.querySelector('#share-dialog').showModal());
document.querySelector('#copy-link').addEventListener('click', async () => {
  const input = document.querySelector('#profile-link');
  try { await navigator.clipboard.writeText(input.value); } catch { input.select(); document.execCommand('copy'); }
  showToast('Demonstration profile link copied');
});
document.querySelector('#reset-access').addEventListener('click', () => showToast('Profile access reset in this prototype'));

document.querySelector('#menu-button').addEventListener('click', openDrawer);
document.querySelector('#sidebar-close').addEventListener('click', closeDrawer);
document.querySelector('#drawer-backdrop').addEventListener('click', closeDrawer);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDrawer(); });
window.matchMedia('(min-width: 921px)').addEventListener('change', event => { if (event.matches) closeDrawer(); });

render();
navigate('overview');
