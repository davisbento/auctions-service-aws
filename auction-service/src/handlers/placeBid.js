import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
	const { id } = event.pathParameters;
	const { amount } = event.body;

	const params = {
		TableName: process.env.AUCTIONS_TABLE_NAME,
		Key: { id },
		UpdateExpression: 'set highestBid.amount = :amount',
		ExpressionAttributeValues: {
			':amount': amount
		},
		ReturnValues: 'ALL_NEW'
	};

	let updatedAuction;

	try {
		const result = await dynamodb.update(params).promise();
		updatedAuction = result.Attributes;
	} catch (err) {
		throw createError.InternalServerError(err.message);
	}

	return {
		statusCode: 200,
		body: updatedAuction
	};
}

export const handler = commonMiddleware(placeBid);
