// src/emails/BookSessionEmail.ts
import { EmailHead } from './EmailHead';

const from = '9takes Team';
export const welcomeEmail = (name: string) => {
	return `<!DOCTYPE html>
    <html>
      ${EmailHead('Welcome to 9takes - Your Enneagram Journey Begins')}
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
                    
                    <!-- Header with Logo -->
                    <div style="margin-bottom:30px;">
                      <div style="background: linear-gradient(to right, #6c5ce7, #191970); padding: 15px; border-radius: 8px;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">9takes</h1>
                      </div>
                    </div>
                    
                    <!-- Personalized Greeting -->
                    <h1 style="font-size:36px;line-height:40px;letter-spacing:-0.5px;font-weight:600;color:#6c5ce7;margin:0">
                      Hello${name ? ', ' + name : ''}!
                    </h1>
                    
                    <div value="20" style="padding-top:20px"> </div>
                    
                    <!-- Main Content -->
                    <div style="font-size:18px;font-weight:400;line-height:32px;color:#333; text-align:left;">
                      <p>Welcome to <strong>9takes</strong> – where your journey to deeper self-understanding begins!</p>
                      
                      <p>You've taken the first step toward transforming how you understand yourself and your relationships through the wisdom of the Enneagram. This ancient personality system reveals not just <em>how</em> we behave, but <em>why</em> we do what we do.</p>
                      
                      <p>Here's what you can look forward to:</p>
                      
                      <div style="background-color:#f8f8ff; border-left:4px solid #6c5ce7; padding:15px; margin:25px 0; text-align:left;">
                        <ul style="list-style-type:none; padding-left:10px; margin:0;">
                          <li style="margin-bottom:12px; position:relative; padding-left:25px;">
                            <span style="position:absolute; left:0; color:#6c5ce7; font-weight:bold;">✓</span> 
                            <strong>Personalized Insights:</strong> Discover your core motivations and patterns
                          </li>
                          <li style="margin-bottom:12px; position:relative; padding-left:25px;">
                            <span style="position:absolute; left:0; color:#6c5ce7; font-weight:bold;">✓</span> 
                            <strong>Growth Strategies:</strong> Custom approaches for your unique type
                          </li>
                          <li style="margin-bottom:12px; position:relative; padding-left:25px;">
                            <span style="position:absolute; left:0; color:#6c5ce7; font-weight:bold;">✓</span> 
                            <strong>Relationship Wisdom:</strong> Transform how you connect with others
                          </li>
                          <li style="position:relative; padding-left:25px;">
                            <span style="position:absolute; left:0; color:#6c5ce7; font-weight:bold;">✓</span> 
                            <strong>Expert Guidance:</strong> Support from our Enneagram specialists
                          </li>
                        </ul>
                      </div>
                      
                      <p>We're preparing your personalized coaching experience and will be in touch soon with details about scheduling your session.</p>
                      
                      <p>In the meantime, explore these resources to begin your Enneagram journey:</p>
                    </div>
                    
                    <!-- Resource Cards -->
                    <div value="30" style="padding-top:30px">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr align="center">
                        <td valign="top" width="50%">
                          <a href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-decoration: none;">
                            <img style="border:0;line-height:100%;outline:none;text-decoration:none;background:#d7d7d7;margin:10px; object-fit: cover; width: 230px; height: 230px; filter: sepia(100%) hue-rotate(160deg); border-radius: 5px;"
                              src="https://9takes.com/blogs/greek-statues-discovering.webp">
                            <div style="color: #333; font-weight: bold; margin-top: 10px;">Discover Your Type</div>
                          </a>
                        </td>
                        <td valign="top" width="50%">
                          <a href="https://9takes.com/enneagram-corner/enneagram-communication-tips" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-decoration: none;">
                            <img style="border:0;line-height:100%;outline:none;text-decoration:none;background:#d7d7d7;margin:10px; object-fit: cover; width: 230px; height: 230px; filter: sepia(100%) hue-rotate(160deg); border-radius: 5px;"
                              src="https://9takes.com/blogs/greek-statues-arguing.webp">
                            <div style="color: #333; font-weight: bold; margin-top: 10px;">Communication Tips</div>
                          </a>
                        </td>
                      </tr>
                    </table>
                    </div>
                    
                    <!-- Call to Action -->
                    <div value="40" style="padding-top:40px">
                      <div style="background: linear-gradient(to right, #f8f9fa, #e9ecef); padding: 25px; border-radius: 8px; text-align: center;">
                        <p style="font-size: 18px; margin-bottom: 20px;">Ready to dive deeper into your Enneagram journey?</p>
                        <a href="https://9takes.com/enneagram-corner" style="background-color: #6c5ce7; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">Explore Enneagram Resources</a>
                      </div>
                    </div>
                    
                    <!-- Footer Message -->
                    <div style="font-size:18px;font-weight:400;line-height:32px;color:#333; margin-top: 40px; text-align: left;">
                      <p>If you have any questions before your session, simply reply to this email and we'll be happy to help.</p>
                      
                      <p>Looking forward to guiding you on your Enneagram journey,</p>
                      <p style="font-weight: bold;">${from}</p>
                    </div>
                    
                    <!-- Social Links -->
                    <div value="30" style="padding-top:30px; border-top: 1px solid #e9ecef; margin-top: 20px;">
                      <p style="font-size: 14px; color: #6c757d; margin-bottom: 15px;">Connect with us</p>
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" >
                        <tr style="margin: auto" align="center">
                          <td valign="top" align="right">
                            <a class="external-link" target="_blank" href="https://twitter.com/9takesdotcom">
                              <img src="https://9takes.com/icons/twitter.png" alt="Twitter" class="icon" width="40px"/>
                            </a>
                          </td>
                          <td valign="top" align="left">
                            <a class="external-link" target="_blank" href="https://www.instagram.com/9takesdotcom/">
                              <img src="https://9takes.com/icons/instagram.png" alt="Instagram" class="icon" width="40px"/>
                            </a>
                          </td>
                        </tr>
                      </table>
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
