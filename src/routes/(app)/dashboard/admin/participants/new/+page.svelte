<script lang="ts">
	import { resolve } from '$app/paths';
	import { createParticipant } from '../../../../../matches.remote';
</script>

<div class="flex flex-col justify-center items-center mt-4">
	<h2 class="mb-8">Add Participant</h2>
	<form {...createParticipant} class="w-full max-w-md">
		<div class="p-6 border border-neutral-700 rounded-lg">
			<div class="mb-4">
				<label>
					Game Name / IGN:
					<input
						{...createParticipant.fields.gameName.as('text')}
						placeholder="Enter game name"
						required
					/>
				</label>
			</div>

			<button type="submit">Add Participant</button>
		</div>
	</form>
	<a href={resolve('/dashboard/admin/')} class="btn">Go back</a>
</div>
