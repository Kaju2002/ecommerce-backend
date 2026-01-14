export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Errornix</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    
    body { 
      font-family: 'Plus Jakarta Sans', 'Inter', Helvetica, Arial, sans-serif; 
      background-color: #f8fafc; 
      margin: 0; 
      padding: 0; 
      -webkit-font-smoothing: antialiased; 
    }
    .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
    .main { 
      background-color: #ffffff; 
      margin: 0 auto; 
      width: 100%; 
      max-width: 600px; 
      border-radius: 20px; 
      overflow: hidden; 
      box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
      border: 1px solid #e2e8f0;
    }
    .header { 
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
      padding: 40px 20px; 
      text-align: center; 
    }
    .logo { 
      color: #ffffff; 
      margin: 0; 
      font-size: 26px; 
      font-weight: 800; 
      letter-spacing: 2px; 
    }
    .content { padding: 48px 50px; }
    .welcome-text { 
      font-size: 28px; 
      font-weight: 800; 
      color: #0f172a; 
      margin: 0 0 10px 0; 
      letter-spacing: -0.5px;
    }
    .confirm-title {
      font-size: 18px;
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 20px;
    }
    .message { 
      color: #475569; 
      line-height: 1.7; 
      font-size: 15px;
      margin-bottom: 30px;
    }
    .otp-box { 
      background-color: #f1f5f9; 
      border-radius: 16px; 
      padding: 35px; 
      text-align: center; 
      margin: 30px 0; 
      border: 1px solid #e2e8f0;
    }
    .otp-code { 
      font-family: 'Monaco', 'Courier New', monospace; 
      font-size: 42px; 
      font-weight: 800; 
      letter-spacing: 12px; 
      color: #0f172a; 
      margin: 15px 0; 
    }
    .footer { 
      text-align: center; 
      padding: 30px; 
      font-size: 12px; 
      color: #94a3b8; 
      background-color: #f8fafc;
    }
    .email-highlight { color: #0f172a; font-weight: 600; }
    
    @media screen and (max-width: 600px) {
      .content { padding: 30px 20px; }
      .otp-code { font-size: 32px; letter-spacing: 8px; }
      .wrapper { padding: 10px 0; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header">
          <h1 class="logo">ERRORNIX</h1>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h2 class="welcome-text">Welcome to the family, {{name}}! 👋</h2>
          <div class="confirm-title">Confirm your email address</div>
          
          <p class="message">
            We're absolutely excited to have you on board! To get started with your 
            premium experience at Errornix, please use the verification code below 
            to secure your account for <span class="email-highlight">{{email}}</span>.
          </p>
          
          <div class="otp-box">
            <p style="text-transform: uppercase; font-size: 12px; font-weight: 700; color: #64748b; margin: 0;">Your Verification Code</p>
            <div class="otp-code">{{otp}}</div>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">This code expires in 15 minutes</p>
          </div>

          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
                  <strong>Quick Tip:</strong> Ensure you enter the code exactly as shown. If you didn't create this account, please ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>© 2026 Errornix Inc. • Malabe Colombo, Ecomerce Fashion</p>
          <p>
            <a href="#" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> • 
            <a href="#" style="color: #64748b; text-decoration: underline;">Support Center</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;
export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #fdfdfd; margin: 0; padding: 0; }
    .wrapper { width: 100%; background-color: #fdfdfd; padding-bottom: 40px; }
    .main { background-color: #ffffff; margin: 20px auto; width: 100%; max-width: 550px; border: 1px solid #eef2f6; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    .status-bar { height: 6px; background: linear-gradient(to right, #f59e0b, #ef4444); }
    .content { padding: 40px; }
    .otp-display { background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 25px; text-align: center; margin: 24px 0; }
    .otp-number { font-size: 40px; font-weight: 800; color: #9a3412; font-family: monospace; }
    .security-note { font-size: 12px; color: #7f8c8d; background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 25px; }
    .footer { text-align: center; padding: 20px; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" align="center">
      <tr><td class="status-bar"></td></tr>
      <tr>
        <td class="content">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 22px; color: #0f172a; margin: 0;">Password Reset Request</h1>
          </div>
          
          <p style="font-size: 15px; color: #334155; line-height: 1.6;">
            We received a request to reset the password for your Errornix account (<strong>{{email}}</strong>).
          </p>

          <div class="otp-display">
            <span style="display: block; font-size: 11px; font-weight: 700; color: #c2410c; text-transform: uppercase; margin-bottom: 8px;">Your Secure Reset Code</span>
            <div class="otp-number">{{otp}}</div>
          </div>

          <p style="font-size: 14px; color: #475569; text-align: center;">
            This code will expire in <strong>15 minutes</strong>.
          </p>

          <div class="security-note">
            <strong>Did not request this?</strong><br>
            If you didn't ask to reset your password, your account is still secure. However, we recommend changing your password if you suspect any unauthorized access.
          </div>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>Sent with 🔒 security by Errornix</p>
          <p>Please do not reply to this automated message.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;
