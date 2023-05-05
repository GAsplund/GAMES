import { prisma } from '../prisma.js';

export const createGame = async (
	name: string,
	description: string,
	platform: string,
	releaseDate: Date,
	playtimeMinutes: number,
	playerMin: number,
	playerMax: number,
	gameOwnerId: string
) => {
	await prisma.game.create({
		data: {
			name,
			description,
			platform: {
				connect: {
					name: platform
				}
			},
			dateReleased: releaseDate,
			playtimeMinutes,
			playerMin,
			playerMax,
			GameOwner: {
				connect: {
					id: gameOwnerId
				}
			}
		}
	});
};

export const getAllGames = async () => {
	return await prisma.game.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			platformName: true,
			dateReleased: true,
			playtimeMinutes: true,
			borrow: true, // TODO: See what is given
			playerMin: true,
			playerMax: true,
			gameOwnerId: true,
			rating: true
		}
	});
};

export const searchGames = async (term: string) => {
	return await prisma.game.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			platformName: true,
			dateReleased: true,
			playtimeMinutes: true,
			playerMin: true,
			playerMax: true,
			borrow: true,
			gameOwnerId: true
		},
		where: {
			name: {
				contains: term,
				mode: 'insensitive'
			}
		}
	});
};

export type Filter = {
	name?: {
		contains: string;
		mode: 'insensitive';
	};
	dateReleased?: {
		lte?: Date;
		gte?: Date;
	};
	playerMax?: {
		gte: number;
	};
	playerMin?: {
		lte: number;
	};
	platform?: {
		name: string;
	};
	playtimeMinutes?: number;
	gameOwnerId?: string;
};
export const filterGames = async (filter: Filter) => {
	return await prisma.game.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			platformName: true,
			dateReleased: true,
			playtimeMinutes: true,
			playerMin: true,
			playerMax: true,
			borrow: true,
			gameOwnerId: true,
			rating: true
		},
		where: filter
	});
};

export const removeGame = async (gameID: string) => {
	const game = await prisma.game.findUnique({
		where: {
			id: gameID
		},
		select: {
			borrow: true
		}
	});
	if (!game) throw new Error('Game not found');
	const borrows = game.borrow.filter(
		(borrow) => !borrow.returned && borrow.borrowStart < new Date()
	);
	if (borrows.length > 0) throw new Error('Game is currently borrowed');

	return await prisma.game.delete({
		where: {
			id: gameID
		}
	});
};
