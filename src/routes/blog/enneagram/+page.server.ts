
import { redirect } from "@sveltejs/kit";
// import { PageServerLoad } from "./$types";

export const load = async () => {
    throw redirect(302, '/enneagram-corner');
};