

export enum HTTP_STATUS {
   OK = 200,
   CREATED = 201,
   BAD_REQUEST = 400,
   UNAUTHORIZED = 401,
   PAYMENT_REQUIRED = 402,
   FORBIDDEN = 403,
   NOT_FOUND = 404,
   CONFLICT = 409,
   INTERNAL_SERVER_ERROR = 500,
}


export enum ERROR_MESSAGES {
   WRONG_ID = "Wrong ID",
   TOKEN_EXPIRED = "Token Expired",
   TOKEN_BLACKLISTED = "Token is Blacklisted",
   EMAIL_NOT_FOUND = "Email Not Found",
   FORBIDDEN = "Access denied. You do not have permission to access this resource.",
   BLOCKED = "Your account has been blocked.",
   NOT_ALLOWED = "You are not allowed",
   EMAIL_EXISTS = "Email Already Exists",
   REQUEST_NOT_FOUND = "Request Not Found",
   CATEGORY_EXISTS = "Category Already Exists",
   CATEGORY_NOT_FOUND = "Category Not Found",
   INVALID_TOKEN = "Invalid token",
   INVALID_ROLE = "Invalid user role",
   INVALID_CREDENTIALS = "Invalid credentials provided.",
   USER_NOT_FOUND = "User not found.",
   ROUTE_NOT_FOUND = "Route not found",
   UNAUTHORIZED_ACCESS = "Unauthorized access.",
   SERVER_ERROR = "An error occurred, please try again later.",
   VALIDATION_ERROR = "Validation error occurred.",
   MISSING_PARAMETERS = "Missing required parameters.",
   WRONG_CURRENT_PASSWORD = "Current password is wrong",
   SAME_CURR_NEW_PASSWORD = "Please enter a different password from current",
   INVALID_JSON = "Invalid JSON format in request body.",
   INVALID_STATUS = "Invalid status provided",
   WORKSHOP_NOT_FOUND = "Workshop not found",
   PASSWORD_NOT_MATCH = "New password and confirm password is not matching",
   ID_NOT_FOUND = "ID not found",
   DATA_MISSING = "Some data are missing",
   NOT_FOUND = "Data not found",
   INVALID_SIGNATURE = "Invalid signature",
   INSUFFICIENT_BALANCE = "Insufficient balance in wallet",
   SLOT_ALREADY_BOOKED = "Slot is not availabe"
}


export enum SUCCESS_MESSAGES {
   BOOKING_SUCCESS = "Booking completed",
   CREATED = "Created successfully",
   LOGIN_SUCCESS = "Login successful",
   REGISTRATION_SUCCESS = "Registration completed successfully",
   OTP_SEND_SUCCESS = "OTP sent successfully",
   LOGOUT_SUCCESS = "Logged out successfully",
   UPDATE_SUCCESS = "Updated successfully",
   DELETE_SUCCESS = "Deleted successfully",
   OPERATION_SUCCESS = "Operation completed successfully",
   PASSWORD_RESET_SUCCESS = "Password reset successfully",
   VERIFICATION_SUCCESS = "Verification completed successfully",
   DATA_RETRIEVED = "Data retrieved successfully",
   ACTION_SUCCESS = "Action performed successfully",
   BOOKING_CANCELED = "Booking cancelled",
   RAZORPAY_ORDER_CREATED = "Razorpay order created",
   PAYMENT_VERIFIED = "Payment verified",
   MONEY_ADDED = "Money added to wallet",
   ADDED_TO_FAVORITES = "Added to favorites",
   REMOVED_FROM_FAVORITES = "Removed from favorites",
}

export enum WALLET_TRANSACTION_TYPES {
   DEPOSIT = "deposit",
   REFUND = "refund",
   PURCHASE = "purchase"
}

export type TRole = "customer" | "admin" | "workshop";

export type TWalletTransactionType = keyof typeof WALLET_TRANSACTION_TYPES;

export interface IWalletTransaction {
   type: TWalletTransactionType;
   amount: number;
   timestamp: Date;
}

export const VERIFICATION_MAIL_CONTENT = (
   otp: string
) => `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px;">
   <!-- Logo Section -->
   <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #000; border-radius: 9999px; padding: 12px; margin-bottom: 8px;">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
         </svg>
      </div>
      <h2 style="font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #000; margin: 0;">
         AutoMate
      </h2>
   </div>

   <h1 style="font-size: 24px; font-weight: 700; color: #fbbf24; text-align: center; margin-bottom: 24px;">
      Welcome to AutoMate!
   </h1>
   
   <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin-bottom: 20px; text-align: center;">
      Your journey to seamless automation starts here. Verify your email to get started! 🚗
   </p>
   
   <div style="background-color: #f9fafb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="margin-bottom: 8px; font-size: 16px; color: #4b5563;">Your verification code is:</p>
      <div style="display: inline-block; background-color: #fff; border: 1px solid #e5e7eb; color: #fbbf24; font-size: 36px; font-weight: 700; margin: 8px 0; padding: 16px 24px; border-radius: 8px; letter-spacing: 4px;">
         ${otp}
      </div>
      <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">
         ⏰ Code expires in 2 minutes
      </p>
   </div>
   
   <p style="font-size: 14px; color: #6b7280; margin-top: 20px; text-align: center;">
      🔒 For your security, please don't share this code with anyone.
   </p>
   
   <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="font-size: 14px; color: #6b7280;">
         Need help? We're here for you!<br>
         Contact us at <a href="mailto:support@automate.in" style="color: #fbbf24; text-decoration: none; font-weight: 600;">support@automate.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} AutoMate. All rights reserved.
   </div>
</div>
`;

