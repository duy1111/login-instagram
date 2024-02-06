import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config({ path: '../config/config.env' });

const accountSid =`${process.env.TWILIO_ACCOUNT_SID}`; // Your Account SID from www.twilio.com/console
const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;
const verifySid = `${process.env.TWILIO_VERIFY_SID}`; // Use your actual Verify service SID
// hostNumber: '+19206452477',

const client = twilio(accountSid, authToken);

interface VerifyResource {
  status: string;
}

interface SMSData {
  from: string;
  to: string;
  text: string;
}

export const sendSMS = async (data: SMSData): Promise<boolean> => {
  const { text, to, from } = data;

  try {
    // Send an SMS
    const message = await client.messages.create({
      body: text,
      from: from, // Your Twilio phone number
      to: to,
    });

    console.log(`Message sent with SID: ${message.sid}`);

    // Send a verification code via SMS
    // const verification = await client.verify.v2.services(verifySid).verifications.create({
    //   to: to,
    //   channel: 'sms',
    // });

    // console.log(`Verification status: ${verification.status}`);

    // // Prompt for OTP
    // //const otpCode = await promptForOTP();

    // // Check the verification code
    // const verificationCheck = await client.verify.v2.services(verifySid).verificationChecks.create({
    //   to: to,
    //   code: "123456",
    // });

    // console.log(`Verification check status: ${verificationCheck.status}`);

    return true;
  } catch (error: any) {
    console.error('Error:', error.message);
    return false;
  }
};

// const promptForOTP = (): Promise<string> => {
//   return new Promise((resolve) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });

//     rl.question('Please enter the OTP: ', (otpCode) => {
//       rl.close();
//       resolve(otpCode);
//     });
//   });
// };



export const verifyCaller=async(phoneNum:string)=>{
  await client.validationRequests
  .create({
     friendlyName: 'Third Party VOIP Number',
     statusCallback: 'https://somefunction.twil.io/caller-id-validation-callback',
     phoneNumber: phoneNum
   })
  .then(validation_request => console.log(validation_request.friendlyName));
}