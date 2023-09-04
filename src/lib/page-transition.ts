import { beforeNavigate } from '$app/navigation';

export const preparePageTransition = () => {
	beforeNavigate(async (navigation) => {
		if (!document.startViewTransition) {
			return;
		}

		return new Promise((oldStateCaptureResolve) => {
			document.startViewTransition(async () => {
				oldStateCaptureResolve();
				await navigation.complete;
			});
		});
	});
};
