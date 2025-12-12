import { useEffect,useState } from "react"


const Sender = () => {
  const [socket,setSocket] = useState<WebSocket | null > (null);
 
  //on mount 
  useEffect(()=>{
  const socket = new WebSocket("ws://localhost:8080");
  setSocket(socket);
  socket.onopen = () =>{
    socket.send(JSON.stringify({type: 'sender'}));

  }
  },[])

  async function  startSendingVideo() { 
    if(!socket) return;
      // RTCPeerConnection - highlevel api ,generates offer and ans
    //1 Browser 1 creates an RTCPeerConnection
      const pc = new RTCPeerConnection();
      //2 Browser 1 creates an offer
      const offer = await pc.createOffer();//sdp

      //3 browser 1 sets the local description to the offer
      await pc.setLocalDescription(offer);

      //4 Browser 1 sends the offer to the other side through the signaling server
      socket?.send(JSON.stringify({type: 'createOffer', sdp: pc.localDescription}));
      

      //10 Browser 1 receives the answer and sets the remote description
    
      socket.onmessage = (event)=>{
        const data = JSON.parse(event.data);
        if(data.type == "createAnswer"){
          pc.setRemoteDescription(data.sdp);
        }
      }


  }
  return (
    <div>
      <button onClick={startSendingVideo}>
       Stream Video
      </button>
    </div>
  )
}

export default Sender