import { error, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { checkDemoTime } from '../../../utils/api';
import { encrypt } from '../../../utils/crypto';


/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
    const session = event.locals.session;


    if (!session?.user?.id) {
        throw redirect(302, '/questions');
    }
    const { demo_time } = await event.parent();
    const { data: user, error: findUserError } = await supabase
        .from(demo_time === true ? 'profiles_demo' : 'profiles')
        .select('id, admin, external_id')
        .eq('id', session?.user?.id)
        .single();

    if (findUserError) {
        console.log(findUserError);
        throw redirect(307, '/questions');
    }

    if (!user?.admin) {
        throw redirect(307, '/questions');
    }

    const { data: userSignups, error: userSignupsfError } = await supabase
        .from('signups')
        .select('*')

    if (userSignupsfError) {
        console.log(userSignupsfError)
        return
    } else {
        return {
            session,
            signups: userSignups
        }
    }

};

export const actions: Actions = {

    createCypher: async (event) => {
        try {
            const { request, locals } = event;
            const session = locals.session;
            if (!session?.user?.id) {
                throw error(400, 'unauthorized');
            }

            const demo_time = await checkDemoTime();

            const { data: user, error: findUserError } = await supabase
                .from(demo_time === true ? 'profiles_demo' : 'profiles')
                .select('id, admin, external_id')
                .eq('id', session?.user?.id)
                .single();

            if (findUserError) {
                console.log(findUserError);
                throw error(400, 'unauthorized');
            }

            if (!user?.admin) {
                throw error(400, 'unauthorized');
            }



            const body = Object.fromEntries(await request.formData());

            const email = body.email as string;
            console.log(email)

            const emailCypher = encrypt(email);
            console.log(emailCypher)


            const { data: userSignup, error: userSignupfError } = await supabase
                .from('signups')
                .update({ 'unsubscribe_id': emailCypher.encryptedData, 'unsubscribe_iv': emailCypher.iv })
                .eq('email', email)
                .single();


            if (userSignupfError) {
                console.log(userSignupfError)

            }
            if (userSignup) {
                console.log(userSignup)

            }
            return { success: true, emailCypher };


        } catch (e) {

            console.log(e)
        }

    },
    confirmUnsubscribe: async (event) => {
        try {
            const { request, locals } = event;
            const session = locals.session;

            if (!session?.user?.id) {
                throw error(400, 'unauthorized');
            }

            const demo_time = await checkDemoTime();

            const body = Object.fromEntries(await request.formData());

            const first_name = body.firstName as string;
            const last_name = body.lastName as string;
            const enneagram = body.enneagram as string;

            const email = body.email as string;

            const { error: updateUserError } = await supabase
                .from(demo_time === true ? 'profiles_demo' : 'profiles')
                .update({ first_name, last_name, enneagram })
                .eq('email', email);
            // insert(userData);
            if (!updateUserError) {
                return { success: true };
            } else {
                throw error(500, {
                    message: `Failed to update user ${JSON.stringify(updateUserError)}`
                });
            }
        } catch (e) {
            throw error(400, {
                message: `Failed to update user ${JSON.stringify(e)}`
            });
        }
    }
};
