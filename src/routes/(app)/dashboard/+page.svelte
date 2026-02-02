<script lang="ts">
	import MatchCard from '$lib/components/MatchCard.svelte';
	import { getAllMatches } from '../../matches.remote';
</script>

<div class="flex flex-col items-center mt-4">
	<div class="w-full max-w-4xl px-4">
		<div class="flex justify-between items-center mb-6">
			<h2 style:view-transition-name="heading-inhouse-matches">Inhouse Matches</h2>
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
</div>
