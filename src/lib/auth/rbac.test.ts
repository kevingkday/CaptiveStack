import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canAccessPortal, canPerformReviewAction, isRouteAllowed } from './rbac';

describe('portal and review role checks', () => {
	it('requires a signed-in role for /portal and /review', () => {
		assert.equal(isRouteAllowed(null, '/portal'), false);
		assert.equal(isRouteAllowed(undefined, '/review'), false);
		assert.equal(canAccessPortal(null), false);
		assert.equal(canPerformReviewAction(undefined), false);
	});

	it('lets members into the portal and keeps them out of review', () => {
		assert.equal(canAccessPortal('AssociationMember'), true);
		assert.equal(canPerformReviewAction('AssociationMember'), false);
		assert.equal(isRouteAllowed('AssociationAdministrator', '/review'), false);
		assert.equal(isRouteAllowed('AssociationAdministrator', '/portal'), true);
	});

	it('lets advisers certify review and keeps them out of admin', () => {
		assert.equal(canPerformReviewAction('AdviserReviewer'), true);
		assert.equal(canAccessPortal('AdviserReviewer'), true);
		assert.equal(isRouteAllowed('AdviserReviewer', '/admin'), false);
	});

	it('lets platform admins into review', () => {
		assert.equal(canPerformReviewAction('Admin'), true);
		assert.equal(canPerformReviewAction('CaptiveStackAdministrator'), true);
	});
});