export const PASSWORD_RESET_MAIL_CONTENT = (
   resetLink: string
) => `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px;">
   <!-- Logo Section -->
   <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #000; border-radius: 9999px; padding: 12px; margin-bottom: 8px;">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
         </svg>
      </div>
      <h2 style="font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #000; margin: 0;">
         AutoMate
      </h2>
   </div>

   <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; color: #fbbf24; margin: 0;">
         Password Reset Request 🔐
      </h1>
      <p style="color: #6b7280; font-size: 16px; margin: 8px 0 0 0;">
         Let's get you back on track! 🚗
      </p>
   </div>

   <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin-bottom: 20px; text-align: center;">
         We received a request to reset your password for your AutoMate account. 
         Your security is our priority!
      </p>
      
      <!-- Action Button Section -->
      <div style="text-align: center;">
         <p style="margin-bottom: 16px; font-size: 16px; color: #4b5563;">
            Click below to reset your password:
         </p>
         
         <a href="${resetLink}" 
            style="background-color: #000; color: #fbbf24; padding: 12px 32px; 
                   text-decoration: none; border-radius: 6px; font-weight: 600; 
                   display: inline-block; font-size: 16px; 
                   transition: all 0.3s ease;"
            onmouseover="this.style.backgroundColor='#1f2937'"
            onmouseout="this.style.backgroundColor='#000'"
            rel="noopener noreferrer"
         >
            Reset Password
         </a>

         <p style="color: #6b7280; font-size: 14px; margin-top: 16px;">
            ⏰ This link expires in 10 minutes
         </p>
      </div>
   </div>

   <div style="background-color: #fefce8; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
         <span style="font-size: 24px; margin-right: 8px; color: #fbbf24;">⚠️</span>
         <h3 style="color: #4b5563; margin: 0; font-size: 18px; font-weight: 600;">Security Tips</h3>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0;">
         <li style="font-size: 14px; color: #6b7280; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #fbbf24; margin-right: 8px;">•</span> Keep this link private
         </li>
         <li style="font-size: 14px; color: #6b7280; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #fbbf24; margin-right: 8px;">•</span> We’ll never ask for your password
         </li>
         <li style="font-size: 14px; color: #6b7280; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #fbbf24; margin-right: 8px;">•</span> Verify you're on our official site
         </li>
      </ul>
   </div>

   <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="font-size: 14px; color: #6b7280;">
         Need assistance? Contact us at<br>
         <a href="mailto:support@automate.in" style="color: #fbbf24; text-decoration: none; font-weight: 600;">support@automate.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} AutoMate. All rights reserved.
   </div>
</div>`;

export const APPROVED_MAIL_CONTENT = () => `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px;">
   <!-- Logo Section -->
   <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #000; border-radius: 9999px; padding: 12px; margin-bottom: 8px;">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
         </svg>
      </div>
      <h2 style="font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #000; margin: 0;">
         AutoMate
      </h2>
   </div>

   <h1 style="font-size: 24px; font-weight: 700; color: #fbbf24; text-align: center; margin-bottom: 24px;">
      Registration Approved!
   </h1>
   
   <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin-bottom: 20px; text-align: center;">
      Great news! Your registration with AutoMate has been approved. Welcome aboard! 🚗
   </p>
   
   <div style="background-color: #f9fafb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="font-size: 16px; color: #4b5563; margin-bottom: 8px;">
         You’re all set to start your journey with us.
      </p>
      <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">
         Log in now to explore seamless automation!
      </p>
   </div>
   
   <p style="font-size: 14px; color: #6b7280; margin-top: 20px; text-align: center;">
      Ready to get started? Head over to your account and dive in!
   </p>
   
   <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="font-size: 14px; color: #6b7280;">
         Need help? We’re here for you!<br>
         Contact us at <a href="mailto:support@automate.in" style="color: #fbbf24; text-decoration: none; font-weight: 600;">support@automate.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} AutoMate. All rights reserved.
   </div>
</div>`;

export const REJECTED_MAIL_CONTENT = () => `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px;">
   <!-- Logo Section -->
   <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #000; border-radius: 9999px; padding: 12px; margin-bottom: 8px;">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
         </svg>
      </div>
      <h2 style="font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #000; margin: 0;">
         AutoMate
      </h2>
   </div>

   <h1 style="font-size: 24px; font-weight: 700; color: #fbbf24; text-align: center; margin-bottom: 24px;">
      Registration Update
   </h1>
   
   <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin-bottom: 20px; text-align: center;">
      We’re sorry to inform you that your registration with AutoMate has been rejected.
   </p>
   
   <div style="background-color: #f9fafb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="font-size: 16px; color: #4b5563; margin-bottom: 8px;">
         This could be due to incomplete details or eligibility criteria.
      </p>
      <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">
         Please review your submission or contact us for more details.
      </p>
   </div>
   
   <p style="font-size: 14px; color: #6b7280; margin-top: 20px; text-align: center;">
      We’re here to assist if you’d like to try again!
   </p>
   
   <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="font-size: 14px; color: #6b7280;">
         Need help? We’re here for you!<br>
         Contact us at <a href="mailto:support@automate.in" style="color: #fbbf24; text-decoration: none; font-weight: 600;">support@automate.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} AutoMate. All rights reserved.
   </div>
</div>`;