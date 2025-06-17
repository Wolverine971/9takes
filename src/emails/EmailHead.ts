// emails/EmailHead.ts
export const EmailHead = (title: string) => {
	return `<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      /* Reset styles to prevent interference from parent application */
      html, body, div, span, applet, object, iframe,
      h1, h2, h3, h4, h5, h6, p, blockquote, pre,
      a, abbr, acronym, address, big, cite, code,
      del, dfn, em, img, ins, kbd, q, s, samp,
      small, strike, strong, sub, sup, tt, var,
      b, u, i, center,
      dl, dt, dd, ol, ul, li,
      fieldset, form, label, legend,
      table, caption, tbody, tfoot, thead, tr, th, td,
      article, aside, canvas, details, embed, 
      figure, figcaption, footer, header, hgroup, 
      menu, nav, output, ruby, section, summary,
      time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
      }
      
      /* Email client compatibility */
      body, table, td, a {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      
      table, td {
        mso-table-rspace: 0pt;
        mso-table-lspace: 0pt;
        border-collapse: collapse !important;
      }
      
      img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }
      
      /* iOS overrides */
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      
      /* Android center fix */
      div[style*="margin: 16px 0"] {
        margin: 0 !important;
      }
      
      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        font-family: 'Noticia Text', serif,-apple-system,BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
        line-height: 1.5;
        color: #333333;
        background-color: #f9f9ff;
      }
      
      /* Typography resets */
      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        line-height: 1.2;
        color: #2a2d34;
        margin-bottom: 16px;
      }
      
      h1 { font-size: 32px; }
      h2 { font-size: 24px; }
      h3 { font-size: 20px; }
      h4 { font-size: 18px; }
      p { margin-bottom: 16px; }
      
      a {
        color: #6c5ce7;
        text-decoration: none;
      }
      
      strong, b {
        font-weight: 600;
      }
      
      /* Branded elements */
      .header-gradient {
        background: linear-gradient(to right, #7158e2, #6c5ce7);
      }
      
      .primary-button {
        background-color: #6c5ce7;
        border-radius: 4px;
        color: #ffffff;
        display: inline-block;
        font-weight: 600;
        letter-spacing: 0.5px;
        padding: 12px 24px;
        text-decoration: none;
      }
      
      .preheader {
        display: none !important;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0;
      }
      
      /* Container styles */
      .email-container {
        max-width: 600px;
        margin: 0 auto;
      }
      
      /* Responsive image */
      .fluid {
        max-width: 100%;
        height: auto;
      }
      
      /* Outlook fix */
      .ExternalClass {
        width: 100%;
      }
      
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
        line-height: 100%;
      }
    </style>
  </head>`;
};
