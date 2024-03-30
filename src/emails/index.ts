import { EmailHead } from './EmailHead';

const from = '9takes Admins';
export const joinEmail = () => {
	return `<!DOCTYPE html>
    <html>
      ${EmailHead('Welcome to the 9takes Waitlist')}
      <body style="background-color: #f6f6f6;">
       <!-- start preheader -->
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          9takes Waitlist
        </div>
        <!-- end preheader -->
       <!-- start body -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
         <!-- start hero -->
          <tr>
            <td align="center" bgcolor="#f6f6f6">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <div class="fun-color" style="border-radius: 3px;">
                      <h1 style="color: #fff!important; display: flex; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
                      padding-left: 30px;">9takes</h1>
                  </div>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end hero -->
         <!-- start copy block -->
          <tr>
            <td align="center" bgcolor="#f6f6f6" style="border-radius: 3px;">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
               <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-size: 18px; line-height: 24px; border-radius: 3px;">
                    <p style="margin: 0;">Thank you for signing up for the waitlist for 9takes. We are excited to have you on board and are excited to hear from you once we launch.</p>
                  </td>
                </tr>
                <!-- end copy -->
               <!-- start button -->
                <!-- <tr>
                  <td align="left" bgcolor="#ffffff" style="border-radius: 3px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" style="border-radius: 6px;">
                                <p> In the mean time check out our socials
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                     <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr style="display:flex; justify-content: center;">
                              <td align="center" bgcolor="#1a82e2" style="border-radius: 6px; margin: 3px; max-width: 119px">
                                <a href="https://www.instagram.com/9takesdotcom/" class="external-link" target="_blank" style="display: flex; justify-content: center; padding: 16px 36px; font-size: 18px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" /></svg>
                                </a>
                              </td>
                               <td align="center" bgcolor="#1a82e2" style="border-radius: 6px; margin: 3px; max-width: 119px">
                                <a href="https://twitter.com/9takesdotcom" class="external-link" target="_blank" style="display: flex; justify-content: center; padding: 16px 36px; font-size: 18px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" /></svg>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr> -->
                <!-- end button -->
               <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-size: 18px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                    <p style="margin: 0;">Cheers,<br>${from}</p>
                  </td>
                </tr>
                <!-- end copy -->
             </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end copy block -->
       </table>
        <!-- end body -->
     </body>
    </html>`;
};

export const joinEmail2 = () => {
	return `<!DOCTYPE html>
    <html>
      ${EmailHead('Welcome to the 9takes Waitlist')}
      <body style="background-color: #f6f6f6;">
        <table style="border-collapse:collapse;width:600px;max-width:600px;margin:0 auto" width="600">
          <tbody>
            <tr style="">
              <td style="border-collapse:collapse;display:block;padding:0 1em;width:600px;max-width:600px;margin:30px auto;background-color:#ffffff"
                width="600" bgcolor="#ffffff">
                <div style="text-align:center">
                  <div value="20" style="padding-top:20px"> </div>
                  <div
                    style="height:100%;padding:45px;border-radius:10px;margin:10px auto;background-color:#ffffff">
                    <h1
                      style="font-size:36px;line-height:40px;letter-spacing:-0.5px;font-weight:600;color:black;margin:0">
                      Welcome to 9takes
                    </h1>
                    <div value="15" style="padding-top:15px"> </div>
                    <div style="font-size:18px;font-weight:400;line-height:32px;color:#333">
                      Thank you for joining the 9takes waitlist! We are excited to have you on board and are
                      excited to hear from you.
                    </div>
                    <div style="font-size:18px;font-weight:400;line-height:32px;color:#333">
                      <div value="15" style="padding-top:15px"> </div><b style="">
                        Feel free to
                        reach out</b> on
                      <a class="external-link" target="_blank" href="https://twitter.com/9takesdotcom"> twitter </a> or reply to
                      this email at usersup@9takes.com.
                    </div>
                    <div value="30" style="padding-top:30px"> </div>
                    <div value="30" style="padding-top:30px">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr align="center">
                        <td valign="top" width="50%">
                          <a href="https://9takes.com/blog/enneagram/enneagram-types-at-party" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                            
                              <img style="border:0;line-height:100%;outline:none;text-decoration:none;background:#d7d7d7;margin:10px; object-fit: cover; width: 230px; height: 230px; filter: sepia(100%) hue-rotate(160deg); border-radius: 5px;"
                                src="https://9takes.com/blogs/greek-statues-party-vibes.webp">
                            </a>
                        </td>
                        <td valign="top" width="50%">
                          <a href="https://9takes.com/blog/enneagram/enneagram-communication-tips" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <img style="border:0;line-height:100%;outline:none;text-decoration:none;background:#d7d7d7;margin:10px; object-fit: cover; width: 230px; height: 230px; filter: sepia(100%) hue-rotate(160deg); border-radius: 5px;"
                          src="https://9takes.com/blogs/greek-statues-arguing.webp">
                      </a>
                        </td>
                      </tr>
                      <tr>
                          <td valign="top" >
                          Enneagram types at a party
                          </td>
                          <td valign="top" >
                            Enneagram communication tips
                          </td>
                        </tr>
                    </table>
                    </div>
                    <div value="30" style="padding-top:30px"> </div>
                    <div value="30" style="padding-top:30px">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" >
                        <tr style="margin: auto" align="center">
                          <td valign="top" align="right">
                              
                            <a class="external-link" target="_blank" href="https://twitter.com/9takesdotcom">
                              <img src="https://9takes.com/icons/twitter.png" alt="Twitter" class="icon" width="50px"/>
                            </a>
                          </td>
                          <td valign="top" align="left">
                              <a class="external-link" target="_blank" href="https://www.instagram.com/9takesdotcom/">
                              <img src="https://9takes.com/icons/instagram.png" alt="Instagram" class="icon" width="50px"/>
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    
    </html>`;
};

