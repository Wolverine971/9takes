// src/emails/BookSessionEmail.ts
import { EmailHead } from './EmailHead';

const from = '9takes Team';
const currentYear = new Date().getFullYear();
export const welcomeEmail = (name: string) => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead('Welcome to 9takes - Your Enneagram Journey Begins')}
    <body style="background-color: #f9f9ff; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Welcome to 9takes! Your Enneagram journey begins now.
      </div>

      <!-- Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <!-- Email container -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(108, 92, 231, 0.1);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(to right, #7158e2, #6c5ce7); padding: 20px;">
                  <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700;">9takes</h1>
                </td>
              </tr>

              <!-- Main content -->
              <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px; color: #2a2d34; font-size: 24px; font-weight: 600;">Hello${name ? ', ' + name : ''}!</h2>

                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    Welcome to <strong>9takes</strong> - where your journey to deeper self-understanding begins!
                  </p>

                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    You've taken the first step toward transforming how you understand yourself and your relationships through the wisdom of the Enneagram. This ancient personality system reveals not just <em>how</em> we behave, but <em>why</em> we do what we do.
                  </p>

                  <p style="margin: 0 0 15px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    Here's what you can look forward to:
                  </p>

                  <!-- Benefits list -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 25px; background-color: #f9f9ff; border-left: 4px solid #6c5ce7; border-radius: 0 4px 4px 0;">
                    <tr>
                      <td style="padding: 15px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #4b5563;">
                              <strong style="color: #6c5ce7;">&#10003;</strong> <strong>Personalized Insights:</strong> Discover your core motivations and patterns
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #4b5563;">
                              <strong style="color: #6c5ce7;">&#10003;</strong> <strong>Growth Strategies:</strong> Custom approaches for your unique type
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0 0 12px; font-size: 15px; line-height: 1.5; color: #4b5563;">
                              <strong style="color: #6c5ce7;">&#10003;</strong> <strong>Relationship Wisdom:</strong> Transform how you connect with others
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0; font-size: 15px; line-height: 1.5; color: #4b5563;">
                              <strong style="color: #6c5ce7;">&#10003;</strong> <strong>Expert Guidance:</strong> Support from our Enneagram specialists
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    We're preparing your personalized coaching experience and will be in touch soon with details about scheduling your session.
                  </p>

                  <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    In the meantime, explore these resources to begin your Enneagram journey:
                  </p>

                  <!-- Resource cards -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td valign="top" width="48%" style="padding-right: 2%;">
                        <a href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type" style="text-decoration: none;">
                          <img src="https://9takes.com/blogs/greek-statues-discovering.webp" alt="Discover Your Type" width="100%" style="max-width: 260px; height: auto; display: block; border-radius: 8px; margin-bottom: 12px; filter: sepia(100%) hue-rotate(160deg);">
                          <h3 style="margin: 0 0 10px; color: #2a2d34; font-size: 16px; font-weight: 600;">Discover Your Type</h3>
                        </a>
                      </td>
                      <td valign="top" width="48%" style="padding-left: 2%;">
                        <a href="https://9takes.com/enneagram-corner/enneagram-communication-tips" style="text-decoration: none;">
                          <img src="https://9takes.com/blogs/greek-statues-arguing.webp" alt="Communication Tips" width="100%" style="max-width: 260px; height: auto; display: block; border-radius: 8px; margin-bottom: 12px; filter: sepia(100%) hue-rotate(160deg);">
                          <h3 style="margin: 0 0 10px; color: #2a2d34; font-size: 16px; font-weight: 600;">Communication Tips</h3>
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
                            <td align="center" bgcolor="#6c5ce7" style="border-radius: 4px;">
                              <a href="https://9takes.com/enneagram-corner" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">
                                Explore Enneagram Resources
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    If you have any questions before your session, simply reply to this email and we'll be happy to help.
                  </p>

                  <p style="margin: 0 0 5px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    Looking forward to guiding you on your Enneagram journey,
                  </p>
                  <p style="margin: 0 0 0; font-size: 16px; line-height: 1.5; color: #4b5563; font-weight: 600;">
                    ${from}
                  </p>

                  <!-- Social links -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-top: 20px; border-top: 1px solid #e4e6eb; margin-top: 20px;">
                        <p style="margin: 0 0 15px; font-size: 16px; color: #65676b;">Connect with us</p>
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
                <td bgcolor="#f0f2f5" style="padding: 20px 30px; border-top: 1px solid #e4e6eb;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="color: #65676b; font-size: 14px; line-height: 1.5; text-align: center;">
                        <p style="margin: 0;">&copy; ${currentYear} 9takes. All rights reserved.</p>
                        <p style="margin: 10px 0 0;">
                          Questions? Contact us at <a href="mailto:usersup@9takes.com" style="color: #6c5ce7; text-decoration: none;">usersup@9takes.com</a>
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
