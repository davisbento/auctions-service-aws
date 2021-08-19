import AWS from 'aws-sdk';

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
	try {
		const result = await dynamodb
			.scan({
				TableName: process.env.AUCTIONS_TABLE_NAME
			})
			.promise();

		return {
			statusCode: 200,
			body: JSON.stringify(result.Items)
		};
	} catch (err) {
		console.error(err);
		throw createError.InternalServerError(err);
	}
}

export const handler = middy(getAuctions).use(httpJsonBodyParser()).use(httpEventNormalizer()).use(httpErrorHandler());
