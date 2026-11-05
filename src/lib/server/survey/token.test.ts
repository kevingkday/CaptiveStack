import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { seedData } from '../db/seed-data';
import {
	PREDICTABLE_SURVEY_TOKENS,
	canServeSurveyToken,
	createSurveyToken,
	isPredictableSurveyToken,
	redactSurveyToken,
	resolveSurveyAccess
} from './token';

describe('survey tokens', () => {
	it('flags the published Eagle1 intake token as predictable', () => {
		const token = 'tk_eagle1_intake_verified_2026';
		assert.ok(PREDICTABLE_SURVEY_TOKENS.includes(token));
		assert.equal(isPredictableSurveyToken(token), true);
		assert.equal(canServeSurveyToken(token, false), false);
		assert.equal(canServeSurveyToken(token, true), true);
		assert.equal(
			resolveSurveyAccess({ token, demoMode: false, hasExactRecord: true }),
			'deny'
		);
	});

	it('does not fall back to a different survey when the token misses', () => {
		const token = createSurveyToken();
		assert.equal(
			resolveSurveyAccess({ token, demoMode: false, hasExactRecord: false }),
			'deny'
		);
		assert.equal(
			resolveSurveyAccess({ token, demoMode: true, hasExactRecord: false }),
			'deny'
		);
		assert.equal(
			resolveSurveyAccess({ token, demoMode: false, hasExactRecord: true }),
			'allow'
		);
	});

	it('generates unguessable tokens for new intakes', () => {
		const first = createSurveyToken();
		const second = createSurveyToken();
		assert.equal(first.length, 64);
		assert.match(first, /^[0-9a-f]{64}$/);
		assert.notEqual(first, second);
		assert.equal(isPredictableSurveyToken(first), false);
		assert.equal(canServeSurveyToken(first, false), true);
	});

	it('keeps the seeded intake token classified as predictable', () => {
		for (const survey of seedData.memberSurveys) {
			assert.equal(isPredictableSurveyToken(survey.token), true);
			assert.equal(redactSurveyToken(survey, false).token, '');
			assert.equal(redactSurveyToken(survey, true).token, survey.token);
		}
	});
});
