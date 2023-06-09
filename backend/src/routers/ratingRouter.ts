import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import {
	createRating,
	getUserRating,
	getAverageRating
} from '../services/ratingService.js';
import { GammaUser } from '../models/gammaModels.js';

const ratingRouter = Router();

const rateSchema = z.object({
	game: z.string().min(1).max(250),
	rating: z.number().int().min(1).max(5)
});

/**
 * @api {post} /api/v1/rating/rate Rate a game
 * @apiName RateGame
 * @apiGroup Rating
 * @apiDescription Gives a specific game a rating
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "Game rated successfully"
 * }
 *
 * @apiUse ZodError
 *
 * @apiError (401) {object} Unauthorized Must be logged in to rate game
 * @apiErrorExample {json} 401 Unauthorized:
 * {
 * 	"message": "Must be logged in to rate game"
 * }
 */
ratingRouter.post(
	'/rate',
	validateRequestBody(rateSchema),
	async (req, res) => {
		if (!req.isAuthenticated()) {
			res.status(401).json({ message: 'Must be logged in to rate game' });
			return;
		}
		const user = req.user as GammaUser;
		createRating(req.body.game, user.cid, req.body.rating);
		res.status(200).json({ message: 'Game rated successfully' });
	}
);

const getRatingSchema = z.object({
	game: z.string().min(1).max(250)
});

/**
 * @api {get} /api/v1/rating/user/[gameId] Get Rating for User
 * @apiParam {String} gameId ID of the game
 * @apiName GetUserRating
 * @apiGroup Rating
 * @apiDescription Gets the rating for a game for current user
 *
 * @apiSuccess {Object} rating Rating of the game
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *   "rating": 1
 *  }
 *
 * @apiUse ZodError
 *
 * @apiError (401) {object} Unauthorized Must be logged in to get own rating
 * @apiErrorExample {json} 401 Unauthorized:
 * {
 * 	"message": "Must be logged in to get own rating"
 * }
 */
ratingRouter.get('/user/:gameId', async (req, res) => {
	if (!req.isAuthenticated()) {
		res.status(401).json({ message: 'Must be logged in to get own rating' });
		return;
	}
	const user = req.user as GammaUser;
	const rating = await getUserRating(req.params.gameId, user.cid);
	res.status(200).json({ rating: rating });
});

/**
 * @api {get} /api/v1/rating/game/[gameId] Get average Rating for Game
 * @apiParam {String} gameId ID of the game
 * @apiName GetAverageRating
 * @apiGroup Rating
 * @apiDescription Gets the average rating for a game
 *
 * @apiSuccess {Object} rating Rating of the game
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *   "rating": 0.85
 *  }
 *
 * @apiUse ZodError
 *
 */
ratingRouter.get('/game/:gameId', async (req, res) => {
	let rating = await getAverageRating(req.params.gameId);
	res.status(200).json({ rating: rating });
});

export default ratingRouter;
