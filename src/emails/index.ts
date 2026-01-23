// src/emails/index.ts
import { EmailHead } from './EmailHead';

const from = '9takes Admins';
const currentYear = new Date().getFullYear();

export const joinEmail = () => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead('Welcome to the 9takes Waitlist')}
    <body style="background-color: #f9f9ff; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Welcome to 9takes! Thanks for joining our waitlist.
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
                  <h2 style="margin: 0 0 20px; color: #2a2d34; font-size: 24px; font-weight: 600;">Welcome to the 9takes Waitlist!</h2>
                  
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    Thank you for joining our waitlist. We're excited to have you on board and look forward to hearing from you once we launch.
                  </p>
                  
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    While you wait, feel free to explore our content and connect with us on social media to stay updated.
                  </p>
                  
                  <!-- Call to action -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#6c5ce7" style="border-radius: 4px;">
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
                      <td style="color: #65676b; font-size: 14px; line-height: 1.5;">
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

export const joinEmail2 = () => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead('Welcome to the 9takes Waitlist')}
    <body style="background-color: #f9f9ff; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Welcome to 9takes! Thanks for joining our waitlist.
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
                  <h2 style="margin: 0 0 20px; color: #2a2d34; font-size: 24px; font-weight: 600;">Welcome to 9takes!</h2>
                  
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    Thank you for joining the 9takes waitlist! We're excited to have you on board and look forward to hearing from you.
                  </p>
                  
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    <strong>Feel free to reach out</strong> on
                    <a href="https://twitter.com/9takesdotcom" target="_blank" style="color: #6c5ce7; text-decoration: none; font-weight: 500;">Twitter</a> 
                    or reply to this email at <a href="mailto:usersup@9takes.com" style="color: #6c5ce7; text-decoration: none; font-weight: 500;">usersup@9takes.com</a>.
                  </p>
                  
                  <!-- Featured content -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td valign="top" width="48%" style="padding-right: 2%;">
                        <a href="https://9takes.com/enneagram-corner/enneagram-types-at-party" style="text-decoration: none;">
                          <img src="https://9takes.com/blogs/greek-statues-party-vibes.webp" alt="Enneagram types at a party" width="100%" style="max-width: 260px; height: auto; display: block; border-radius: 8px; margin-bottom: 12px; filter: sepia(100%) hue-rotate(160deg);">
                          <h3 style="margin: 0 0 10px; color: #2a2d34; font-size: 16px; font-weight: 600;">Enneagram types at a party</h3>
                        </a>
                      </td>
                      <td valign="top" width="48%" style="padding-left: 2%;">
                        <a href="https://9takes.com/enneagram-corner/enneagram-communication-tips" style="text-decoration: none;">
                          <img src="https://9takes.com/blogs/greek-statues-arguing.webp" alt="Enneagram communication tips" width="100%" style="max-width: 260px; height: auto; display: block; border-radius: 8px; margin-bottom: 12px; filter: sepia(100%) hue-rotate(160deg);">
                          <h3 style="margin: 0 0 10px; color: #2a2d34; font-size: 16px; font-weight: 600;">Enneagram communication tips</h3>
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Social links -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-top: 20px; border-top: 1px solid #e4e6eb;">
                        <p style="margin: 0 0 15px; font-size: 16px; color: #65676b;">Follow us</p>
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
                      <td style="color: #65676b; font-size: 14px; line-height: 1.5;">
                        <p style="margin: 0;">&copy; ${currentYear} 9takes. All rights reserved.</p>
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
    <body style="background-color: #f9f9ff; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Thanks for your suggestion! We'll notify you when we publish the analysis.
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
                  <h2 style="margin: 0 0 20px; color: #2a2d34; font-size: 24px; font-weight: 600;">Thanks for Your Suggestion!</h2>
                  
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    We've received your suggestion and will email you when we publish the analysis.
                  </p>
                  
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    In the meantime, explore our <a href="https://9takes.com/personality-analysis" target="_blank" style="color: #6c5ce7; text-decoration: none; font-weight: 500;">other personality analyses</a> that might interest you.
                  </p>
                  
                  <!-- Call to action -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#6c5ce7" style="border-radius: 4px;">
                              <a href="https://9takes.com/personality-analysis" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">
                                Explore Analyses
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    <strong>Feel free to reach out</strong> on
                    <a href="https://twitter.com/9takesdotcom" target="_blank" style="color: #6c5ce7; text-decoration: none; font-weight: 500;">Twitter</a> 
                    or reply to this email at <a href="mailto:usersup@9takes.com" style="color: #6c5ce7; text-decoration: none; font-weight: 500;">usersup@9takes.com</a>.
                  </p>
                  
                  <!-- Social links -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-top: 20px; border-top: 1px solid #e4e6eb;">
                        <p style="margin: 0 0 15px; font-size: 16px; color: #65676b;">Follow us</p>
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
                      <td style="color: #65676b; font-size: 14px; line-height: 1.5;">
                        <p style="margin: 0;">&copy; ${currentYear} 9takes. All rights reserved.</p>
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

