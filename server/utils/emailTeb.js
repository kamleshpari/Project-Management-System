export function generateForgotPasswordEmail(resetPasswordUrl) {
  
  return `
   <html>
      <head>
        <style>
          body {
            font-family: 'Helvetica', sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
          }
          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 6px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            text-align: center;
            padding-bottom: 20px;
          }
          .email-header h1 {
            font-size: 28px;
            color: #333;
            margin: 0;
          }
          .email-body {
            font-size: 16px;
            color: #555;
            line-height: 1.5;
          }
          .email-body p {
            margin-bottom: 20px;
          }
          .reset-button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            font-size: 16px;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
            margin-top: 20px;
          }
          .reset-button:hover {
            background-color: #0056b3;
          }
          .email-footer {
            font-size: 14px;
            color: #999;
            text-align: center;
            margin-top: 30px;
          }
          .email-footer a {
            color: #007bff;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>${resetPasswordUrl}</h1>
          </div>
          <div class="email-body">
            <p>Dear User,</p>
            <p>We received a request to reset your password. If you didn't make this request, you can ignore this email. Otherwise, please click the button below to reset your password.</p>
            <p><a href="{${resetPasswordUrl}}" class="reset-button">Reset Your Password</a></p>
            <p>If you have any questions or issues, please contact our support team.</p>
          </div>
          <div class="email-footer">
            <p>This email was sent from an unmonitored email address. Please do not reply to it directly.</p>
          </div>
        </div>
      </body>
    </html>
    ;`
}