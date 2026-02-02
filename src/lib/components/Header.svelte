<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import { get_user } from '../../user.remote';

	const user = $derived(await get_user());

	function signout() {
		authClient.signOut({
			fetchOptions: {
				onSuccess: async () => {
					await get_user().refresh();
					goto(resolve('/auth/signin'));
				}
			}
		});
	}
</script>

<header>
	<nav>
		<ul class="flex list-none justify-between items-center mx-12">
			<li>
				{#if user.id}
					<h1>
						<a href={resolve('/dashboard')}>Dashboard</a>
					</h1>
				{:else}
					<h1>
						<a href={resolve('/')}>inhouse hub</a>
					</h1>
				{/if}
			</li>
			<li class="flex gap-4 items-center">
				<div>
					{#if user.id}
						{#if user.role === 'admin'}
							<a href={resolve('/dashboard/admin')} class="btn">Admin dashboard</a>
						{/if}
						<button onclick={signout}>Sign out</button>
					{:else}
						<a href={resolve('/auth/signup')} class="btn mr-1">Sign up</a>
						<a href={resolve('/auth/signin')} class="btn">Sign in</a>
					{/if}
				</div>
			</li>
		</ul>
	</nav>
</header>
