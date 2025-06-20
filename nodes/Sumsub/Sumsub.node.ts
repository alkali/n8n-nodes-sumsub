import {INodeType, INodeTypeDescription, NodeConnectionType} from 'n8n-workflow';

export class Sumsub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sumsub',
		name: 'Sumsub',
		icon: {light: 'file:sumsub.svg', dark: 'file:sumsub.svg'},
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get data from Sumsub',
		defaults: {
			name: 'Sumsub',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'sumsubApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.sumsub.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Applicant',
						value: 'applicant',
					},
				],
				default: 'applicant',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'applicant',
						],
					},
				},
				options: [
					{
						name: 'Create an Applicant',
						value: 'createapplicant',
						action: 'Create an applicant',
						displayOptions: {
							show: {
								resource: [
									'applicant',
								],
							},
						},
						routing: {
							request: {
								method: 'POST',
								url: '/resources/applicants',
							},
						},
					},
				],
				default: 'createapplicant',
			},

			{
				displayName: 'Level',
				required: true,
				name: 'level',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'applicant',
						],
					},
				},
				routing: {
					request: {
						// You've already set up the URL. qs appends the value of the field as a query string
						qs: {
							level: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Body',
				required: true,
				name: 'body',
				type: 'json',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'applicant',
						],
					},
				},
				routing: {
					request: {
						body: '={{ $value }}',
					},
				},
			},
		],
	};
}
