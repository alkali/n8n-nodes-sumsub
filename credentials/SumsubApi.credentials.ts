import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType, IHttpRequestOptions,
	INodeProperties
} from 'n8n-workflow';

import {createHmac} from 'crypto';
import {OptionsWithUri} from "request-promise-native";

export class SumsubApi implements ICredentialType {
	name = 'sumsubApi';
	displayName = 'Sumsub API';
	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'App Token',
			name: 'app_token',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Secret',
			name: 'secret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions | OptionsWithUri,
	): Promise<IHttpRequestOptions> {
		let requestURL: URL;
		const timestamp = Math.floor(Date.now() / 1000);
		const appToken = credentials.app_token as string;
		const appSecret = credentials.secret as string;
		const method = requestOptions?.method as string;
		const contentType = requestOptions?.headers
			? requestOptions?.headers['Content-Type']
			: undefined;

		let body = requestOptions?.body;
		if (body === undefined || Object.keys(body).length === 0) {
			body = '';
		} else if (body) {
			if (!contentType) {
				body = JSON.stringify(body);
			} else {
				body = decodeURIComponent(body);
			}
		}

		// @ts-ignore
		if (requestOptions["uri"] && !requestOptions.url) {
			// @ts-ignore
			requestURL = new URL(requestOptions['uri']);
		} else {
			// @ts-ignore
			requestURL = new URL(requestOptions.url);
		}
		const pathWithQuery = requestURL.pathname + requestURL.search;
		const signString = timestamp + method + pathWithQuery + (method === 'GET' ? '' : body);
		const sign = createHmac('sha256', appSecret).update(signString).digest('hex');
		requestOptions.headers = {
			...requestOptions.headers,
			'X-App-Token': appToken,
			'X-App-Access-Sig': sign,
			'X-App-Access-Ts': timestamp,
		};
		requestOptions.headers['Accept'] = 'application/json';
		return requestOptions as IHttpRequestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			url: 'https://api.sumsub.com/resources/status/api',
			method: 'GET',
		},
	};
}
