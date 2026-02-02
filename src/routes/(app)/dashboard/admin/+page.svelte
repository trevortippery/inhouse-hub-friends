<script lang="ts">
	import { resolve } from '$app/paths';
	import MatchCard from '$lib/components/MatchCard.svelte';
	import { getAllMatches, getAllParticipants } from '../../../matches.remote';
</script>

<div class="w-full flex flex-row gap-2 mt-4 justify-center">
	<section class="w-full max-w-4xl">
		<div class="px-4">
			<div class="flex justify-between mb-6">
				<h2 style:view-transition-name="heading-inhouse-matches">Inhouse Matches</h2>
				<a href={resolve('/dashboard/admin/match/new')} class="btn">Create New Match</a>
			</div>
			<div style:view-transition-name="match-cards" class="flex flex-col gap-4">
				{#await getAllMatches()}
					<p>Loading matches...</p>
				{:then matches}
					{#each matches as match (match.id)}
						<MatchCard {match} />
					{/each}
				{:catch error}
					<p>Error loading matches: {error.message}</p>
				{/await}
			</div>
		</div>
	</section>
	<section class="w-96">
		<div class="px-4">
			<div class="flex gap-4 items-center mb-6">
				<h2>Participant List</h2>
				<a href={resolve('/dashboard/admin/participants/new')} class="btn">Add Participant</a>
			</div>
			<div>
				{#await getAllParticipants()}
					<p>Loading participants...</p>
				{:then participants}
					<ul class="border rounded p-8 list-disc">
						{#each participants as participant (participant.id)}
							<a href={resolve(`/dashboard/admin/participants/${participant.id}`)}>
								<li>{participant.gameName}</li>
							</a>
						{/each}
					</ul>
				{:catch error}
					<p>Error loading participants: {error.message}</p>
				{/await}
			</div>
		</div>
	</section>
</div>

<style>
</style>
