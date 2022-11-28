$(function () {
    var device;
    var isRecording = false;
    var callSid;
    var outgoingConnection;
    var bearerToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNIMkx0MDdzSE15ZlFaWW05S0R4NCJ9.eyJodHRwOi8vbG9jYWxob3N0OjMwMDAvb3JnX2lkIjp7ImlkIjoib3JnX3VBdmo0c2o2Uk5lNGNEUXYiLCJkaXNwbGF5X25hbWUiOiJ5b2xvIG1hbiIsIm5hbWUiOiJ5b2xvbWFuIn0sImlzcyI6Imh0dHBzOi8vZGV2LS01ZXVlaG53LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2MjM4MjNmMjg5NjRiNzAwNzA0NzE5ZjIiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MSIsImh0dHBzOi8vZGV2LS01ZXVlaG53LnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2Njk2MDE0MDUsImV4cCI6MTY2OTY4NzgwNSwiYXpwIjoiNThMeXhzRHU3YXgxMHFibEt0RFVxYlVqVm5ya2ZySk8iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwicGVybWlzc2lvbnMiOlsiYWN0aXZpdGllczpjcmVhdGUiLCJhY3Rpdml0aWVzOmRlbGV0ZSIsImFjdGl2aXRpZXM6ZWRpdCIsImFjdGl2aXRpZXM6dmlldyIsImNhbXBhaWduczpjcmVhdGUiLCJjYW1wYWlnbnM6ZGVsZXRlIiwiY2FtcGFpZ25zOmVkaXQiLCJjYW1wYWlnbnM6dmlldyIsImNvbnRhY3RzOmFsbDpjcmVhdGUiLCJjb250YWN0czphbGw6ZGVsZXRlIiwiY29udGFjdHM6YWxsOmVkaXQiLCJjb250YWN0czphbGw6dmlldyIsImNvbnRhY3RzOm5hbWVfb3JnXyBjb250YWN0X2luZm9fbm9uX2ZvbGxvd2VkOmNyZWF0ZSIsImNvbnRhY3RzOm5hbWVfb3JnX2NvbnRhY3RfaW5mb19ub25fZm9sbG93ZWQ6ZGVsZXRlIiwiY29udGFjdHM6bmFtZV9vcmdfY29udGFjdF9pbmZvX25vbl9mb2xsb3dlZDplZGl0IiwiY29udGFjdHM6bmFtZV9vcmdfY29udGFjdF9pbmZvX25vbl9mb2xsb3dlZDp2aWV3IiwiY29udGFjdHM6dXNlcnNfYW5kX2ZvbGxvd2VkX2NvbnRhY3RzOmNyZWF0ZSIsImNvbnRhY3RzOnVzZXJzX2FuZF9mb2xsb3dlZF9jb250YWN0czpkZWxldGUiLCJjb250YWN0czp1c2Vyc19hbmRfZm9sbG93ZWRfY29udGFjdHM6ZWRpdCIsImNvbnRhY3RzOnVzZXJzX2FuZF9mb2xsb3dlZF9jb250YWN0czp2aWV3IiwiZGVhbHM6Y3JlYXRlIiwiZGVhbHM6ZGVsZXRlIiwiZGVhbHM6ZWRpdCIsImRlYWxzOnZpZXciLCJmb3JtczpjcmVhdGUiLCJmb3JtczpkZWxldGUiLCJmb3JtczplZGl0IiwiZm9ybXM6dmlldyIsImluYm94ZXM6c2hhcmVkOmNyZWF0ZSIsImluYm94ZXM6c2hhcmVkOmRlbGV0ZSIsImluYm94ZXM6c2hhcmVkOmVkaXQiLCJpbmJveGVzOnNoYXJlZDp2aWV3IiwiaW5ib3hlczp1c2VyOmNyZWF0ZSIsImluYm94ZXM6dXNlcjpkZWxldGUiLCJpbmJveGVzOnVzZXI6ZWRpdCIsImluYm94ZXM6dXNlcjp2aWV3IiwicGlwZWxpbmVzOmFsbDpjcmVhdGUiLCJwaXBlbGluZXM6YWxsOmRlbGV0ZSIsInBpcGVsaW5lczphbGw6ZWRpdCIsInBpcGVsaW5lczphbGw6dmlldyIsInBpcGVsaW5lczpkeW5hbWljOmNyZWF0ZSIsInBpcGVsaW5lczpkeW5hbWljOmRlbGV0ZSIsInBpcGVsaW5lczpkeW5hbWljOmVkaXQiLCJwaXBlbGluZXM6ZHluYW1pYzp2aWV3IiwicHJvZHVjdHNfc2VydmljZXM6Y3JlYXRlIiwicHJvZHVjdHNfc2VydmljZXM6ZGVsZXRlIiwicHJvZHVjdHNfc2VydmljZXM6ZWRpdCIsInByb2R1Y3RzX3NlcnZpY2VzOnZpZXciLCJxdW90ZXNfaW52b2ljZXM6Y3JlYXRlIiwicXVvdGVzX2ludm9pY2VzOmRlbGV0ZSIsInF1b3Rlc19pbnZvaWNlczplZGl0IiwicXVvdGVzX2ludm9pY2VzOnZpZXciLCJyZXBvcnRzX2FjdGl2aXR5OnZpZXciLCJyZXBvcnRzX2NhbXBhaWduczp2aWV3IiwicmVwb3J0c19jb252ZXJzYXRpb25zOnZpZXciLCJyZXBvcnRzX2ZvcmVjYXN0OnZpZXciLCJyZXBvcnRzX2Z1bm5lbF9hbmFseXNpczp2aWV3IiwicmVwb3J0c19pbnNpZ2h0czp2aWV3IiwicmVwb3J0c19rbm93bGVkZ2VfYmFzZXM6dmlldyIsInJlcG9ydHNfbmV3X2RlYWxzOnZpZXciLCJyZXBvcnRzX3BpcGVsaW5lX3NpemU6dmlldyIsInJlcG9ydHNfcmV2aWV3czp2aWV3IiwicmVwb3J0c19zYWxlczp2aWV3IiwicmVwb3J0c19zZW50aW1lbnQ6dmlldyIsInJlcG9ydHNfc3VydmV5czp2aWV3IiwicmV2aWV3X3Byb2ZpbGVzOmNyZWF0ZSIsInJldmlld19wcm9maWxlczpkZWxldGUiLCJyZXZpZXdfcHJvZmlsZXM6ZWRpdCIsInJldmlld19wcm9maWxlczp2aWV3Iiwic2V0dGluZ3NfYWNjb3VudF9zZXR0aW5nczpjcmVhdGUiLCJzZXR0aW5nc19hY2NvdW50X3NldHRpbmdzOmRlbGV0ZSIsInNldHRpbmdzX2FjY291bnRfc2V0dGluZ3M6ZWRpdCIsInNldHRpbmdzX2FjY291bnRfc2V0dGluZ3M6dmlldyIsInNldHRpbmdzX2F1dG9tYXRpb25zOmNyZWF0ZSIsInNldHRpbmdzX2F1dG9tYXRpb25zOmRlbGV0ZSIsInNldHRpbmdzX2F1dG9tYXRpb25zOmVkaXQiLCJzZXR0aW5nc19hdXRvbWF0aW9uczp2aWV3Iiwic2V0dGluZ3NfZXhwb3J0X3VzZXJzX2RhdGE6Y3JlYXRlIiwic2V0dGluZ3NfZXhwb3J0X3VzZXJzX2RhdGE6ZGVsZXRlIiwic2V0dGluZ3NfZXhwb3J0X3VzZXJzX2RhdGE6ZWRpdCIsInNldHRpbmdzX2V4cG9ydF91c2Vyc19kYXRhOnZpZXciLCJzZXR0aW5nc19rbm93bGVkZ2VfYmFzZXM6Y3JlYXRlIiwic2V0dGluZ3Nfa25vd2xlZGdlX2Jhc2VzOmRlbGV0ZSIsInNldHRpbmdzX2tub3dsZWRnZV9iYXNlczplZGl0Iiwic2V0dGluZ3Nfa25vd2xlZGdlX2Jhc2VzOnZpZXciLCJzZXR0aW5nc19yZXZpZXdfc2V0dGluZ3M6Y3JlYXRlIiwic2V0dGluZ3NfcmV2aWV3X3NldHRpbmdzOmRlbGV0ZSIsInNldHRpbmdzX3Jldmlld19zZXR0aW5nczplZGl0Iiwic2V0dGluZ3NfcmV2aWV3X3NldHRpbmdzOnZpZXciLCJzZXR0aW5nc19zaGFyZWRfaW5ib3hfc2V0dGluZ3M6Y3JlYXRlIiwic2V0dGluZ3Nfc2hhcmVkX2luYm94X3NldHRpbmdzOmRlbGV0ZSIsInNldHRpbmdzX3NoYXJlZF9pbmJveF9zZXR0aW5nczplZGl0Iiwic2V0dGluZ3Nfc2hhcmVkX2luYm94X3NldHRpbmdzOnZpZXciLCJzZXR0aW5nc191c2VyX2FwaV9hY2Nlc3M6Y3JlYXRlIiwic2V0dGluZ3NfdXNlcl9hcGlfYWNjZXNzOmRlbGV0ZSIsInNldHRpbmdzX3VzZXJfYXBpX2FjY2VzczplZGl0Iiwic2V0dGluZ3NfdXNlcl9hcGlfYWNjZXNzOnZpZXciLCJzZXR0aW5nc191c2Vyc19pbmJveF9zZXR0aW5nczpjcmVhdGUiLCJzZXR0aW5nc191c2Vyc19pbmJveF9zZXR0aW5nczpkZWxldGUiLCJzZXR0aW5nc191c2Vyc19pbmJveF9zZXR0aW5nczplZGl0Iiwic2V0dGluZ3NfdXNlcnNfaW5ib3hfc2V0dGluZ3M6dmlldyIsInNldHRpbmdzX3VzZXJzX293bl9zZXR0aW5nczpjcmVhdGUiLCJzZXR0aW5nc191c2Vyc19vd25fc2V0dGluZ3M6ZGVsZXRlIiwic2V0dGluZ3NfdXNlcnNfb3duX3NldHRpbmdzOmVkaXQiLCJzZXR0aW5nc191c2Vyc19vd25fc2V0dGluZ3M6dmlldyIsInN1cnZleXM6Y3JlYXRlIiwic3VydmV5czpkZWxldGUiLCJzdXJ2ZXlzOmVkaXQiLCJzdXJ2ZXlzOnZpZXciLCJ0ZWFtX2NoYXRfY2hhbm5lbHM6YWxsOmNyZWF0ZSIsInRlYW1fY2hhdF9jaGFubmVsczphbGw6ZGVsZXRlIiwidGVhbV9jaGF0X2NoYW5uZWxzOmFsbDplZGl0IiwidGVhbV9jaGF0X2NoYW5uZWxzOmFsbDp2aWV3IiwidGVhbV9jaGF0X2NoYW5uZWxzOmR5bmFtaWM6Y3JlYXRlIiwidGVhbV9jaGF0X2NoYW5uZWxzOmR5bmFtaWM6ZGVsZXRlIiwidGVhbV9jaGF0X2NoYW5uZWxzOmR5bmFtaWM6ZWRpdCIsInRlYW1fY2hhdF9jaGFubmVsczpkeW5hbWljOnZpZXciXX0.AoRYtRACeE-5JdhCUPU9zGxvkluSM5CDoIJgJ5ZyX3lmOuGyD52vHO6ZMRmmEgfF-YQJUTknDhG7hqOY4gbP_NL5jNw10db6rOGqkeFSgBdwHYj-tOIGoFx78nrHIujW66e8fSmib829MRvoHRmGvu8RvRCBw0ibclvLJuNVq6jf9IgtdeZKFkT7MSaizMb0Uhg5X6XcQcmkZBtzd-AJmr_vi5IytZimcUBSFyf2vlk5Ai6GYZvHvsLNSDm8DzRjowtXcCWPijBxX2TnQ-mWoGBCvWISbwVg8SbGHWCx_FTT_tO8iTMBpyd-ezDCpeicIoD2Pj_tYNZz4W15O4J7Ug";

    log("Requesting Access Token...");
    // Using a relative link to access the Voice Token function
    $.ajax({
        type: "GET", //GET, POST, PUT
        url: 'https://dev-api-basestation.codefirm.net/api/v1/inboxes/voice-calls/token',  //the url to call
        beforeSend: function (xhr) {   //Set token here
            xhr.setRequestHeader("Authorization", 'Bearer '+ bearerToken);
        }
    }).then(function (data) {
            log("Got a token.");
            console.log("Token: " + data.data.token);

            // Setup Twilio.Device
            device = new Twilio.Device(data.data.token, {
                // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
                // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
                codecPreferences: ["opus", "pcmu"],
                // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
                // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
                // a second time and sending the tone twice. This will be default in 2.0.
                fakeLocalDTMF: true,
                // Use `enableRingingState` to enable the device to emit the `ringing`
                // state. The TwiML backend also needs to have the attribute
                // `answerOnBridge` also set to true in the `Dial` verb. This option
                // changes the behavior of the SDK to consider a call `ringing` starting
                // from the connection to the TwiML backend to when the recipient of
                // the `Dial` verb answers.
                enableRingingState: true,
                debug: true,
                // closeProtection: true,
                sounds: {
                    // incoming: 'http://mysite.com/incoming.mp3',
                    // outgoing: 'http://mysite.com/outgoing.mp3',
                    // dtmf8: 'http://mysite.com/8_button.mp3'
                }
            });

            // device.activeConnection().mute(true);
            device.register(data.data.token);


            device.on('registered', device => {
                console.log('The device is ready to receive incoming calls.')
            });


            device.on("ready", function (device) {
                log("Twilio.Device Ready!");
            });

            device.on("error", function (error) {
                console.log('error here', error);
                log("Twilio.Device Error: " + error.message);
            });

            device.on("connect", function (conn) {
                console.log('conn', conn)
                callSid = conn.parameters.CallSid;
                log('Successfully established call ! ');
                $('#modal-call-in-progress').modal('show')
            });

            device.on("onAnswer", function (conn) {
                showCallDuration();
            });

            device.on("disconnect", function (conn) {
                log("Call ended.");
                $('.modal').modal('hide')
            });


            device.on("incoming", function (conn) {
                console.log(conn.parameters)
                log("Incoming connection from " + conn.parameters.From);
                $("#callerNumber").text(conn.parameters.From)
                $("#txtPhoneNumber").text(conn.parameters.From)

                $('#modal-incomming-call').modal('show');
                $('#modal-incomming-call').css('display','block');

                $('.btnReject').bind('click', function () {
                    $('.modal').modal('hide')
                    log("Rejected call ...");
                    conn.reject();
                })

                $('.btnAcceptCall').bind('click', function () {
                    $('.modal').modal('hide')
                    log("Accepted call ...");
                    conn.accept();
                })

            });


        })
        .catch(function (err) {
            console.log(err);
            log("Could not get a token from server!");
        });

    // Bind button to make call
    $('#btnDial').bind('click', function () {
        $('#modal-dial').modal('hide')

        // get the phone number to connect the call to
        var params = {
            To: document.getElementById("phoneNumber").value,
            From: '+19049064208',
            conversationId: 'b24067d5-0bdc-49ca-8045-0e15a26e5b4e',
            contact_id: '3d33a953-74f5-4ce3-a830-23786e9b3e2d',
        };

        // output destination number
        $("#txtPhoneNumber").text(params.To)

        console.log("Calling " + params.To + "...");
        if (device) {
            outgoingConnection = device.connect(params);
            outgoingConnection.on("ringing", function () {
                log("Ringing...");
            });
        }

    })

    // Record
    $('#btnRecord').on('click', function() {
        const thisobject = $(this);
        isRecording = !isRecording;
        let status;
        if(isRecording) {
            thisobject.text('Recording..');
            status = 'start';
        } else {
            thisobject.text('Record');
            status = 'stop';
        }
        // Start or stop recordings
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/recordings",
            data: JSON.stringify({ callId: callSid, status }),
            dataType: "json",
            success: function(data) {
                console.log('Response', response);
                thisobject.text('Stop');
            },
            error: function(result) {
                console.log('Error', error);
            }
        });
    });

    // Dial up features
    $('#modal-call-in-progress-body').on('click', '.btnNumber', function() {


        const dialNumber = parseInt($(this).text(), 10);
        outgoingConnection.sendDigits(dialNumber, {

        })
        outgoingConnection.on('mute', (isMuted, call) => {
            isMuted ? console.log('muted') : console.log('unmuted');
        });

        // $.ajax({
        //     type: "POST",
        //     contentType: "application/json; charset=utf-8",
        //     url: "/dial-calls",
        //     data: JSON.stringify({ callId: callSid, key: dialNumber, To: document.getElementById("phoneNumber").value }),
        //     dataType: "json",
        //     success: function(data) {
        //         console.log('Response', response);
        //     },
        //     error: function(result) {
        //         console.log('Error', error);
        //     }
        // });
    });

    // Bind button to hangup call

    $('.btnHangUp').bind('click', function () {
        $('.modal').modal('hide')
        log("Hanging up...");
        if (device) {
            device.disconnectAll();
        }
    })

    // Activity log
    function log(message) {
        var logDiv = document.getElementById("log");
        logDiv.innerHTML += "<p>&gt;&nbsp;" + message + "</p>";
        logDiv.scrollTop = logDiv.scrollHeight;
    }

});
