<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { deleteMatch } from '../../routes/matches.remote';

	type Team = 'blue' | 'red';
	type Role = 'top' | 'jungle' | 'mid' | 'bot' | 'support';

	interface MatchParticipant {
		id: string;
		participant: {
			id: string;
			gameName: string;
			createdAt: Date;
		};
		team: Team;
		role: Role;
		champion: string | null;
	}

	interface Match {
		id: string;
		matchNumber: number;
		status: string;
		scheduledAt?: Date | null;
		startedAt?: Date | null;
		completedAt?: Date | null;
		winningTeam?: Team | 'none' | null;
		gameDuration?: number | null;
		notes?: string | null;
		participants?: MatchParticipant[];
	}

	let { match }: { match: Match } = $props();

	let showAdminActions = $derived(page.url.pathname.includes('/dashboard/admin'));
	let showDetails = $state(false);

	// Group participants by team and role
	let blueTeam = $derived(
		match.participants
			?.filter((p) => p.team === 'blue')
			.sort((a, b) => {
				const roleOrder = ['top', 'jungle', 'mid', 'bot', 'support'];
				return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
			}) || []
	);

	let redTeam = $derived(
		match.participants
			?.filter((p) => p.team === 'red')
			.sort((a, b) => {
				const roleOrder = ['top', 'jungle', 'mid', 'bot', 'support'];
				return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
			}) || []
	);

	function formatRole(role: string): string {
		return role.charAt(0).toUpperCase() + role.slice(1);
	}

	function getWinnerDisplay(): string {
		if (match.winningTeam === 'blue') return 'Blue Team Won';
		if (match.winningTeam === 'red') return 'Red Team Won';
		if (match.winningTeam === 'none') return 'No Winner';
		return 'TBD';
	}
</script>

