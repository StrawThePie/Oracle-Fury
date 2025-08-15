import { useMemo, useState } from 'react';
import { create } from 'zustand';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FallbackLLM } from '@oracle-fury/core';
import { getDefaultActions, type DowntimePhase } from '@oracle-fury/core';

const queryClient = new QueryClient();

type SessionState = {
	seed: number;
	phase: DowntimePhase;
	log: string;
};

const useSession = create<SessionState & { setPhase: (p: DowntimePhase) => void; append: (t: string) => void }>((set) => ({
	seed: 12345,
	phase: 'Camp',
	log: '',
	setPhase: (p) => set({ phase: p }),
	append: (t) => set((s) => ({ log: s.log + t }))
}));

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Shell />
		</QueryClientProvider>
	);
}

function Shell() {
	const { phase, setPhase } = useSession();
	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 p-4" role="application">
			<main className="space-y-3" aria-labelledby="main-heading">
				<h1 id="main-heading" className="text-xl font-semibold">Oracle Fury</h1>
				<ResponseWindow />
				<PromptBox />
				<div className="card">
					<div className="flex items-center gap-2">
						<span className="font-medium">Downtime Phase</span>
						<select
							aria-label="Downtime Phase"
							className="input"
							value={phase}
							onChange={(e) => setPhase(e.target.value as DowntimePhase)}
						>
							<option>Hyperspace</option>
							<option>Camp</option>
							<option>Base</option>
						</select>
					</div>
				</div>
			</main>
			<aside className="space-y-3" aria-label="Side panel">
				<SaveLoadPanel />
				<SettingsPanel />
				<SafetyPanel />
				<AdminPanel />
			</aside>
		</div>
	);
}

function ResponseWindow() {
	const log = useSession((s) => s.log);
	return (
		<section className="card min-h-[200px]" aria-live="polite">
			<div className="whitespace-pre-wrap text-sm">{log || 'Ready.'}</div>
		</section>
	);
}

function PromptBox() {
	const { seed, phase, append } = useSession();
	const [input, setInput] = useState('');
	const actions = useMemo(() => getDefaultActions(phase), [phase]);

	async function submit() {
		const llm = new FallbackLLM();
		let text = '';
		for await (const chunk of llm.generateStream(`Phase=${phase}; ${input}; action=${actions[0]?.id}`, { seed })) {
			text += chunk.text;
		}
		append(`\n> ${input}\n${text}\n`);
		setInput('');
	}

	return (
		<div className="card">
			<label className="block text-sm font-medium mb-1">Action / Dialogue</label>
			<div className="flex gap-2">
				<input
					aria-label="Prompt input"
					className="input flex-1"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && submit()}
				/>
				<button className="btn" onClick={submit}>Send</button>
			</div>
			<div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
				Suggested: {actions.map((a) => a.label).join(', ')}
			</div>
		</div>
	);
}

function SaveLoadPanel() {
	return (
		<section className="card" aria-labelledby="save-heading">
			<div className="font-semibold mb-2" id="save-heading">Save/Load</div>
			<div className="flex gap-2">
				<button className="btn">Save</button>
				<button className="btn">Load</button>
				<button className="btn">Export</button>
				<button className="btn">Import</button>
			</div>
		</section>
	);
}

function SettingsPanel() {
	return (
		<section className="card" aria-labelledby="settings-heading">
			<div className="font-semibold mb-2" id="settings-heading">Settings</div>
			<div className="text-sm">High-contrast theme uses your OS preference.</div>
		</section>
	);
}

function SafetyPanel() {
	return (
		<section className="card" aria-labelledby="safety-heading">
			<div className="font-semibold mb-2" id="safety-heading">Safety</div>
			<div className="text-sm">Content warnings and redactions will appear here.</div>
		</section>
	);
}

function AdminPanel() {
	return (
		<section className="card" aria-labelledby="admin-heading">
			<div className="font-semibold mb-2" id="admin-heading">GM/Admin</div>
			<div className="flex flex-col gap-2">
				<input className="input" placeholder="Override reason" aria-label="Override reason" />
				<button className="btn">Apply Override (stub)</button>
			</div>
		</section>
	);
}