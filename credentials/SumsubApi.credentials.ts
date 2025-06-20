import {createHmac} from 'crypto';
import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties, IRequestOptions,
} from 'n8n-workflow';

export class SumsubApi implements ICredentialType {
	name = 'sumsubApi';
	displayName = 'Sumsub API';
	documentationUrl = 'https://docs.sumsub.com/reference/about-sumsub-api';

	properties: INodeProperties[] = [
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
			typeOptions: {password: true},
			default: '',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			url: 'https://api.sumsub.com/resources/status/api',
			method: 'GET',
		},
	};

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		const timestamp = Math.floor(Date.now() / 1000);
		const appToken = credentials.app_token as string;
		const appSecret = credentials.secret as string;
		const method = requestOptions?.method as string;
		const contentType = requestOptions.headers
			? requestOptions?.headers['Content-Type']
			: undefined;
		let body = requestOptions.body;
		if (body === undefined || body === null || Object.keys(body).length === 0) {
			body = '';
		} else if (body) {
			if (!contentType) {
				body = JSON.stringify(body);
			} else {
				body = decodeURIComponent(body.toString());
			}
		}

		const requestURL = new URL(
			(requestOptions as IRequestOptions).uri ?? requestOptions.baseURL + requestOptions.url,
		);
		const pathWithQuery = requestURL.pathname + requestURL.search;
		const signString = timestamp + method + pathWithQuery + (method === 'GET' ? '' : body);
		const sign = createHmac('sha256', appSecret).update(signString).digest('hex');
		requestOptions.headers = {
			...requestOptions.headers,
			'X-App-Token': appToken,
			'X-App-Access-Sig': sign,
			'X-App-Access-Ts': timestamp,
			'Accept': 'application/json',
		};
		return requestOptions;
	};
}
