
/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, star gazer to tell me about ursa minor."
 *  Alexa: "(reads back information about ursa minor)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    constellationInfo = require('./constellationInfo'),
    constellationMyth = require('./constellationMyth');

var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var InformUser = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
InformUser.prototype = Object.create(AlexaSkill.prototype);
InformUser.prototype.constructor = InformUser;

InformUser.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to Star Gazer. You can ask Star Gazer to tell you about a constellation by saying something like, tell me about ursa minor? ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};


InformUser.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

InformUser.prototype.intentHandlers = {
  //constellation info intent
    "ConstellationsIntent": function (intent, session, response) {
      handleConstellationsIntent(intent, session, response);
    },
  //constellation myth intent
    "ConstellationsMythIntent": function (intent, session, response) {
      handleConstellationsMythIntent(intent, session, response);
    },
  //constellation more info intent
    "GetMoreInfoIntent": function (intent, session, response) {
    handleGetMoreInfoIntent(intent, session, response);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Enjoy the stars.";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Sorry about that. I canceled that last action for you. Is there something else I can help you with. For help, say help.";
        response.askWithCard(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask Star Gazer to tell you about a constellation. You can say, Alexa, ask Star Gazer to tell me about Ursa Minor, or, you can say, exit, to close the skill... Now, what can I help you with?";
        var repromptText = "You can ask Star Gazer to tell you about a constellation. You can say, Alexa, ask Star Gazer to tell me about Ursa Minor, or, you can say, exit, to close the skill... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.askWithCard(speechOutput, repromptOutput);
    }
};

//Handles the ConstellationsIntent, which informs the user about a specific constellation
  function handleConstellationsIntent (intent, session, response) {
      var constellationSlot = intent.slots.Constellation,
          constellationName;

      if (constellationSlot && constellationSlot.value){
          constellationName = constellationSlot.value.toLowerCase();
      }

      var sessionAttributes = {};
      session.attributes.constellationName = constellationName;//session remembers what the user said

      var cardTitle = constellationName + ": Information",
          constellation = constellationInfo[constellationName],
          speechOutput,
          speechText,
          repromptOutput;
      if (constellation) {
          speechText = "Would you like to hear more?";
          speechOutput = {
              speech: constellation + speechText,
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };
          var repromptText = "Would you like to hear more?";
          var repromptOutput = {
              speech: repromptText,
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };
          response.askWithCard(speechOutput, repromptOutput, cardTitle, constellation);

      } else {
          var speech;
          if (!constellationName) {
              speech = "I'm sorry, I currently do not have information about that constellation, or I did not understand what you said. Try to repeat yourself, or for help, say help.";
              speechOutput = speech;
              repromptOutput = speech;
          } else {
              speech = "I'm sorry, I currently do not have information about that constellation, or I did not understand what you said. Try to repeat yourself, or for help, say help.";
              speechOutput = speech;
              repromptOutput = speech;
          }
          response.askWithCard(speechOutput, repromptOutput);
      }
}

//Handles a request to ask directly for a myth
function handleConstellationsMythIntent (intent, session, response) {
    var constellationSlot = intent.slots.Constellation,
        constellationName;

    if (constellationSlot && constellationSlot.value){
        constellationName = constellationSlot.value.toLowerCase();
    }

    var cardTitle = constellationName + ": Myth",
        constellation = constellationMyth[constellationName],
        speechOutput,
        speechText,
        repromptOutput;
    if (constellation) {
        speechText = "... I hope you enjoyed that myth. Is there anything else I can help you with?";
        speechOutput = {
            speech: constellation + speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptText = "Is there anything else can I help you with?";
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.askWithCard(speechOutput, repromptOutput, cardTitle, constellation);

    } else {
        var speech,
        speechOutput,
        repromptOutput;
        if (!constellationName) {
            speech = "I'm sorry, I currently do not have information about that constellation, or I did not understand what you said. Try to repeat yourself, or for help, say help.";
            speechOutput = speech;
            repromptOutput = speech;
        } else {
            speech = "I'm sorry, I currently do not have information about that constellation, or I did not understand what you said. Try to repeat yourself, or for help, say help.";
            speechOutput = speech;
            repromptOutput = speech;
        }
        response.askWithCard(speechOutput, repromptOutput);
    }
}

//Handles asking the user if they would like to hear more information about a specific constellation.
function handleGetMoreInfoIntent(intent, session, response) {
  var constellationName = session.attributes.constellationName;

  var cardTitle = constellationName + ": Myth",
      constellation = constellationMyth[constellationName],
      speechOutput;

      speechOutput = {
          speech: constellation,
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
  response.tellWithCard(speechOutput,cardTitle, constellation);

}

exports.handler = function (event, context) {
    var informUser = new InformUser();
    informUser.execute(event, context);
};
