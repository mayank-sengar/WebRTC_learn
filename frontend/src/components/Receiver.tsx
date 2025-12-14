import {useEffect,useState} from 'react'

const Receiver = () => {
  const [socket,setSocket] = useState<WebSocket | null > (null);

  useEffect(()=>{ 
    const socket = new WebSocket('ws://localhost:8080')
    setSocket(socket);

    socket.onopen = (()=>{
      socket.send(JSON.stringify({type: 'receiver'}));
    })

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      let pc : RTCPeerConnection | null = null;
      //5 Browser 2 receives the offer from the signaling server
      if(message.type === 'createOffer'){
      
         pc = new RTCPeerConnection();
        //6 Browser 2 sets the remote description to the offer
        await pc.setRemoteDescription(
        new RTCSessionDescription(message.sdp)
        );

      pc.onicecandidate = (event) => {
          socket?.send(JSON.stringify({type: 'iceCandidate' ,candidate : event.candidate}));
           console.log(event);
      }

      pc.ontrack = (track) => {
        console.log(track);
      }

        //7 Browser 2 creates an answer
        const answer = await pc.createAnswer();
        //8 Browser 2 sets the local description to be the answer
        await pc.setLocalDescription(answer);


        //9 Browser 2 sends the answer to the other side through the signaling serve
        socket.send(JSON.stringify({type : 'createAnswer', sdp : pc.localDescription}));

        
        
      
      }
      else if(message.type == "iceCandidate"){
        
        pc.addIceCandidate()
        socket?.send(JSON.stringify({type: 'iceCandidate' ,candidate : message.candidate}))
      }

      
    }

  },[]);

  return (
    <div>Receiver</div>
  )
}

export default Receiver