export const emailTemplate = (subject, header, body) => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead(subject)}
    <body style="background-color: #f9f9ff; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        ${subject} - 9takes
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
                  <h2 style="margin: 0 0 20px; color: #2a2d34; font-size: 24px; font-weight: 600;">${header}</h2>
                  
                  <div style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    ${body}
                  </div>
                  
                  <p style="margin: 20px 0 30px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    <strong>Feel free to reach out</strong> on
                    <a href="https://twitter.com/9takesdotcom" target="_blank" style="color: #6c5ce7; text-decoration: none; font-weight: 500;">Twitter</a> 
                    or reply to this email at <a href="mailto:usersup@9takes.com" style="color: #6c5ce7; text-decoration: none; font-weight: 500;">usersup@9takes.com</a>.
                  </p>
                  
                  <!-- Social links -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-top: 20px; border-top: 1px solid #e4e6eb;">
                        <p style="margin: 0 0 15px; font-size: 16px; color: #65676b;">Follow us</p>
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
                      <td style="color: #65676b; font-size: 14px; line-height: 1.5;">
                        <p style="margin: 0;">&copy; ${currentYear} 9takes. All rights reserved.</p>
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
    <body style="background-color: #f9f9ff; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        One step away - please confirm your email to start using 9takes.
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
                <td bgcolor="#ffffff" style="padding: 40px 30px; text-align: center;">
                  <h2 style="margin: 0 0 20px; color: #2a2d34; font-size: 24px; font-weight: 600;">Confirm Your Email</h2>
                  
                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    You're almost ready to start using 9takes. Please click the button below to verify your email address.
                  </p>
                  
                  <!-- Call to action -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#6c5ce7" style="border-radius: 4px;">
                              <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 12px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">
                                Confirm Email
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #65676b;">
                    If you didn't sign up for 9takes, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td bgcolor="#f0f2f5" style="padding: 20px 30px; border-top: 1px solid #e4e6eb;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="color: #65676b; font-size: 14px; line-height: 1.5; text-align: center;">
                        <p style="margin: 0;">&copy; ${currentYear} 9takes. All rights reserved.</p>
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
// <p><a href="{{ .ConfirmationURL }}" > <b style="" > Confirm your mail < /b></a > </p>
export const forgotPass = (link) => {
	return `<!DOCTYPE html>
  <html>
    ${EmailHead('Reset Your Password')}
    <body style="background-color: #f9f9ff; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Preheader text (hidden) -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Reset your 9takes password - secure link inside.
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
                  <h2 style="margin: 0 0 20px; color: #2a2d34; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                  
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                    We received a request to reset your password. Click the button below to create a new password. If you didn't make this request, you can safely ignore this email.
                  </p>
                  
                  <!-- Call to action -->
                   <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#6c5ce7" style="border-radius: 4px;">
                              <a href="${link}" target="_blank" style="display: inline-block; padding: 12px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: #65676b;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </p>
                  
                  <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.5; color: #65676b; word-break: break-all; background-color: #f0f2f5; padding: 10px; border-radius: 4px;">
                    ${link}
                  </p>
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
