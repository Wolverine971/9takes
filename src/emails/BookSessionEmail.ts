// src/emails/BookSessionEmail.ts
import { EmailHead } from './EmailHead';

const from = '9takes Team';
const currentYear = new Date().getFullYear();
export const welcomeEmail = (name: string) => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead('Welcome to 9takes - Your Enneagram Journey Begins')}
    <body style="background-color: #faf8f4; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Welcome to 9takes! Your Enneagram journey begins now.
      </div>

      <!-- Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <!-- Email container -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(180, 83, 9, 0.14);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(to right, #d97706, #b45309); padding: 20px;">
                  <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700;">9takes</h1>
                </td>
              </tr>

              <!-- Main content -->
              <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px; color: #1c1917; font-size: 24px; font-weight: 600;">Hello${name ? ', ' + name : ''}!</h2>

                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    Welcome to <strong>9takes</strong> - where your journey to deeper self-understanding begins!
                  </p>

                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    You've taken the first step toward transforming how you understand yourself and your relationships through the wisdom of the Enneagram. This ancient personality system reveals not just <em>how</em> we behave, but <em>why</em> we do what we do.
                  </p>

                  <p style="margin: 0 0 15px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    Here's what you can look forward to:
                  </p>

                  <!-- Benefits list -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 25px; background-color: #faf8f4; border-left: 4px solid #b45309; border-radius: 0 4px 4px 0;">
                    <tr>
                      <td style="padding: 15px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #44403c;">
                              <strong style="color: #b45309;">&#10003;</strong> <strong>Personalized Insights:</strong> Discover your core motivations and patterns
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #44403c;">
                              <strong style="color: #b45309;">&#10003;</strong> <strong>Growth Strategies:</strong> Custom approaches for your unique type
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #44403c;">
                              <strong style="color: #b45309;">&#10003;</strong> <strong>Relationship Wisdom:</strong> Transform how you connect with others
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0; font-size: 15px; line-height: 1.5; color: #44403c;">
                              <strong style="color: #b45309;">&#10003;</strong> <strong>Expert Guidance:</strong> Support from our Enneagram specialists
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    We're preparing your personalized coaching experience and will be in touch soon with details about scheduling your session.
                  </p>

                  <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    In the meantime, explore these resources to begin your Enneagram journey:
                  </p>

                  <!-- Resource cards -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td valign="top" width="48%" style="padding-right: 2%;">
                        <a href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type" style="text-decoration: none;">
                          <img src="https://9takes.com/blogs/greek-statue-finding-enneagram-type.webp" alt="Discover Your Type" width="100%" style="max-width: 260px; height: auto; display: block; border-radius: 10px; margin-bottom: 12px; filter: grayscale(75%) sepia(35%) contrast(105%);">
                          <h3 style="margin: 0 0 10px; color: #1c1917; font-size: 16px; font-weight: 600;">Discover Your Type</h3>
                        </a>
                      </td>
                      <td valign="top" width="48%" style="padding-left: 2%;">
                        <a href="https://9takes.com/enneagram-corner/relationship-communication-guide" style="text-decoration: none;">
                          <img src="https://9takes.com/blogs/greek-statues-arguing.webp" alt="Communication Tips" width="100%" style="max-width: 260px; height: auto; display: block; border-radius: 10px; margin-bottom: 12px; filter: grayscale(75%) sepia(35%) contrast(105%);">
                          <h3 style="margin: 0 0 10px; color: #1c1917; font-size: 16px; font-weight: 600;">Communication Tips</h3>
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Call to action -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#b45309" style="border-radius: 4px;">
                              <a href="https://9takes.com/enneagram-corner" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">
                                Explore Enneagram Resources
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    If you have any questions before your session, simply reply to this email and we'll be happy to help.
                  </p>

                  <p style="margin: 0 0 5px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    Looking forward to guiding you on your Enneagram journey,
                  </p>
                  <p style="margin: 0 0 0; font-size: 16px; line-height: 1.5; color: #44403c; font-weight: 600;">
                    ${from}
                  </p>

                  <!-- Social links -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-top: 20px; border-top: 1px solid #d6ccb8; margin-top: 20px;">
                        <p style="margin: 0 0 15px; font-size: 16px; color: #78716c;">Connect with us</p>
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 0 10px;">
                              <a href="https://twitter.com/9takesdotcom" target="_blank">
                                <img src="https://9takes.com/icons/twitter.png" alt="Twitter" width="40" style="display: block; border: 0;">
                              </a>
                            </td>
                            <td style="padding: 0 10px;">
                              <a href="https://www.instagram.com/9takesdotcom/" target="_blank">
                                <img src="https://9takes.com/icons/instagram.png" alt="Instagram" width="40" style="display: block; border: 0;">
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td bgcolor="#f5f0e8" style="padding: 20px 30px; border-top: 1px solid #d6ccb8;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="color: #78716c; font-size: 14px; line-height: 1.5; text-align: center;">
                        <p style="margin: 0;">&copy; ${currentYear} 9takes. All rights reserved.</p>
                        <p style="margin: 10px 0 0;">
                          Questions? Contact us at <a href="mailto:usersup@9takes.com" style="color: #b45309; text-decoration: none;">usersup@9takes.com</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
};