export const personSuggestionEmail = () => {
	return `<!DOCTYPE html>
    <html>
      ${EmailHead('Appreciate the suggestion')}
      <body style="background-color: #f6f6f6;">
        <table style="border-collapse:collapse;width:600px;max-width:600px;margin:0 auto" width="600">
          <tbody>
            <tr style="">
              <td style="border-collapse:collapse;display:block;padding:0 1em;width:600px;max-width:600px;margin:30px auto;background-color:#ffffff"
                width="600" bgcolor="#ffffff">
                <div style="text-align:center">
                  <div value="20" style="padding-top:20px"> </div>
                  <div
                    style="height:100%;padding:45px;border-radius:10px;margin:10px auto;background-color:#ffffff">
                   
                    <div value="15" style="padding-top:15px"> </div>
                    <div style="font-size:18px;font-weight:400;line-height:32px;color:#333">
                      <p>We will email you when we write the analysis.</p>
                       <p>In the meantime read our <a class="external-link" target="_blank" href="https://9takes.com/blog/famous-enneagram-types">other blogs.</p>
                    </div>
                    <div style="font-size:18px;font-weight:400;line-height:32px;color:#333">
                      <div value="15" style="padding-top:15px"> </div><b style="">
                        Feel free to
                        reach out</b> on
                      <a class="external-link" target="_blank" href="https://twitter.com/9takesdotcom"> twitter </a> or reply to
                      this email at usersup@9takes.com.
                    </div>
                    <div value="30" style="padding-top:30px"> </div>
                    <div value="30" style="padding-top:30px"> </div>
                    <div value="30" style="padding-top:30px">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" >
                        <tr style="margin: auto; border: none;" align="center">
                          <td valign="top" align="right" style="border: none;">
                              
                            <a class="external-link" target="_blank" href="https://twitter.com/9takesdotcom">
                              <img src="https://9takes.com/icons/twitter.png" alt="Twitter" class="icon" width="50px"/>
                            </a>
                          </td>
                          <td valign="top" align="left" style="border: none;">
                              <a class="external-link" target="_blank" href="https://www.instagram.com/9takesdotcom/">
                              <img src="https://9takes.com/icons/instagram.png" alt="Instagram" class="icon" width="50px"/>
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    
    </html>`;
};

