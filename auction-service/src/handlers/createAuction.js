import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
	const { title } = event.body;
	const now = new Date();

	const auction = {
		id: uuid(),
		title,
		status: 'OPEN',
		createdAt: now.toISOString(),
		highestBid: {
			amount: 0
		}
	};

	try {
		await dynamodb
			.put({
				TableName: process.env.AUCTIONS_TABLE_NAME,
				Item: auction
			})
			.promise();

		return {
			statusCode: 201,
			body: JSON.stringify(auction)
		};
	} catch (err) {
		console.error(error);
		throw new createError.InternalServerError(error);
	}
}

export const handler = commonMiddleware(createAuction);
