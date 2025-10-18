'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import('harperdb');

const saltRounds = 10;

export const listSongs = async (forUser) => {
	try {
		const songs = [];
		if (tables?.Songs) {
			for await (const song of tables.Songs.search()) {
				const {
					artist,
					title,
					favorite,
					duet,
					learn,
					retry,
					avoid,
					notes,
					id,
					tags,
					username,
					__createdtime__,
					__updatedtime__,
				} = song;
				const shouldRenderSongForUser = forUser ? (username === forUser || (forUser === 'matt' && !username)) : (!username || username === 'matt');

				if (artist && title && shouldRenderSongForUser) {
					songs.push({
						artist,
						title,
						favorite,
						duet,
						learn,
						retry,
						avoid,
						notes,
						id,
						tags,
						__createdtime__,
						__updatedtime__,
					});
				}
			}
		}
		return songs;
	} catch (error) {
		console.error('Error listing songs:', error);
		return [];
	}
}

export async function getSong(id) {
	try {
		if (typeof tables === 'undefined' || !tables.Songs) {
			return null;
		}
		return await tables.Songs.get(id);
	} catch (error) {
		console.error('Error getting song:', error);
		return null;
	}
}

export async function createSong(formData) {
	const usernameValue = formData.get('username');
	const pinValue = formData.get('pin');

	if (typeof usernameValue !== 'string' || !usernameValue.trim() || typeof pinValue !== 'string' || !pinValue.trim()) {
		throw new Error('Username and PIN are required');
	}

	const username = usernameValue.trim();
	const pin = pinValue.trim();

	const userRecord = await tables.SimpleUser.get(username);

	if (userRecord) {
		const hash = userRecord.pinHash;
		const pinMatches = await bcrypt.compare(pin, hash);
		if (!pinMatches) {
			return { statusCode: 403,  error: new Error(`You're not ${username}!`) };
		}
	} else {
		const pinHash = await bcrypt.hash(pin, saltRounds);
		await tables.SimpleUser.create({ username, pinHash });
	}


	// Extract form values
	const artistValue = formData.get('artist');
	const titleValue = formData.get('title');
	const notesValue = formData.get('notes');
	const favorite = formData.get('favorite') === 'on' || formData.get('favorite') === 'true';
	const duet = formData.get('duet') === 'on' || formData.get('duet') === 'true';
	const learn = formData.get('learn') === 'on' || formData.get('learn') === 'true';
	const retry = formData.get('retry') === 'on' || formData.get('retry') === 'true';
	const avoid = formData.get('avoid') === 'on' || formData.get('avoid') === 'true';

	// Validate required fields
	if (typeof artistValue !== 'string' || typeof titleValue !== 'string') {
		throw new Error('Artist and Title are required');
	}
	const artist = artistValue.trim();
	const title = titleValue.trim();
	const notes = typeof notesValue === 'string' ? notesValue : '';

	if (!artist || !title) {
		throw new Error('Artist and Title are required');
	}

	if (typeof tables === 'undefined' || !tables.Songs) {
		throw new Error('Database not available');
	}

	await tables.Songs.create({
		artist,
		title,
		notes,
		favorite,
		duet,
		learn,
		retry,
		avoid,
		username,
	});

	// Revalidate the page to show updated data
	revalidatePath('/');
	revalidatePath('/[username]');
}

export async function updateSong(formData) {
	const usernameValue = formData.get('username');
	const pinValue = formData.get('pin');

	if (typeof usernameValue !== 'string' || !usernameValue.trim() || typeof pinValue !== 'string' || !pinValue.trim()) {
		throw new Error('Username and PIN are required');
	}

	const username = usernameValue.trim();
	const pin = pinValue.trim();

	const userRecord = await tables.SimpleUser.get(username);
	if (!userRecord) {
		return { statusCode: 401, error: new Error(`User does not exist!`) };
	}

	const hash = userRecord.pinHash;
	const pinMatches = await bcrypt.compare(pin, hash)
	if (!pinMatches) {
		return { statusCode: 403, error: new Error(`You're not ${username}!`) };
	}
	// Extract form values
	const id = formData.get('id');
	const artistValue = formData.get('artist');
	const titleValue = formData.get('title');
	const notesValue = formData.get('notes');
	const favorite = formData.get('favorite') === 'on' || formData.get('favorite') === 'true';
	const duet = formData.get('duet') === 'on' || formData.get('duet') === 'true';
	const learn = formData.get('learn') === 'on' || formData.get('learn') === 'true';
	const retry = formData.get('retry') === 'on' || formData.get('retry') === 'true';
	const avoid = formData.get('avoid') === 'on' || formData.get('avoid') === 'true';

	// Validate required fields
	if (typeof id !== 'string' || id.length === 0) {
		throw new Error('Song ID is required for updates');
	}

	if (typeof artistValue !== 'string' || typeof titleValue !== 'string') {
		throw new Error('Artist and Title are required');
	}

	const artist = artistValue.trim();
	const title = titleValue.trim();
	const notes = typeof notesValue === 'string' ? notesValue : '';

	if (!artist || !title) {
		throw new Error('Artist and Title are required');
	}

	if (typeof tables === 'undefined' || !tables.Songs) {
		throw new Error('Database not available');
	}

	await tables.Songs.put({ id, artist, title, notes, favorite, duet, learn, retry, avoid, id, username });

	// Revalidate the page to show updated data
	revalidatePath('/');
	revalidatePath('/[username]');
}

export async function listDogs() {
	// Original database logic - uncomment when ready
	try {
		const dogs = [];
		if (tables?.Dog) {
			for await (const dog of tables.Dog.search()) {
				dogs.push({ id: dog.id, name: dog.name, breed: dog.breed, age: dog.age, color: dog.color });
			}
		}
		return dogs;
	} catch (error) {
		console.error('Error listing dogs:', error);
		return [];
	}
}

export async function getDog(id) {
	try {
		if (typeof tables === 'undefined' || !tables.Dog) {
			return null;
		}
		return await tables.Dog.get(id);
	} catch (error) {
		console.error('Error getting dog:', error);
		return null;
	}
}

export async function createDog(formData) {
	// Extract form values
	const name = formData.get('name');
	const breed = formData.get('breed');
	const age = parseInt(formData.get('age'));
	const color = formData.get('color');

	// Validate required fields
	if (!name || !breed || !age || !color) {
		throw new Error('All fields are required');
	}

	if (typeof tables === 'undefined' || !tables.Dog) {
		throw new Error('Database not available');
	}

	await tables.Dog.create({ name, breed, age, color });

	// Revalidate the dogs page to show updated data
	revalidatePath('/dogs');
}

export async function deleteDog(dogId) {
	console.log('Deleting dog with id:', dogId);

	if (typeof tables === 'undefined' || !tables.Dog) {
		throw new Error('Database not available');
	}

	await tables.Dog.delete(dogId);

	// Revalidate the dogs page to show updated data
	revalidatePath('/dogs');
}