export const emailTemplate = (subject: string, header: string, body: string) => {
	return `<!DOCTYPE html>
    <html>
      ${EmailHead(subject)}
      <body style="background-color: #f6f6f6;">
        <table style="border-collapse:collapse;width:600px;max-width:600px;margin:0 auto" width="600">
          <tbody>
            <tr style="">
              <td style="border-collapse:collapse;display:block;padding:0 1em;width:600px;max-width:600px;margin:30px auto;background-color:#ffffff"
                width="600" bgcolor="#ffffff">
                <div style="text-align:center">
                  <div value="20" style="padding-top:20px"> </div>
                  <div
                    style="height:100%;padding:45px;border-radius:10px;margin:10px auto;background-color:#ffffff">
                    <h1
                      style="font-size:36px;line-height:40px;letter-spacing:-0.5px;font-weight:600;color:black;margin:0">
                      ${header}
                    </h1>
                    <div value="15" style="padding-top:15px"> </div>
                    <div style="font-size:18px;font-weight:400;line-height:32px;color:#333">
                      ${body}
                    </div>
                    <div style="font-size:18px;font-weight:400;line-height:32px;color:#333">
                      <div value="15" style="padding-top:15px"> </div><b style="">
                        Feel free to
                        reach out</b> on
                      <a class="external-link" target="_blank" href="https://twitter.com/9takesdotcom"> twitter </a> or reply to
                      this email at usersup@9takes.com.
                    </div>
                    <div value="30" style="padding-top:30px"> </div>
                    <div value="30" style="padding-top:30px"> </div>
                    <div value="30" style="padding-top:30px">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" >
                        <tr style="margin: auto; border: none;" align="center">
                          <td valign="top" align="right" style="border: none;">
                              
                            <a class="external-link" target="_blank" href="https://twitter.com/9takesdotcom">
                              <img src="https://9takes.com/icons/twitter.png" alt="Twitter" class="icon" width="50px"/>
                            </a>
                          </td>
                          <td valign="top" align="left" style="border: none;">
                              <a class="external-link" target="_blank" href="https://www.instagram.com/9takesdotcom/">
                              <img src="https://9takes.com/icons/instagram.png" alt="Instagram" class="icon" width="50px"/>
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    
    </html>`;
};

// this is in supabase
export const signupEmail = () => {
	return `<!DOCTYPE html>
    <html>
      ${EmailHead('Confirm your email to join 9takes')}
      <body style="background-color: #f6f6f6;">
        <table style="border-collapse:collapse;width:600px;max-width:600px;margin:0 auto" width="600">
          <tbody>
            <tr style="">
              <td style="border-collapse:collapse;display:block;padding:0 1em;width:600px;max-width:600px;margin:30px auto;background-color:#ffffff" width="600" bgcolor="#ffffff">
                <div style="text-align:center">
                  <div value="20" style="padding-top:20px"> </div>
                  <div style="height:100%;padding:45px;border-radius:10px;margin:10px auto;background-color:#ffffff">
                    <h1 style="font-size:36px;line-height:40px;letter-spacing:-0.5px;font-weight:600;color:black;margin:0">
                      Welcome to 9takes
                    </h1>
                    <div value="15" style="padding-top:15px"> </div>
                    <div style="font-size:18px;font-weight:400;line-height:32px;color:#333">
                      <div value="15" style="padding-top:15px"> </div>
                        <p>Follow this link to confirm your account</p>
                        <p><a href="{{ .ConfirmationURL }}"><b style="">Confirm your email</b></a></p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`;
};

export const forgotPass = (link: string) => {
	return `<!DOCTYPE html>
      <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Forgot Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%; /* 1 */
          -webkit-text-size-adjust: 100%; /* 2 */
        }
       /**
         * Remove extra space added to tables and cells in Outlook.
         */
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
       /**
         * Better fluid images in Internet Explorer.
         */
        img {
          -ms-interpolation-mode: bicubic;
        }
       /**
         * Remove blue links for iOS devices.
         */
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
       /**
         * Fix centering issues in Android 4.4.
         */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
       body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          font-family: 'GFS Didot', serif,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif !important;
        }
       /**
         * Collapse table borders to avoid space between cells.
         */
        table {
          border-collapse: collapse !important;
        }
       a {
          color: #1a82e2;
        }
       img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
        .fun-color {
          background: linear-gradient(to right, #F72585, #191970);
        }
       </style>
     </head>
        <body style="background-color: #e9ecef;">
         <!-- start preheader -->
          <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
            Reset Password
          </div>
          <!-- end preheader -->
         <!-- start body -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <!-- start copy block -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                 <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-size: 18px; line-height: 24px;">
                      <p style="margin: 0;">Tap the button below to reset your account password. If you didn't request a new password, you can safely delete this email.</p>
                    </td>
                  </tr>
                  <!-- end copy -->
                 <!-- start button -->
                  <tr>
                    <td align="left" bgcolor="#ffffff">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                  <p><a href="${link}"><b style="font-size:18px;font-weight:400;line-height:32px;">Reset Password</b></a></p>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- end button -->
                 <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-size: 18px; line-height: 24px;">
                      <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                      <p style="margin: 0;"><a href="${link}" class="external-link" target="_blank">${link}</a></p>
                    </td>
                  </tr>
                  <!-- end copy -->
                 <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-size: 18px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                      <p style="margin: 0;">Cheers,<br>${from}</p>
                    </td>
                  </tr>
                  <!-- end copy -->
               </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end copy block -->
         </table>
          <!-- end body -->
       </body>
      </html>`;
};

// Blogs
// survey
// social links- twitter and instagram
