<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import { get_user } from '../../../../user.remote';

	let error = $state('');

	async function signin(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const email = form.email.value;
		const password = form.password.value;

		if (!email || !password) {
			error = 'All fields are required';
			return;
		}

		error = '';

		await authClient.signIn.email(
			{
				email,
				password
			},
			{
				onSuccess: async () => {
					get_user().refresh();
					goto(resolve('/dashboard'));
				},
				onError: (ctx) => {
					error = ctx.error.message || 'An error occured during sign in';
				}
			}
		);
	}
</script>

<div class="flex flex-col justify-center items-center mt-4">
	<h2>Sign in</h2>

	<form onsubmit={signin} class="w-96">
		{#if error}
			<p class="flex justify-center items-center w-auto h-10 bg-red-400 border border-red-500 mt-4">
				{error}
			</p>
		{/if}
		<div class="formRow">
			<label>
				Email:
				<input type="email" id="email" />
			</label>
		</div>
		<div class="formRow">
			<label>
				Password:
				<input type="password" id="password" />
			</label>
		</div>

		<button type="submit" class="w-full mt-8">Sign In</button>
	</form>

	<p>
		Don't have an account? <a href={resolve('/auth/signup')}>Sign Up</a>
	</p>
</div>

<style>
</style>