<div class="match-card">
	<div class="match-header">
		<div class="flex items-center gap-3">
			<h2>
				Match · {match.scheduledAt
					? new Date(match.scheduledAt).toLocaleDateString()
					: 'Unscheduled'}
			</h2>
			<span class="status">{match.status}</span>
			{#if match.winningTeam && match.winningTeam !== 'none'}
				<span
					class="winner-badge"
					class:blue-winner={match.winningTeam === 'blue'}
					class:red-winner={match.winningTeam === 'red'}
				>
					{getWinnerDisplay()}
				</span>
			{/if}
		</div>
		{#if showAdminActions}
			<div class="flex gap-2">
				<a href={resolve(`/dashboard/admin/match/${match.id}`)} class="btn">Edit</a>
				<form
					{...deleteMatch}
					onsubmit={(e) => {
						if (!confirm(`Are you sure you want to delete match #${match.matchNumber}?`)) {
							e.preventDefault();
						}
					}}
				>
					<input {...deleteMatch.fields.id.as('hidden', match.id)} />
					<button type="submit" class="delete-btn">Delete</button>
				</form>
			</div>
		{/if}
	</div>

	<!-- Toggle Button -->
	<button class="toggle-details" onclick={() => (showDetails = !showDetails)}>
		<span>Match Details</span>
		<svg
			class="chevron"
			class:rotated={showDetails}
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	<!-- Collapsible Details Section -->
	{#if showDetails}
		<!-- Participants Section -->
		{#if match.participants && match.participants.length > 0}
			<div class="participants-section">
				<div class="teams-grid">
					<!-- Blue Team -->
					<div class="team blue-team" class:winning-team={match.winningTeam === 'blue'}>
						<h3 class="team-title">Blue Team</h3>
						<div class="players-list">
							{#each blueTeam as participant (participant.id)}
								<div class="player">
									<span class="role">{formatRole(participant.role)}</span>
									<span class="name">{participant.participant.gameName}</span>
									{#if participant.champion}
										<span class="champion">({participant.champion})</span>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<!-- Red Team -->
					<div class="team red-team" class:winning-team={match.winningTeam === 'red'}>
						<h3 class="team-title">Red Team</h3>
						<div class="players-list">
							{#each redTeam as participant (participant.id)}
								<div class="player">
									<span class="role">{formatRole(participant.role)}</span>
									<span class="name">{participant.participant.gameName}</span>
									{#if participant.champion}
										<span class="champion">({participant.champion})</span>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<div class="match-details">
			<div class="details-grid">
				<div class="detail-row">
					<span class="label">Scheduled:</span>
					<span>{match.scheduledAt?.toLocaleString() || 'Not scheduled'}</span>
				</div>
				<div class="detail-row">
					<span class="label">Started:</span>
					<span>{match.startedAt?.toLocaleString() || 'Not started'}</span>
				</div>
				<div class="detail-row">
					<span class="label">Completed:</span>
					<span>{match.completedAt?.toLocaleString() || 'Not completed'}</span>
				</div>
				<div class="detail-row">
					<span class="label">Duration:</span>
					<span>{match.gameDuration ? `${match.gameDuration} min` : 'N/A'}</span>
				</div>
			</div>
			{#if match.notes}
				<div class="detail-row notes-row">
					<span class="label">Notes:</span>
					<span>{match.notes}</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.match-card {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 1.5rem 1.5rem 0rem 1.5rem;
		transition: box-shadow 0.2s;
	}
	.match-card:hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}
	.match-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid #e5e7eb;
	}
	.match-header h2 {
		margin: 0;
	}
	.status {
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
	}

	/* Winner Badge */
	.winner-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 600;
	}
	.blue-winner {
		background: rgba(96, 165, 250, 0.2);
		color: #93c5fd;
		border: 1px solid rgba(96, 165, 250, 0.4);
	}
	.red-winner {
		background: rgba(248, 113, 113, 0.2);
		color: #fca5a5;
		border: 1px solid rgba(248, 113, 113, 0.4);
	}

	.participants-section {
		padding-bottom: 1rem;
		border-bottom: 1px solid #404040;
	}
	.teams-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}
	.team {
		padding: 1rem;
		border-radius: 6px;
	}
	.blue-team {
		background: rgba(96, 165, 250, 0.1);
		border: 1px solid rgba(96, 165, 250, 0.3);
	}
	.red-team {
		background: rgba(248, 113, 113, 0.1);
		border: 1px solid rgba(248, 113, 113, 0.3);
	}
	.blue-team.winning-team {
		background: rgba(96, 165, 250, 0.25);
		border: 2px solid rgba(96, 165, 250, 0.6);
	}
	.red-team.winning-team {
		background: rgba(248, 113, 113, 0.25);
		border: 2px solid rgba(248, 113, 113, 0.6);
	}
	.winning-team .team-title {
		font-weight: 700;
	}
	.blue-team.winning-team .team-title {
		color: #93c5fd;
	}
	.red-team.winning-team .team-title {
		color: #fca5a5;
	}
	.team-title {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}
	.blue-team .team-title {
		color: #60a5fa;
	}
	.red-team .team-title {
		color: #f87171;
	}
	.players-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.player {
		display: flex;
		gap: 0.5rem;
		font-size: 0.9rem;
		align-items: center;
	}
	.role {
		font-weight: 600;
		min-width: 60px;
		color: #a3a3a3;
		font-size: 0.8rem;
		text-transform: uppercase;
	}
	.name {
		font-weight: 500;
	}
	.champion {
		color: #737373;
		font-size: 0.85rem;
	}

	/* Toggle Button */
	.toggle-details {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		background: none;
		border: none;
		cursor: pointer;
		color: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		transition: color 0.2s;
	}
	.toggle-details:hover {
		color: #60a5fa;
	}
	.chevron {
		transition: transform 0.2s;
	}
	.chevron.rotated {
		transform: rotate(180deg);
	}

	.match-details {
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
		border-top: 1px solid #404040;
	}

	/* 2x2 Grid for main details */
	.details-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem 1.5rem;
	}

	.detail-row {
		display: flex;
		gap: 0.5rem;
	}
	.label {
		font-weight: 600;
		min-width: 120px;
	}

	/* Notes row - full width */
	.notes-row {
		margin-top: 0.5rem;
		padding-top: 0.75rem;
		border-top: 1px solid #404040;
	}

	.delete-btn {
		padding: 0.5rem 1rem;
		background: #dc2626;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font: var(--input);
		white-space: nowrap;
	}
	.delete-btn:hover {
		background: #b91c1c;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.teams-grid {
			grid-template-columns: 1fr;
		}
		.details-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
