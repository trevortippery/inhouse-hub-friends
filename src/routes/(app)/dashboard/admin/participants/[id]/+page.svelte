<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getParticipantById, updateParticipant } from '../../../../../matches.remote';
	const participant = await getParticipantById(page.params.id!);
</script>

<div class="flex flex-col justify-center items-center mt-4">
	<h2 class="mb-8">Update Participant</h2>
	<form {...updateParticipant} class="w-full max-w-md">
		<div class="p-6 border border-neutral-700 rounded-lg">
			<input {...updateParticipant.fields.id.as('hidden', participant!.id)} />
			<div class="mb-4">
				<label>
					Game Name / IGN:
					<input
						{...updateParticipant.fields.gameName.as('text')}
						value={participant?.gameName}
						required
					/>
				</label>
			</div>

			<button type="submit">Update Participant</button>
		</div>
	</form>
	<a href={resolve('/dashboard/admin/')} class="btn">Go back</a>
</div>
