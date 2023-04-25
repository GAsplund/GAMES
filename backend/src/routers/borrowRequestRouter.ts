import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import { BorrowRequestState, createBorrowRequest, respondBorrowRequest, getActiveBorrowRequests } from '../services/borrowRequestService.js';
import sendApiValidationError from '../utils/sendApiValidationError.js';

const borrowRequestRouter = Router();

const borrowRequestSchema = z.object({
	gameId: z.string().min(1),
	user: z.string().min(1),
	borrowStart: z.string().datetime(),
	borrowEnd: z.string().datetime()
});

/**
 * @api {post} /api/v1/borrow/request Request to borrow a game
 * @apiName RequestBorrowGame
 * @apiGroup Requesting
 * @apiDescription Requests to borrow a game from the service
 *
 * @apiBody {String} gameId Id of the game
 * @apiBody {String} user User that borrows the game
 * @apiBody {String} borrowStart Date that the game starts being borrowed
 * @apiBody {String} borrowEnd Date that the game should be returned
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   message: 'Borrow was successfully requested'
 * }
 *
 * @apiUse ZodError
 */
borrowRequestRouter.post('/', validateRequestBody(borrowRequestSchema), async (req, res) => {
	const body = req.body;
	const status = await createBorrowRequest(
			body.gameId,
			body.user,
			new Date(body.borrowStart),
			new Date(body.borrowEnd)
		);
	if (status == BorrowRequestState.Overlapping) return sendApiValidationError(res,
		{
			path: 'gameId',
			message: 'The game is already borrowed during this period'
		},
		'Body');
	if (status == BorrowRequestState.NotValid) return sendApiValidationError(res,
		{
			path: 'gameId',
			message: 'The gameId given is not valid'
		},
		'Body');
	res.status(200).json({ message: 'Borrow was successfully requested' });
});

const borrowRequestResponseSchema = z.object({
	gameId: z.string().min(1),
	user: z.string().min(1),
    approved: z.boolean()
});

/**
 * @api {post} /api/v1/borrow/request/respond Respond to a borrow request
 * @apiName RespondBorrowRequest
 * @apiGroup Requesting
 * @apiDescription Accepts or rejects a borrow request
 *
 * @apiBody {String} gameId Id of the game to borrow
 * @apiBody {String} user User borrowing the game
 * @apiBody {Boolean} approved Whether the request is accepted or rejected
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   message: 'Request accepted successfully'
 * }
 *
 * @apiUse ZodError
 */
borrowRequestRouter.post(
	'/respond',
	validateRequestBody(borrowRequestResponseSchema),
	async (req, res) => {
		const body = req.body;
		const status = await respondBorrowRequest(body.gameId, body.user, body.approved);
		if (status == BorrowRequestState.NotValid) return sendApiValidationError(res,
			{
				path: 'gameId',
				message: 'The gameId given is not valid'
			},
			'Body');
        let requestResponse = `Request ${(body.approved ? 'accepted' : 'rejected')} successfully`;
		res.status(200).json({ message: requestResponse });
	}
);

/**
 * @api {post} /api/v1/borrow/request/list Get a list of borrow requests
 * @apiName ListBorrowRequests
 * @apiGroup Requesting
 * @apiDescription Gets a list of borrow requests for the user
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   message: 'Request successfully responded to'
 * }
 *
 * @apiUse ZodError
 */
borrowRequestRouter.get(
	'/list',
	async (_, res) => {
		const requests = await getActiveBorrowRequests();
		res.status(200).json(formatBorrowRequests(requests));
	}
);

const formatBorrowRequests = (requests: any[]) => {
	return requests.map((request) => {
		return {
			gameId: request.gameId,
			user: request.user,
			borrowStart: request.borrowStart,
			borrowEnd: request.borrowEnd,
			approved: request.approved
		};
	});
};

export default borrowRequestRouter;
