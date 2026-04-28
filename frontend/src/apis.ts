const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const SPENDING_FREEZE_UNTIL_KEY = 'spendingFreezeUntil';

// ===== AUTH HELPERS =====
function getToken(): string | null {
    return localStorage.getItem('token');
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    picture?: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

export async function googleLogin(credential: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Google login failed');
    return data;
}

export function logoutUser(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function redirectToLogin(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (window.location.pathname !== '/login') {
        window.location.replace('/login');
    }
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
    try {
        const data = await response.json();
        return data?.error || fallback;
    } catch {
        return fallback;
    }
}

async function requestJson<T>(
    path: string,
    init: RequestInit,
    fallbackError: string,
    withAuth = true,
): Promise<T> {
    const headers = new Headers(init.headers || {});
    headers.set('Content-Type', 'application/json');

    if (withAuth) {
        const token = getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
    });

    if (response.status === 401 && withAuth) {
        logoutUser();
        redirectToLogin();
        throw new Error('Session expired. Please sign in again.');
    }

    if (!response.ok) {
        throw new Error(await readErrorMessage(response, fallbackError));
    }

    return response.json() as Promise<T>;
}

export function getLoggedInUser(): AuthUser | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        localStorage.removeItem('user');
        return null;
    }
}

export function freezeSpendingFor24h(): void {
    const freezeUntil = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem(SPENDING_FREEZE_UNTIL_KEY, String(freezeUntil));
}

export function getSpendingFreezeRemainingMs(): number {
    const raw = localStorage.getItem(SPENDING_FREEZE_UNTIL_KEY);
    if (!raw) return 0;

    const freezeUntil = Number(raw);
    if (!Number.isFinite(freezeUntil)) {
        localStorage.removeItem(SPENDING_FREEZE_UNTIL_KEY);
        return 0;
    }

    const remaining = freezeUntil - Date.now();
    if (remaining <= 0) {
        localStorage.removeItem(SPENDING_FREEZE_UNTIL_KEY);
        return 0;
    }

    return remaining;
}


// ===== TYPE DEFINITIONS =====
export interface Week {
    week: number;
    allocated: number;
    spent: number;
    balance: number;
}

export interface CategoryTotals {
    food: number;
    transport: number;
    fun: number;
    other: number;
}

export interface Budget {
    allowance: number;
    monthStartDate: number;
    weeks: Week[];
    expenses: Expense[];
    categoryTotals: CategoryTotals;
    isOverdrawn: boolean;
}

export interface Expense {
    amount: number;
    category: string;
    weekIndex: number;
    date?: string;
    note?: string;
}

export interface BurnRate {
    daysRemaining: number;
    remainingMoney: number;
    safeDailySpend: number;
}

export interface Prediction {
    dailyAvg: number;
    runOutDate: string;
}

export interface OverviewResponse {
    budget: Budget;
    burnRate: BurnRate;
    prediction: Prediction | null;
    suggestFreeze: boolean;
    currentWeekIndex: number;
}

export interface InitBudgetRequest {
    allowance: number;
    weeklyAllocations?: number[];
}

export interface AddExpenseRequest {
    amount: number;
    category: string;
    weekIndex: number;
}

export async function initBudget(allowance: number, weeklyAllocations?: number[]): Promise<Budget> {
    return requestJson<Budget>('/budget/init', {
        method: 'POST',
        body: JSON.stringify({
            allowance,
            weeklyAllocations,
        }),
    }, 'Failed to initialize budget');
}

export async function getBudgetOverview(): Promise<OverviewResponse> {
    return requestJson<OverviewResponse>('/budget/overview', {
        method: 'GET',
    }, 'Failed to fetch budget overview');
}

export async function addExpense(amount: number, category: string, weekIndex: number, note?: string): Promise<Budget> {
    return requestJson<Budget>('/expense/add', {
        method: 'POST',
        body: JSON.stringify({
            amount,
            category,
            weekIndex,
            note: note || '',
        }),
    }, 'Failed to add expense');
}

export function getCurrentWeekIndex(): number {
    const now = new Date();
    const dayOfMonth = now.getDate();

    if (dayOfMonth <= 7) return 0;
    if (dayOfMonth <= 14) return 1;
    if (dayOfMonth <= 21) return 2;
    return 3;
}
export function getDaysRemainingInWeek(): number {
    const now = new Date();
    const dayOfMonth = now.getDate();

    if (dayOfMonth <= 7) return 7 - dayOfMonth + 1;
    if (dayOfMonth <= 14) return 14 - dayOfMonth + 1;
    if (dayOfMonth <= 21) return 21 - dayOfMonth + 1;

    // Last week - days until end of month
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return lastDay - dayOfMonth + 1;
}


export function formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
}

export function getSpendingStatus(spent: number, allocated: number): 'safe' | 'warning' | 'danger' {
    if (allocated === 0) return 'safe';
    const percentage = (spent / allocated) * 100;

    if (percentage >= 100) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'safe';
}

export async function updateBudgetAllowance(newAllowance: number): Promise<Budget> {
    return requestJson<Budget>('/budget/update-allowance', {
        method: 'POST',
        body: JSON.stringify({ allowance: newAllowance }),
    }, 'Failed to update budget allowance');
}

export async function resetMonthData(): Promise<Budget> {
    return requestJson<Budget>('/budget/reset', {
        method: 'POST',
    }, 'Failed to reset month data');
}

export async function updateMonthStartDate(monthStartDate: number): Promise<Budget> {
    return requestJson<Budget>('/budget/month-start-date', {
        method: 'POST',
        body: JSON.stringify({ monthStartDate }),
    }, 'Failed to update month start date');
}
