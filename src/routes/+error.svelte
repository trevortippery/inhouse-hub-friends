<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

{#if page.status === 404}
	<div>
		<h1>404 - Page Not Found</h1>
		<p>Sorry, this page doesn't exist.</p>
		<a href={resolve('/')}>Go home</a>
	</div>
{:else}
	<div>
		<h1>Error {page.status}</h1>
		<p>{page.error?.message}</p>
	</div>
{/if}
