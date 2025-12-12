import { WebSocketServer ,WebSocket } from "ws";

const wss = new WebSocketServer({port : 8080})

// ts feature for defining type 

//cache the sockets of both the users/browsers 

let senderSocket : null | WebSocket = null;
let receiverSocket : null | WebSocket = null;

wss.on('connection' , (ws) => {

    ws.on('error', console.error);

    ws.on('message',(data:any)=>{
        const message = JSON.parse(data)
        //identify as sender
        //identify as reciever
        //create offer
        //create answer 
        // add ice candidate :as , GPT: But SDP does NOT contain the actual IP addresses and ports where each peer can be reached.

        if(message.type === "sender"){
            senderSocket = ws;
        }
        else if(message.type === "reciever"){
            receiverSocket = ws;
        }
        else if(message.type === "createOffer"){
            //if it is null then 
            if(!senderSocket) return;

            receiverSocket?.send(JSON.stringify({type: "offer" , sdp : message.sdp}) );
        }
        else if(message.type === "createAnswer"){
             if(!receiverSocket) return;
            senderSocket?.send(JSON.stringify({type: "offer" , sdp : message.sdp}) );
        }
         else if (message.type === 'iceCandidate') {

            if (ws === senderSocket) {
                 receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            } 
             else if (ws === receiverSocket) {
            senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
         }
        

      

    });


    ws.send('something');
})

