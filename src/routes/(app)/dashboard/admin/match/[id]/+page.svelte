<script lang="ts">
	import { page } from '$app/state';
	import { getMatchById, updateMatch } from '../../../../../matches.remote';

	const match = await getMatchById(page.params.id!);

	const roles = [
		{ key: 'Top', label: 'Top' },
		{ key: 'Jungle', label: 'Jungle' },
		{ key: 'Mid', label: 'Mid' },
		{ key: 'Bot', label: 'Bot' },
		{ key: 'Support', label: 'Support' }
	] as const;

	function formatDateTimeLocal(date: Date | null | undefined) {
		if (!date) return '';
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		const hours = String(d.getHours()).padStart(2, '0');
		const minutes = String(d.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	// Helper to get participant for a specific team/role
	function getParticipantForRole(team: 'blue' | 'red', role: string) {
		return match?.participants?.find((p) => p.team === team && p.role === role.toLowerCase());
	}
</script>

<div class="flex flex-col justify-center items-center mt-4">
	<h2 class="mb-8">Edit Match</h2>
	<form {...updateMatch} class="w-full max-w-6xl">
		<input {...updateMatch.fields.id.as('hidden', match!.id)} />

		<!-- Match Details -->
		<div class="mb-8 p-6 border border-neutral-700 rounded-lg">
			<h3 class="mb-4">Match Details</h3>

			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label>
						Scheduled At:
						<input
							{...updateMatch.fields.scheduledAt.as('datetime-local')}
							value={formatDateTimeLocal(match?.scheduledAt)}
						/>
					</label>
				</div>
				<div>
					<label>
						Status:
						<select {...updateMatch.fields.status.as('select')}>
							<option value="scheduled" selected={match?.status === 'scheduled'}>Scheduled</option>
							<option value="in_progress" selected={match?.status === 'in_progress'}
								>In Progress</option
							>
							<option value="completed" selected={match?.status === 'completed'}>Completed</option>
							<option value="cancelled" selected={match?.status === 'cancelled'}>Cancelled</option>
						</select>
					</label>
				</div>
				<div>
					<label>
						Started At:
						<input
							{...updateMatch.fields.startedAt.as('datetime-local')}
							value={formatDateTimeLocal(match?.startedAt)}
						/>
					</label>
				</div>
				<div>
					<label>
						Completed At:
						<input
							{...updateMatch.fields.completedAt.as('datetime-local')}
							value={formatDateTimeLocal(match?.completedAt)}
						/>
					</label>
				</div>
				<div>
					<label>
						Winning Team:
						<select {...updateMatch.fields.winningTeam.as('select')}>
							<option value="none" selected={match?.winningTeam === 'none'}>None</option>
							<option value="blue" selected={match?.winningTeam === 'blue'}>Blue</option>
							<option value="red" selected={match?.winningTeam === 'red'}>Red</option>
						</select>
					</label>
				</div>
				<div>
					<label>
						Game Duration (minutes):
						<input {...updateMatch.fields.gameDuration.as('number')} value={match?.gameDuration} />
					</label>
				</div>
				<div class="md:col-span-2">
					<label>
						Notes:
						<textarea {...updateMatch.fields.notes.as('text')} value={match?.notes || ''}
						></textarea>
					</label>
				</div>
			</div>
		</div>

		<!-- Participants Display (Read-only for now) -->
		{#if match?.participants && match.participants.length > 0}
			<div class="mb-8">
				<h3 class="mb-4">Current Participants</h3>

				<div class="grid md:grid-cols-2 gap-6">
					<!-- Blue Team -->
					<div class="p-6 border border-blue-700 rounded-lg">
						<h4 class="mb-4 text-blue-400">Blue Team</h4>

						{#each roles as role (role.key)}
							{@const participant = getParticipantForRole('blue', role.key)}
							<div class="mb-4 p-4 bg-neutral-800 rounded">
								<p class="font-semibold mb-2 text-sm text-neutral-300">{role.label}</p>
								<div class="text-sm">
									<p class="text-neutral-100">
										{participant?.participant.gameName || 'Not assigned'}
									</p>
									{#if participant?.champion}
										<p class="text-neutral-400">Champion: {participant.champion}</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>

					<!-- Red Team -->
					<div class="p-6 border border-red-700 rounded-lg">
						<h4 class="mb-4 text-red-400">Red Team</h4>

						{#each roles as role (role.key)}
							{@const participant = getParticipantForRole('red', role.key)}
							<div class="mb-4 p-4 bg-neutral-800 rounded">
								<p class="font-semibold mb-2 text-sm text-neutral-300">{role.label}</p>
								<div class="text-sm">
									<p class="text-neutral-100">
										{participant?.participant.gameName || 'Not assigned'}
									</p>
									{#if participant?.champion}
										<p class="text-neutral-400">Champion: {participant.champion}</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>

				<p class="mt-4 text-sm text-neutral-400">
					Note: Participant assignments cannot be edited after match creation. To change
					participants, please delete this match and create a new one.
				</p>
			</div>
		{/if}

		<button type="submit">Update Match</button>
	</form>
</div>
