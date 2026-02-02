<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { resolve } from '$app/paths';

	const screenshots = [
		'/src/lib/assets/images/dashboard-1.png',
		'/src/lib/assets/images/dashboard-2.png',
		'/src/lib/assets/images/dashboard-3.png',
		'/src/lib/assets/images/dashboard-4.png'
	];

	let current = 0;

	// stack: top → bottom (max 3)
	let stack: number[] = [0];

	onMount(() => {
		const interval = setInterval(() => {
			current = (current + 1) % screenshots.length;

			// push new card on top
			stack = [current, ...stack];

			// remove oldest
			if (stack.length > 3) {
				stack = stack.slice(0, 3);
			}
		}, 7000);

		return () => clearInterval(interval);
	});
</script>

<div class="flex flex-col lg:flex-row items-center justify-center p-8 gap-12 min-h-screen">
	<div class="text-center lg:text-left max-w-md">
		<h2 class="mb-4">Inhouse Match Tracker</h2>
		<p class="text-neutral-300 mb-6">
			Track our League of Legends inhouse matches. View schedules, results, and stats.
		</p>
		<a
			href={resolve('/auth/signup')}
			class="btn bg-neutral-100 text-neutral-900 hover:opacity-80 px-8 py-3 inline-block"
		>
			Create Account
		</a>
	</div>

	<div class="w-full max-w-2xl">
		<div class="relative w-full overflow-hidden" style="height: 500px;">
			{#each stack as imgIndex, i (imgIndex)}
				<div
					class="absolute w-full rounded-lg overflow-hidden"
					style="top: {i * 140}px; height: 120px;"
					in:fly={{ y: -200, duration: 800, easing: quintOut }}
					out:fade={{ duration: 500 }}
					animate:flip={{ duration: 700, easing: quintOut }}
				>
					<img
						src={screenshots[imgIndex]}
						alt="Dashboard preview {imgIndex + 1}"
						class="w-full h-full object-contain"
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
