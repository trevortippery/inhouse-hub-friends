<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/inhouse-hub.png';
	import Header from '$lib/components/Header.svelte';
	import '../app.css';
	let { children } = $props();

	onNavigate((navigate) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigate.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
</svelte:head>

<Header />
<main>
	{@render children()}
</main>
