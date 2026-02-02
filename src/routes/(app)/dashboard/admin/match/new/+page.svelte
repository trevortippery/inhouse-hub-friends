<script lang="ts">
	import { resolve } from '$app/paths';
	import { createMatch, getAllParticipants } from '../../../../../matches.remote';

	const participants = getAllParticipants();

	const roles = [
		{ key: 'Top', label: 'Top' },
		{ key: 'Jungle', label: 'Jungle' },
		{ key: 'Mid', label: 'Mid' },
		{ key: 'Bot', label: 'Bot' },
		{ key: 'Support', label: 'Support' }
	] as const;
</script>

<div class="flex flex-col justify-center items-center mt-4">
	<h2 class="mb-8">Create match</h2>
	<form {...createMatch} class="w-full max-w-6xl">
		<!-- Match Details -->
		<div class="mb-8 p-6 border border-neutral-700 rounded-lg">
			<h3 class="mb-4">Match Details</h3>

			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label>
						Scheduled At:
						<input {...createMatch.fields.scheduledAt.as('datetime-local')} />
					</label>
				</div>
				<div>
					<label>
						Status:
						<select {...createMatch.fields.status.as('select')}>
							<option value="" disabled selected>-- Select Status --</option>
							<option value="scheduled">Scheduled</option>
							<option value="in_progress">In Progress</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</label>
				</div>
				<div>
					<label>
						Started At:
						<input {...createMatch.fields.startedAt.as('datetime-local')} />
					</label>
				</div>
				<div>
					<label>
						Completed At:
						<input {...createMatch.fields.completedAt.as('datetime-local')} />
					</label>
				</div>
				<div>
					<label>
						Winning Team:
						<select {...createMatch.fields.winningTeam.as('select')}>
							<option value="" disabled selected>-- Select Winning Team --</option>
							<option value="none">None</option>
							<option value="blue">Blue</option>
							<option value="red">Red</option>
						</select>
					</label>
				</div>
				<div>
					<label>
						Game Duration (minutes):
						<input {...createMatch.fields.gameDuration.as('number')} />
					</label>
				</div>
				<div class="md:col-span-2">
					<label>
						Notes:
						<textarea {...createMatch.fields.notes.as('text')}></textarea>
					</label>
				</div>
			</div>
		</div>

		<!-- Participants -->
		<div class="mb-8">
			<h3 class="mb-4">Participants</h3>

			<div class="grid md:grid-cols-2 gap-6">
				<!-- Blue Team -->
				<div class="p-6 border border-blue-700 rounded-lg">
					<h4 class="mb-4 text-blue-400">Blue Team</h4>

					{#each roles as role (role.key)}
						{@const fieldName = `blue${role.key}` as
							| 'blueTop'
							| 'blueJungle'
							| 'blueMid'
							| 'blueBot'
							| 'blueSupport'}
						<div class="mb-4 p-4 bg-neutral-800 rounded">
							<p class="font-semibold mb-2 text-sm text-neutral-300">{role.label}</p>
							<div class="grid gap-2">
								<select {...createMatch.fields[fieldName].participantId.as('select')} required>
									<option value="" disabled selected>-- Select Player --</option>
									{#await participants then participantList}
										{#each participantList as participant (participant.id)}
											<option value={participant.id}>
												{participant.gameName}
											</option>
										{/each}
									{/await}
								</select>
								<input
									{...createMatch.fields[fieldName].champion.as('text')}
									placeholder="Champion (optional)"
								/>
							</div>
						</div>
					{/each}
				</div>

				<!-- Red Team -->
				<div class="p-6 border border-red-700 rounded-lg">
					<h4 class="mb-4 text-red-400">Red Team</h4>

					{#each roles as role (role.key)}
						{@const fieldName = `red${role.key}` as
							| 'redTop'
							| 'redJungle'
							| 'redMid'
							| 'redBot'
							| 'redSupport'}
						<div class="mb-4 p-4 bg-neutral-800 rounded">
							<p class="font-semibold mb-2 text-sm text-neutral-300">{role.label}</p>
							<div class="grid gap-2">
								<select {...createMatch.fields[fieldName].participantId.as('select')} required>
									<option value="" disabled selected>-- Select Player --</option>
									{#await participants then participantList}
										{#each participantList as participant (participant.id)}
											<option value={participant.id}>
												{participant.gameName}
											</option>
										{/each}
									{/await}
								</select>
								<input
									{...createMatch.fields[fieldName].champion.as('text')}
									placeholder="Champion (optional)"
								/>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<button type="submit">Create Match</button>
	</form>
	<a href={resolve('/dashboard/admin')}>Go back</a>
</div>
