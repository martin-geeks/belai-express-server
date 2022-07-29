import { CourierClient } from "@trycourier/courier";

const API = 'pk_prod_CHNRPTBYZ947D5M2W0KWJKNZEMC9';
const courier = CourierClient({authorizationToken:API});

export async function sendEmail(){
 const { requestId } = await courier.send({
  message: {
    to: {
      data: {
        name: "Marty",
      },
      email: "",
    },
    content: {
      title: "Back to the Future",
      body: "Oh my {{name}}, we need 1.21 Gigawatts!",
    },
    routing: {
      method: "single",
      channels: ["sms"],
    },
  },
});
console.log(requestId)
};
export async function sendVerificationCode(email:string,otp: number){
 const { requestId } = await courier.send({
  message: {
    to: {
      data: {
        name: "Marty",
      },
      email: email,
    },
    content: {
      title: "Verication Code | Belai-Express",
      body: ` Enter the following code ${otp}`,
    },
    routing: {
      method: "single",
      channels: ["email"],
    },
  },
});
  return requestId;
};