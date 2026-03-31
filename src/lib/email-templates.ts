export const getWelcomeEmailTemplate = (name: string, baseUrl: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to FC ESCUELA</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            color: #0f172a;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .header {
            padding: 40px 20px;
            text-align: center;
            background-color: #ffffff;
            border-bottom: 1px solid #f1f5f9;
          }
          .logo {
            width: 80px;
            height: 80px;
            border-radius: 12px;
          }
          .content {
            padding: 40px;
            text-align: center;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #fefce8;
            border: 1px solid #fef08a;
            color: #ca8a04;
            text-transform: uppercase;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.2em;
            border-radius: 9999px;
            margin-bottom: 24px;
          }
          h1 {
            margin: 0 0 16px 0;
            font-size: 28px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            color: #020617;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 32px;
          }
          .operator-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #94a3b8;
            margin-bottom: 4px;
          }
          .operator-name {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 32px;
          }
          .btn {
            display: inline-block;
            padding: 16px 32px;
            background-color: #eab308;
            color: #0f172a;
            text-decoration: none;
            font-weight: 800;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border-radius: 12px;
            transition: all 0.3s ease;
          }
          .footer {
            padding: 32px 40px;
            background-color: #f8fafc;
            text-align: center;
            border-top: 1px solid #f1f5f9;
          }
          .footer-text {
            font-size: 10px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            line-height: 2;
          }
          .divider {
            height: 1px;
            background-color: #f1f5f9;
            margin: 32px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${baseUrl}/images/logo.jpg" alt="FC ESCUELA" class="logo">
          </div>
          <div class="content">
            <div class="badge">Registry Activation</div>
            <h1>Membership Registry Confirmed</h1>
            <div class="divider"></div>
            <div class="operator-label">Identity Confirmed</div>
            <div class="operator-name">Operator: ${name}</div>
            <p>
              Your official credentials have been activated across the FC ESCUELA network. 
              You now have unrestricted access to the elite intelligence hub, team protocols, 
              and exclusive member archives.
            </p>
            <a href="${baseUrl}/login" class="btn">Proceed to Login Protocol</a>
          </div>
          <div class="footer">
            <div class="footer-text">
              Official Correspondence | FC ESCUELA Elite Hub<br>
              Technical Infrastructure Protocol v4.0.2<br>
              © 2026 FC ESCUELA. All Rights Reserved.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
