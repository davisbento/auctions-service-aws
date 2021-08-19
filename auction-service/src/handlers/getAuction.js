import AWS from 'aws-sdk';

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
	const { id } = event.pathParameters;

	try {
		const result = await dynamodb
			.get({
				TableName: process.env.AUCTIONS_TABLE_NAME,
				Key: { id }
			})
			.promise();

		if (!result.Item) {
			throw createError.NotFound('Auction not found');
		}

		return {
			statusCode: 200,
			body: JSON.stringify(result.Item)
		};
	} catch (err) {
		console.error(err);
		throw createError.InternalServerError(err);
	}
}

export const handler = middy(getAuction).use(httpJsonBodyParser()).use(httpEventNormalizer()).use(httpErrorHandler());
