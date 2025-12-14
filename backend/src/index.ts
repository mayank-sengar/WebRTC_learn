import { WebSocketServer ,WebSocket } from "ws";

const wss = new WebSocketServer({port : 8080})

// ts feature for defining type 

//cache the sockets of both the users/browsers 

let senderSocket : null | WebSocket = null;
let receiverSocket : null | WebSocket = null;

wss.on('connection' , (ws) => {

    ws.on('error', console.error);

    ws.on('message',(data:any)=>{
        // incoming data can be a Buffer; parse after converting to string
        const message = JSON.parse(data.toString())
        //identify as sender
        //identify as reciever
        //create offer
        //create answer 
        // add ice candidate :as , GPT: But SDP does NOT contain the actual IP addresses and ports where each peer can be reached.

        if(message.type === "sender"){
           
            senderSocket = ws;
             console.log("sender set")
        }
        else if(message.type === "receiver"){
            receiverSocket = ws;
             console.log("receiver set")
        }
        else if(message.type === "createOffer"){
            //if it is null then 
            if(!senderSocket) return;

            receiverSocket?.send(JSON.stringify({type: "createOffer" , sdp : message.sdp}) );
            console.log("offer forwarded to receiver")
        }
        else if(message.type === "createAnswer"){
             if(!receiverSocket) return;
            senderSocket?.send(JSON.stringify({type: "createAnswer" , sdp : message.sdp}) );
             console.log("answer forwarded to sender")
        }
         else if (message.type === 'iceCandidate') {

            if (ws === senderSocket) {
                 receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            } 
             else if (ws === receiverSocket) {
            senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
            console.log("ice candidate sent ")
         }
        

      

    });
})

