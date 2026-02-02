<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import { get_user } from '../../../../user.remote';

	let error = $state('');

	async function signup(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const username = form.username.value;
		const email = form.email.value;
		const password = form.password.value;
		const confirmPassword = form.confirmPassword.value;

		if (password !== confirmPassword) {
			error = "Passwords don't match";
			return;
		}

		if (!username || !email || !password || !confirmPassword) {
			error = 'All fields are required';
			return;
		}

		error = '';

		await authClient.signUp.email(
			{
				email,
				password,
				name: username
			},
			{
				onSuccess: async () => {
					get_user().refresh();
					goto(resolve('/dashboard'));
				}
			}
		);
	}
</script>

<div class="flex flex-col justify-center items-center mt-4">
	<h2>Sign Up</h2>
	<form onsubmit={signup} class="w-96">
		{#if error}
			<p class="flex justify-center items-center w-auto h-10 bg-red-400 border border-red-500 mt-4">
				{error}
			</p>
		{/if}
		<div class="formRow">
			<label>
				Username:
				<input type="text" id="username" />
			</label>
		</div>
		<div class="formRow">
			<label>
				Email:
				<input type="email" id="email" />
			</label>
		</div>
		<div class="formRow">
			<label>
				Password:
				<input required type="password" id="password" />
			</label>
		</div>
		<div class="formRow">
			<label>
				Confirm Password:
				<input required type="password" id="confirmPassword" />
			</label>
		</div>
		<button type="submit" class="w-full mt-8">Sign Up</button>
	</form>

	<p>
		Already have an account? <a href={resolve('/auth/signin')}>Sign in</a>
	</p>
</div>
