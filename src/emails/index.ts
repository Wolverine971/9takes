// src/emails/index.ts
import { EmailHead } from './EmailHead';

const from = '9takes Admins';

export const joinEmail = () => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead('Welcome to the 9takes Waitlist')}
    <body style="background-color: #faf8f4; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Welcome to 9takes! Thanks for joining our waitlist.
      </div>
      
      <!-- Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <!-- Email container -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(180, 83, 9, 0.12);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(to right, #d97706, #b45309); padding: 20px;">
                  <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700;">9takes</h1>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px; color: #1c1917; font-size: 24px; font-weight: 600;">Welcome to the 9takes Waitlist!</h2>
                  
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    Thank you for joining our waitlist. We're excited to have you on board and look forward to hearing from you once we launch.
                  </p>
                  
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    While you wait, feel free to explore our content and connect with us on social media to stay updated.
                  </p>
                  
                  <!-- Call to action -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#b45309" style="border-radius: 4px;">
                              <a href="https://9takes.com" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">
                                Visit Our Website
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Social links -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-bottom: 20px;">
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
                      <td style="color: #78716c; font-size: 14px; line-height: 1.5;">
                        <p style="margin: 0;">&copy; 9takes. All rights reserved.</p>
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

export const joinEmail2 = () => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead('Welcome to the 9takes Waitlist')}
    <body style="background-color: #faf8f4; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Welcome to 9takes! Thanks for joining our waitlist.
      </div>
      
      <!-- Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <!-- Email container -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(180, 83, 9, 0.12);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(to right, #d97706, #b45309); padding: 20px;">
                  <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700;">9takes</h1>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px; color: #1c1917; font-size: 24px; font-weight: 600;">Welcome to 9takes!</h2>
                  
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    Thank you for joining the 9takes waitlist! We're excited to have you on board and look forward to hearing from you.
                  </p>
                  
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    <strong>Feel free to reach out</strong> on
                    <a href="https://twitter.com/9takesdotcom" target="_blank" style="color: #b45309; text-decoration: none; font-weight: 500;">Twitter</a> 
                    or reply to this email at <a href="mailto:usersup@9takes.com" style="color: #b45309; text-decoration: none; font-weight: 500;">usersup@9takes.com</a>.
                  </p>
                  
                  <!-- Featured content -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td valign="top" width="48%" style="padding-right: 2%;">
                        <a href="https://9takes.com/enneagram-corner/enneagram-types-at-party" style="text-decoration: none;">
                          <img src="https://9takes.com/blogs/greek-statues-party-vibes.webp" alt="Enneagram types at a party" width="100%" style="max-width: 260px; height: auto; display: block; border-radius: 8px; margin-bottom: 12px; filter: sepia(100%) hue-rotate(160deg);">
                          <h3 style="margin: 0 0 10px; color: #1c1917; font-size: 16px; font-weight: 600;">Enneagram types at a party</h3>
                        </a>
                      </td>
                      <td valign="top" width="48%" style="padding-left: 2%;">
                        <a href="https://9takes.com/enneagram-corner/enneagram-communication-tips" style="text-decoration: none;">
                          <img src="https://9takes.com/blogs/greek-statues-arguing.webp" alt="Enneagram communication tips" width="100%" style="max-width: 260px; height: auto; display: block; border-radius: 8px; margin-bottom: 12px; filter: sepia(100%) hue-rotate(160deg);">
                          <h3 style="margin: 0 0 10px; color: #1c1917; font-size: 16px; font-weight: 600;">Enneagram communication tips</h3>
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Social links -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-top: 20px; border-top: 1px solid #d6ccb8;">
                        <p style="margin: 0 0 15px; font-size: 16px; color: #78716c;">Follow us</p>
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
                      <td style="color: #78716c; font-size: 14px; line-height: 1.5;">
                        <p style="margin: 0;">&copy; 9takes. All rights reserved.</p>
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

export const personSuggestionEmail = () => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead('Appreciate the suggestion')}
    <body style="background-color: #faf8f4; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Thanks for your suggestion! We'll notify you when we publish the analysis.
      </div>
      
      <!-- Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <!-- Email container -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(180, 83, 9, 0.12);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(to right, #d97706, #b45309); padding: 20px;">
                  <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700;">9takes</h1>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px; color: #1c1917; font-size: 24px; font-weight: 600;">Thanks for Your Suggestion!</h2>
                  
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    We've received your suggestion and will email you when we publish the analysis.
                  </p>
                  
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    In the meantime, explore our <a href="https://9takes.com/personality-analysis" target="_blank" style="color: #b45309; text-decoration: none; font-weight: 500;">other personality analyses</a> that might interest you.
                  </p>
                  
                  <!-- Call to action -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#b45309" style="border-radius: 4px;">
                              <a href="https://9takes.com/personality-analysis" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">
                                Explore Analyses
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    <strong>Feel free to reach out</strong> on
                    <a href="https://twitter.com/9takesdotcom" target="_blank" style="color: #b45309; text-decoration: none; font-weight: 500;">Twitter</a> 
                    or reply to this email at <a href="mailto:usersup@9takes.com" style="color: #b45309; text-decoration: none; font-weight: 500;">usersup@9takes.com</a>.
                  </p>
                  
                  <!-- Social links -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-top: 20px; border-top: 1px solid #d6ccb8;">
                        <p style="margin: 0 0 15px; font-size: 16px; color: #78716c;">Follow us</p>
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
                      <td style="color: #78716c; font-size: 14px; line-height: 1.5;">
                        <p style="margin: 0;">&copy; 9takes. All rights reserved.</p>
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

export const emailTemplate = (subject: string, header: string, body: string) => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead(subject)}
    <body style="background-color: #faf8f4; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        ${subject} - 9takes
      </div>
      
      <!-- Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <!-- Email container -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(180, 83, 9, 0.12);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(to right, #d97706, #b45309); padding: 20px;">
                  <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700;">9takes</h1>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px; color: #1c1917; font-size: 24px; font-weight: 600;">${header}</h2>
                  
                  <div style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    ${body}
                  </div>
                  
                  <p style="margin: 20px 0 30px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    <strong>Feel free to reach out</strong> on
                    <a href="https://twitter.com/9takesdotcom" target="_blank" style="color: #b45309; text-decoration: none; font-weight: 500;">Twitter</a> 
                    or reply to this email at <a href="mailto:usersup@9takes.com" style="color: #b45309; text-decoration: none; font-weight: 500;">usersup@9takes.com</a>.
                  </p>
                  
                  <!-- Social links -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-top: 20px; border-top: 1px solid #d6ccb8;">
                        <p style="margin: 0 0 15px; font-size: 16px; color: #78716c;">Follow us</p>
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
                      <td style="color: #78716c; font-size: 14px; line-height: 1.5;">
                        <p style="margin: 0;">&copy; 9takes. All rights reserved.</p>
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

export const signupEmail = () => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead('Confirm your email to join 9takes')}
    <body style="background-color: #faf8f4; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        One step away - please confirm your email to start using 9takes.
      </div>
      
      <!-- Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <!-- Email container -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(180, 83, 9, 0.12);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(to right, #d97706, #b45309); padding: 20px;">
                  <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700;">9takes</h1>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px; text-align: center;">
                  <h2 style="margin: 0 0 20px; color: #1c1917; font-size: 24px; font-weight: 600;">Confirm Your Email</h2>
                  
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    You're almost ready to start using 9takes. Please click the button below to verify your email address.
                  </p>
                  
                  <!-- Call to action -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#b45309" style="border-radius: 4px;">
                              <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 12px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">
                                Confirm Email
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #78716c;">
                    If you didn't sign up for 9takes, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td bgcolor="#f5f0e8" style="padding: 20px 30px; border-top: 1px solid #d6ccb8;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="color: #78716c; font-size: 14px; line-height: 1.5; text-align: center;">
                        <p style="margin: 0;">&copy; 9takes. All rights reserved.</p>
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

export const signupWelcomeEmail = () => {
	return `<h1>Start with one honest answer</h1>
<p>You are on the 9takes update list.</p>
<p>The useful part of 9takes is simple: answer a real question before you read everyone else's take, then compare what you saw with what they saw.</p>
<p>That gap is where the value is. It shows what you assumed, what other people noticed, and how differently people can read the same moment.</p>
<p><a class="button" href="https://9takes.com/questions">Browse current questions</a></p>
<p>If you are more interested in the psychology side, start with <a href="https://9takes.com/enneagram-corner">the Enneagram corner</a> or browse <a href="https://9takes.com/personality-analysis">personality analyses</a>.</p>
<p>DJocrates<br />9takes.com</p>`;
};
// <p><a href="{{ .ConfirmationURL }}" > <b style="" > Confirm your mail < /b></a > </p>
// Default link is the Supabase Auth template variable so calling forgotPass()
// with no args produces HTML ready to paste into Supabase Dashboard → Auth →
// Email Templates → Reset password. Admin preview/test callers pass a real URL.
export const forgotPass = (link: string = '{{ .ConfirmationURL }}') => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead('Reset Your Password')}
    <body style="background-color: #faf8f4; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Reset your 9takes password - secure link inside.
      </div>
      
      <!-- Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <!-- Email container -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(180, 83, 9, 0.12);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(to right, #d97706, #b45309); padding: 20px;">
                  <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700;">9takes</h1>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px; color: #1c1917; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                  
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #44403c;">
                    We received a request to reset your password. Click the button below to create a new password. If you didn't make this request, you can safely ignore this email.
                  </p>
                  
                  <!-- Call to action -->
                   <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#b45309" style="border-radius: 4px;">
                              <a href="${link}" target="_blank" style="display: inline-block; padding: 12px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: #78716c;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </p>
                  
                  <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.5; color: #78716c; word-break: break-all; background-color: #f5f0e8; padding: 10px; border-radius: 4px;">
                    ${link}
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td bgcolor="#f5f0e8" style="padding: 20px 30px; border-top: 1px solid #d6ccb8;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="color: #78716c; font-size: 14px; line-height: 1.5; text-align: center;">
                        <p style="margin: 0;">&copy; 9takes. All rights reserved.</p>
                        <p style="margin: 10px 0 0;">
                          For security, this link will expire in 24 hours.
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
