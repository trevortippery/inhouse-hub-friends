import { form, getRequestEvent, query } from '$app/server';
import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { match, matchParticipant, participant } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

// Get all matches with their participants
export const getAllMatches = query(async () =>
	db.query.match.findMany({
		with: {
			participants: {
				with: {
					participant: true // Include the actual participant data
				}
			}
		},
		orderBy: (match, { desc }) => [desc(match.scheduledAt)]
	})
);

// Get all participants for the dropdown
export const getAllParticipants = query(async () =>
	db.query.participant.findMany({
		orderBy: (participant, { asc }) => [asc(participant.gameName)]
	})
);

// Create a new participant
export const createParticipant = form(
	v.object({
		gameName: v.pipe(v.string(), v.minLength(1, 'Game name is required'))
	}),
	async (data) => {
		const event = getRequestEvent();
		const session = await auth.api.getSession({
			headers: event.request.headers
		});
		if (!session?.user?.id) {
			error(401, 'Unauthorized');
		}

		await db.insert(participant).values({
			gameName: data.gameName
		});

		return { success: true };
	}
);

// Update a participant
export const updateParticipant = form(
	v.object({
		id: v.pipe(v.string(), v.nonEmpty('Id is required')),
		gameName: v.pipe(v.string(), v.minLength(1, 'Game name is required'))
	}),
	async (data) => {
		const event = getRequestEvent();
		const session = await auth.api.getSession({
			headers: event.request.headers
		});
		if (!session?.user?.id) {
			error(401, 'Unauthorized');
		}

		await db
			.update(participant)
			.set({
				gameName: data.gameName
			})
			.where(eq(participant.id, data.id));

		redirect(303, '/dashboard/admin');
	}
);

// Delete a participant
export const deleteParticipant = form(
	v.object({
		id: v.pipe(v.string(), v.nonEmpty('Id is required'))
	}),
	async (data) => {
		const event = getRequestEvent();
		const session = await auth.api.getSession({
			headers: event.request.headers
		});
		if (!session?.user?.id) {
			error(401, 'Unauthorized');
		}

		await db.delete(participant).where(eq(participant.id, data.id));
		return { success: true };
	}
);

// Match participant assignment schema
const matchParticipantSchema = v.object({
	participantId: v.pipe(v.string(), v.nonEmpty('Participant is required')),
	champion: v.optional(v.string())
});

// Create match with participant assignments
export const createMatch = form(
	v.object({
		scheduledAt: v.optional(
			v.pipe(
				v.string(),
				v.transform((input) => (input ? new Date(input) : null))
			)
		),
		status: v.optional(v.picklist(['scheduled', 'in_progress', 'completed', 'cancelled'])),
		startedAt: v.optional(
			v.pipe(
				v.string(),
				v.transform((input) => (input ? new Date(input) : null))
			)
		),
		completedAt: v.optional(
			v.pipe(
				v.string(),
				v.transform((input) => (input ? new Date(input) : null))
			)
		),
		winningTeam: v.optional(v.picklist(['blue', 'red', 'none'])),
		gameDuration: v.optional(v.number()),
		notes: v.optional(v.string()),
		// Blue team participants (now just IDs)
		blueTop: matchParticipantSchema,
		blueJungle: matchParticipantSchema,
		blueMid: matchParticipantSchema,
		blueBot: matchParticipantSchema,
		blueSupport: matchParticipantSchema,
		// Red team participants
		redTop: matchParticipantSchema,
		redJungle: matchParticipantSchema,
		redMid: matchParticipantSchema,
		redBot: matchParticipantSchema,
		redSupport: matchParticipantSchema
	}),
	async (data) => {
		console.log('Form submitted with data', data);
		const event = getRequestEvent();
		const session = await auth.api.getSession({
			headers: event.request.headers
		});
		if (!session?.user?.id) {
			error(401, 'Unauthorized');
		}

		// Create the match first
		const [newMatch] = await db
			.insert(match)
			.values({
				scheduledAt: data.scheduledAt,
				status: data.status,
				startedAt: data.startedAt,
				completedAt: data.completedAt,
				winningTeam: data.winningTeam,
				gameDuration: data.gameDuration,
				notes: data.notes,
				createdByUsername: session.user.name
			})
			.returning();

		// Prepare participants array with participant IDs
		const participants = [
			// Blue team
			{ ...data.blueTop, team: 'blue' as const, role: 'top' as const },
			{ ...data.blueJungle, team: 'blue' as const, role: 'jungle' as const },
			{ ...data.blueMid, team: 'blue' as const, role: 'mid' as const },
			{ ...data.blueBot, team: 'blue' as const, role: 'bot' as const },
			{ ...data.blueSupport, team: 'blue' as const, role: 'support' as const },
			// Red team
			{ ...data.redTop, team: 'red' as const, role: 'top' as const },
			{ ...data.redJungle, team: 'red' as const, role: 'jungle' as const },
			{ ...data.redMid, team: 'red' as const, role: 'mid' as const },
			{ ...data.redBot, team: 'red' as const, role: 'bot' as const },
			{ ...data.redSupport, team: 'red' as const, role: 'support' as const }
		];

		// Insert all match participant assignments
		await db.insert(matchParticipant).values(
			participants.map((p) => ({
				matchId: newMatch.id,
				participantId: p.participantId,
				team: p.team,
				role: p.role,
				champion: p.champion || null
			}))
		);

		redirect(303, '/dashboard/admin');
	}
);

export const getMatchById = query(v.string(), async (id) =>
	db.query.match.findFirst({
		where: (m, { eq }) => eq(m.id, id),
		with: {
			participants: {
				with: {
					participant: true
				}
			}
		}
	})
);

export const getParticipantById = query(v.string(), async (id) =>
	db.query.participant.findFirst({
		where: (p, { eq }) => eq(p.id, id)
	})
);

export const updateMatch = form(
	v.object({
		id: v.pipe(v.string(), v.nonEmpty('Id is required')),
		scheduledAt: v.optional(
			v.pipe(
				v.string(),
				v.transform((input) => (input ? new Date(input) : null))
			)
		),
		status: v.optional(v.picklist(['scheduled', 'in_progress', 'completed', 'cancelled'])),
		startedAt: v.optional(
			v.pipe(
				v.string(),
				v.transform((input) => (input ? new Date(input) : null))
			)
		),
		completedAt: v.optional(
			v.pipe(
				v.string(),
				v.transform((input) => (input ? new Date(input) : null))
			)
		),
		winningTeam: v.optional(v.picklist(['blue', 'red', 'none'])),
		gameDuration: v.optional(v.number()),
		notes: v.optional(v.string())
	}),
	async (data) => {
		const event = getRequestEvent();
		const session = await auth.api.getSession({
			headers: event.request.headers
		});
		if (!session?.user?.id) {
			error(401, 'Unauthorized');
		}
		await db
			.update(match)
			.set({
				...data
			})
			.where(eq(match.id, data.id));
		redirect(303, '/dashboard/admin');
	}
);

export const deleteMatch = form(
	v.object({
		id: v.pipe(v.string(), v.nonEmpty('Id is required'))
	}),
	async (data) => {
		await db.delete(match).where(eq(match.id, data.id));
		redirect(303, '/dashboard/admin');
	}
);
