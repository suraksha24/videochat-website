const webSocket = new webSocket("WS://2409:4042:2e89:614b:9954:49f1:6c13:1437:3000")

webSocket.onmessage = (event) => {
    handelSignallingData(JSON.parsel(event.data))
}

function handelSignallingData(data) {
    switch (data.type) {
        case "anser":
            peerConn.setRemoteDescription(data.answer)
            break
        case "candidate":
            peerConn.addIceCandidate(data.candidate)
    }
}

let username
function sendusername() {

    username = document.getElementById("username-input").value
    sendData({
        type:"store_user",
    })
}

function sendData(data) {
    data.username = username 
    websocket.sendData(JSON.stringify(data))
}


let localstream
let peerConn
function startcall() {
    document.getElementById("video-call-div")
    .style.display = "inline"

    navigator.getUserMedia({
        video: {
            frameRate: 24,
            width:{
                min: 480, ideal: 720, max: 1280
            },
            aspectsRatio: 1.33333
        },
        audio: true
    },  (stream)=> {
        localStream = stream
        document.getElementaryById("local-video").scrobject=localStream
 
        let configuration = {
            iceServers: [
                {
                    "urls": [
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302"]
                }
            ]
        }

       
        peerConn = new RTCPeerConnection(configuration)    
        peerConn.addStram(localStream)

        peerConn.onaddstream = (e) => {
            document.getElementaryById("remote-video")
            .srcObject = e.stream
        }
          
        peerConn.onicecandidate = ((e) => {
            if (e.candidate == null)
                ruturn

            sendData({
                type: "store_candidate",
                candidate: e.candidate
            })
        })

        createAnsSendOffer()
    },  (error) => {
        console.log(error)
    })
}
function createAndSendOffer() {
    peerConn.createOffer((offer) => {
        sendData({
            type: "store_offer",
            offer: offer

        })

        peerConn.setLocalDescription(offer)
    }, (error)=>{
        console.log(error)
    })
}

let isAudio = true 
function muteAudio() {
    isAudio = !isAudio
    localStream.getAudioTracks()[0].enabled = isAudio
}

let isVideo = true 
function muteVideo() {
    isVideo = !isVideo
    localStream.getVideoTracks()[0].enabled = isVideo
}