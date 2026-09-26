const STORAGE_KEY = 'kopano-frontend-v1';

export function loadStoredState() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return value && Array.isArray(value.solutions) && value.solutions.length ? value : null;
  } catch {
    return null;
  }
}

export function saveStoredState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    activeSolutionId: state.activeSolutionId,
    solutions: state.solutions,
    selectedOpportunityId: state.selectedOpportunityId
  }));
}

export function resetStoredState() {
  localStorage.removeItem(STORAGE_KEY);
}
