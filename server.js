// Loading express application packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
// set the view engine to ejs

// Twilio packages
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// Create clients to handle varios things like recordings , get recordings
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;
const identity = process.env.TWILIO_IDENTITY_USERNAME;
const twilioAppSid = process.env.TWILIO_APP_SID;
const transferCallToNumber = process.env.TRANSFER_CALL_TO;

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// Get token for frontend validation to use voice sdk
app.get('/token', async (req, res) => {
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    accountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity }
  );
  // Create a "grant" which enables a client to use Voice as a given user
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: twilioAppSid,
    incomingAllow: true, // Optional: add to allow incoming calls
  });
  await token.addGrant(voiceGrant);
  // Serialize the token to a JWT string
  res.send({
    token: token.toJwt()
  });
});

// Call or dial a number
app.get('/handle-calls', (req, res) => {
  try {
    console.log('req', req.query);
    if (!req.query.To) {
      throw new Error('Phone number is required');
    }
    const twiml = new VoiceResponse();
    twiml.dial({
      callerId: req.query.From,
    }, req.query.To);
    console.log('twiml', twiml.toString());
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } catch (error) {
    console.log('error', error);
    throw error;
  }
});

// Get list of recordings from call id
app.get('/recordings', async (req, res) => {
  try {
    client.calls(req.body.callId)
    .recordings
    .fetch()
    .then(recording => console.log(recording));
  } catch (error) {
    console.log('error', error);
    throw error;
  }
});

// Records or stops call recording at run time from api
app.post('/recordings', async (req, res) => {
  try {
    if(!req.body.callId && !req.body.status) {
      throw new Error('Call id and status is required');
    }
    let response;
    if (req.body.status === 'start') {
      response = await client.calls(req.body.callId).recordings.create();
    } else if(req.body.status === 'start') {
      response =  await client.calls(req.body.callId).recordings.update({pauseBehavior: 'skip', status: 'paused'})
    }
    return res.send({ response });
  } catch (error) {
    console.log('error', error);
    throw error;
  }
});

app.post('/dial-calls', async (req, res) => {
  try {
    if(!req.body.callId && !req.body.key && !req.body.To) {
      throw new Error('Call id and key is required');
    }
    const twiml = new VoiceResponse();
    const dial = twiml.dial();
    dial.number({
        sendDigits: `wwww${req.body.key}`
    }, req.body.To);
    await client.calls(req.body.callId)
          .update({twiml: twiml.toString()})
          .then(call => console.log('call', call))
    return res.send({
      success: true
    });
  } catch (error) {
    console.log('error', error);
    throw error;
  }
});


// Incoming calls handle / Voice calling api
app.get('/twilio', (req, res) => {
  try {
    const twiml = new VoiceResponse();
    const dial = twiml.dial({
      callerId: req.query.From, // Owner / Phone number which is bought from twilio
      timeout: 10, // If calls is not received for this much seconds
      action: '/voice-call' // Route if call not recieved
    }, req.query.To);
    // dial.client('NON-EXISTENT-CLIENT'); // For test purpose returns No-Answer status
    console.log(twiml.toString());
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } catch (error) {
    console.log('error', error);
  }
});

// If Incoming calls not recieved
app.post('/voice-call', (req, res) => {
  try {
    console.log('req', req.query);
    const twiml = new VoiceResponse();
    // Invite callers to text i.e directly no voice response but only sms is feasible to this number
    if(req.body.inviteToText) {
        // Play sound and then send message
        // twiml.play('https://6d2e-103-41-172-18.in.ngrok.io/sounds/audio.mp3');
        twiml.play('https://api.twilio.com/cowbell.mp3');
        // Send message invite callers to text
        const response = new MessagingResponse();
        const messageResponse = response.message('Thank you for calling Us. FYI you can also text with us at this number. How may we help you today?');
        twiml.hangup();
    } else {
      if(req.body.isRecord) {
        twiml.record();
      }
      if (req.body.isVoiceMail) {
        // twiml.play('https://6d2e-103-41-172-18.in.ngrok.io/sounds/audio.mp3');
        twiml.play('https://api.twilio.com/cowbell.mp3');
      } else if (req.body.isForwardCalls) {
        twiml.dial(transferCallToNumber); // Number to be transferred to
      }
    }
    console.log(twiml.toString());
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } catch (error) {
    console.log('error', error);
  }
});

app.listen(1337, () => {
  console.log('App is running on port 1337');
});

