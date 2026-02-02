// This is just an endpoint that returns json of matches
import { db } from '$lib/server/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const matches = await db.query.match.findMany();
	return json(matches);
};
