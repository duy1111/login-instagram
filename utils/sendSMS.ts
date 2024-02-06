import axios from "axios";

const KEY = process.env.MITTO_API_KEY;

export const sendSMS = async (data: {
  from: string;
  to: string;
  text: string;
}) => {
  const { text, to } = data;

  const options = {
    method: "POST",
    url: "https://rest.mittoapi.net/sms",
    headers: {
      "Content-Type": "application/json",
      "X-Mitto-API-Key": KEY,
    },
    data: {
      from: "asd",
      to: `${to}`,
      text,
    },
  };

  try {
    const response = await axios.request(options);
    return true;
  } catch (error) {
    console.error(
      `==============================================================================`
        .yellow
    );
    console.error(`${error}`.red);
    console.error(
      `==============================================================================`
        .yellow
    );
    return false;
  }
};
