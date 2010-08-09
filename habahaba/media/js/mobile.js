/*

Jappix - An Open μSocial Platform
These are the Jappix Mobile lightweight JS script

-------------------------------------------------

License: AGPL
Author: Valérian Saliou
Contact: http://project.jappix.com/contact
Last revision: 28/06/10

*/

/* BEGIN CONNECTION FUNCTIONS */

function doLogin(aForm) {
	try {
		// Reset the panels
		resetPanel();
		
		// Get the values
		var xid = aForm.xid.value;
		var splitted = xid.split('@');
		var username = splitted[0];
		var domain = splitted[1];
		var pwd = aForm.pwd.value;
		
		if(username && domain && pwd) {
			// Show the info notification
			showThis('info');
			
			// We define the http binding parameters
			oArgs = new Object();
			oArgs.httpbase = getSystem('http-base');
			oArgs.timerval = 2000;
			
			// We create the new http-binding connection
			con = new JSJaCHttpBindingConnection(oArgs);
			
			// And we handle everything that happen
			con.registerHandler('message', handleMessage);
			con.registerHandler('presence', handlePresence);
			con.registerHandler('iq', handleIQ);
			con.registerHandler('onconnect', handleConnected);
			con.registerHandler('onerror', handleError);
			con.registerHandler('ondisconnect', handleDisconnected);
			
			// We retrieve what the user typed in the login inputs
			oArgs = new Object();
			oArgs.username = username;
			oArgs.domain = domain;
			oArgs.resource = getSystem('resource') + 'Mobile';
			oArgs.pass = pwd;
			
			// We connect !
			con.connect(oArgs);
		}
	}
	
	finally {
		return false;
	}
}

function doLogout() {
	// If the con has been yet aborted, end
	if(!con.connected())
		return false;
	
	// Send unavailable presence
	sendPresence('unavailable');
	
	con.disconnect();
}

/* END CONNECTION FUNCTIONS */

/* BEGIN SHOW/HIDE FUNCTIONS */

function showThis(id) {
	document.getElementById(id).style.display = 'block';
}

function hideThis(id) {
	document.getElementById(id).style.display = 'none';
}

function resetPanel(id) {
	// Hide the opened panels
	hideThis('info');
	hideThis('error');
	
	//Show the target panel
	if(id)
		showThis(id);
}

function resetDOM() {
	// Reset the "secret" input values
	document.getElementById('pwd').value = '';
	
	// Remove the useless DOM elements
	document.getElementById('roster').innerHTML = '';
	document.getElementById('chans').innerHTML = '';
}

/* END SHOW/HIDE FUNCTIONS */

/* BEGIN SYSTEM FUNCTIONS */

function getSystem(id) {
	return document.getElementById(id).value;
}

function osDetect() {
	var platform = navigator.platform;
	
	if(platform.indexOf('Win') != -1) platform = 'Windows';
	else if(platform.indexOf('Linux') != -1) platform = 'Linux';
	else if(platform.indexOf('Mac') != -1) platform = 'MacOS';
	else if(platform.indexOf('X11') != -1) platform = 'UNIX';
	
	return platform;
}

function exists(id) {
	if(!document.getElementById(id))
		return false;
	else
		return true;
}

/* END SYSTEM FUNCTIONS */

/* BEGIN HANDLING FUNCTIONS */

function handleMessage(msg) {
	var type = msg.getType();
	
	if(type == 'chat' || type == 'normal') {
		// Get the body
		var body = msg.getBody();
		
		if(body) {
			// Get the values
			var xid = cutResource(msg.getFrom());
			var hash = hex_md5(xid);
			var nick = getNick(xid, hash);
		
			// Create the chat if it does not exist
			chat(xid);
		
			// Display the message
			displayMessage(xid, body, nick, hash);
		}
	}
}

function handlePresence(pre) {
	// Define the variables
	var xid = cutResource(pre.getFrom());
	var hash = hex_md5(xid);
	var type = pre.getType();
	var show = pre.getShow();
	
	// Online buddy: show it!
	if(!type) {
		showThis('buddy-' + hash);
		
		// Display the correct presence
		switch(show) {
			case 'chat':
				displayPresence(hash, show);
				break;
			
			case 'away':
				displayPresence(hash, show);
				break;
			
			case 'xa':
				displayPresence(hash, show);
				break;
			
			case 'dnd':
				displayPresence(hash, show);
				break;
			
			default:
				displayPresence(hash, 'available');
				break;
		}
	}
	
	else
		hideThis('buddy-' + hash);
}

function handleIQ(iq) {
	// Get the content
	var iqFrom = iq.getFrom();
	var iqID = iq.getID();
	var iqQueryXMLNS = iq.getQueryXMLNS();
	var iqType = iq.getType();
	
	// Create the response
	if(iqType == 'get' && (iqQueryXMLNS == NS_DISCO_INFO || iqQueryXMLNS == NS_VERSION)) {
		var iqResponse = new JSJaCIQ();
		iqResponse.setID(iqID);
		iqResponse.setTo(iqFrom);
		iqResponse.setType('result');
	}
	
	// Disco#infos query
	if(iqQueryXMLNS == NS_DISCO_INFO && iqType == 'get') {
		/* REF: http://xmpp.org/extensions/xep-0030.html */
		
		var iqQuery = iqResponse.setQuery(NS_DISCO_INFO);
		
		// We set the name of the client
		iqQuery.appendChild(iq.appendNode('identity', {
			'category': 'client',
			'type': 'mobile',
			'name': 'Jappix Mobile'
		}));
		
		// We set all the supported features
		var fArray = new Array(
			NS_DISCO_INFO,
			NS_VERSION
		);
		
		for(var i = 0; i < fArray.length; i++)
			iqQuery.appendChild(iq.buildNode('feature', {'var': fArray[i]}));
		
		con.send(iqResponse);
	}
	
	else if(iqQueryXMLNS == NS_VERSION && iqType == 'get') {
		/* REF: http://xmpp.org/extensions/xep-0092.html */
		
		var iqQuery = iqResponse.setQuery(NS_VERSION);
		
		iqQuery.appendChild(iq.buildNode('name', 'Jappix Mobile'));
		iqQuery.appendChild(iq.buildNode('version', getSystem('version')));
		iqQuery.appendChild(iq.buildNode('os', osDetect() + ' (' + navigator.appCodeName + ')'));
		
		con.send(iqResponse);
	}
}

function handleConnected() {
	// Reset the elements
	hideThis('home');
	resetPanel();
	
	// Show the talk page
	showThis('talk');
	
	// Get the roster items
	getRoster();
}

function handleError(error) {
	resetPanel('error');
}

function handleDisconnected() {
	// Reset the elements
	hideThis('talk');
	resetDOM();
	
	// Show the home page
	showThis('home');
}

function handleRoster(iq) {
	if (!iq || iq.getType() != 'result')
		return;
  	
  	// Define some pre-vars
  	var i = 0;
  	var current, xid, nick, oneBuddy, oneID, hash;
  	var roster = document.getElementById('roster');
  	
	// Get roster items
	var iqNode = iq.getNode();
	var bLength = iqNode.getElementsByTagName('item').length;
	
	// Display each elements from the roster
	for(i; i < bLength; i++) {
		// Get the values
		current = iqNode.getElementsByTagName('item').item(i);
		xid = current.getAttribute('jid').htmlEnc();
		nick = current.getAttribute('name');
		hash = hex_md5(xid);
		
		// No defined nick?
		if(!nick)
			nick = getDirectNick(xid);
		
		// Escape the nick
		nick = nick.replace(/'/,'’')
			   .replace(/"/,'”')
			   .htmlEnc();
		
		// Display the values
		oneBuddy = document.createElement('a');
		oneID = 'buddy-' + hash;
		oneBuddy.setAttribute('id', oneID);
		oneBuddy.setAttribute('class', 'one-buddy');
		oneBuddy.setAttribute('onclick', 'chat(\'' + xid + '\', \'' + nick + '\');');
		oneBuddy.innerHTML = nick;
		roster.appendChild(oneBuddy);
	}
	
	// Start handling buddies presence
	sendPresence('', 'available', 1);
}

/* END HANDLING FUNCTIONS */

/* BEGIN SENDING FUNCTIONS */

function sendMessage(aForm) {
	try {
		var body = aForm.body.value;
		var xid = aForm.xid.value;
		var hash = hex_md5(xid);
		
		if(body && xid) {
			// Send the message
			var aMsg = new JSJaCMessage();
			aMsg.setTo(xid);
			aMsg.setType('chat');
			aMsg.setBody(body);
			con.send(aMsg);
			
			// Clear our input
			aForm.body.value = '';
			
			// Display the message we sent
			displayMessage(xid, body, 'me', hash);
		}
	}
	
	finally {
		return false;
	}
}

function sendPresence(type, show, priority, status) {
	var presence = new JSJaCPresence();
	
	if(type)
		presence.setType(type);
	if(show)
		presence.setShow(show);
	if(priority)
		presence.setPriority(priority);
	if(status)
		presence.setStatus(status);
	
	con.send(presence);
}

/* END SENDING FUNCTIONS */

/* BEGIN GETTING FUNCTIONS */

function getRoster() {
	iq = new JSJaCIQ();
	iq.setType('get');
	iq.setQuery(NS_ROSTER);
	
	con.send(iq, handleRoster);
}

function getDirectNick(xid) {
	if(xid.indexOf('@') == -1)
		return xid;
	
	return xid.split('@')[0];
}

function getNick(xid, hash) {
	var path = 'buddy-' + hash;
	
	if(exists(path))
		return document.getElementById(path).innerHTML;
	
	else
		getDirectNick(xid);
}

/* END GETTING FUNCTIONS */

/* BEGIN RESOURCES FUNCTIONS */
function actionResource(aJID, i) {
	// We split if necessary the JID
	if (aJID.indexOf('/') != -1)
		aJID = aJID.split('/')[i];
	
	// We return the value
	return aJID;
}

function cutResource(aJID) {
	return actionResource(aJID, 0);
}

function getResource(aJID) {
	return actionResource(aJID, 1);
}
/* END RESOURCES FUNCTIONS */

/* BEGIN CHAT FUNCTIONS */

function filter(msg) {
	var msg = msg
	
	// Encode in HTML
	.htmlEnc()
	
	// Highlighted text
	.replace(/(\s|^)\*(.+)\*(\s|$)/gi,'$1<em>$2</em>$3')
	
	// Links
	.replace(/(\s|^)((ftp|http|https|file|ssh|irc|xmpp|apt):\/\/[\S]+)(\s|$)/gim, '$1<a href="$2" target="_blank">$2</a>$4');
	
	return msg;
}

function displayMessage(xid, body, nick, hash) {
	// Get the path
	var path = 'content-' + hash;
	
	// Display the message
	html = '<span><b';
	
	if(nick == 'me')
		html += ' class="me">' + getSystem('me');
	else
		html += ' class="him">' + nick;
	
	html += '</b> ' + filter(body) + '</span>';
	
	document.getElementById(path).innerHTML += html;
	
	// Scroll to the last element
	document.getElementById(path).lastChild.scrollIntoView();
}

function returnToRoster() {
	// Hide the chats
	hideThis('chat');
	
	// Show the roster
	showThis('talk');
}

function chatSwitch(hash) {
	// Hide the roster page
	hideThis('talk');
	
	// Hide the other chats
	var divs = document.getElementsByTagName('div');
	var current, i;
	
	for(i = 0; i < divs.length; i++)
		if(divs.item(i).getAttribute('class') == 'one-chat')
			divs.item(i).style.display = 'none';
	
	// Show the chat
	showThis('chat');
	showThis(hash);
}

function createChat(xid, nick, hash) {
	// Define the variables
	var chat = document.getElementById('chans');
	var oneChat = document.createElement('div');
	
	// Apply the DOM modification
	oneChat.setAttribute('id', 'chat-' + hash);
	oneChat.setAttribute('class', 'one-chat');
	oneChat.innerHTML = '<p>' + nick + '</p><div id="content-' + hash + '"></div><form action="#" method="post" onsubmit="return sendMessage(this);"><input type="text" name="body" /><input type="hidden" name="xid" value="' + xid + '" /><input type="submit" class="submit" value="OK" /></form>';
	chat.appendChild(oneChat);
}

function chat(xid, nick) {
	var hash = hex_md5(xid);
	
	// If the chat was not yet opened
	if(!exists('chat-' + hash)) {
		// No nick?
		if(!nick)
			nick = getNick(xid, hash);
		
		// Create the chat
		createChat(xid, nick, hash);
	}
	
	// Switch to the chat
	chatSwitch('chat-' + hash);
}

/* END CHAT FUNCTIONS */

/* BEGIN PRESENCE FUNCTIONS */

function displayPresence(hash, show) {
	document.getElementById('buddy-' + hash).setAttribute('class', 'one-buddy ' + show);
}

/* END PRESENCE FUNCTIONS */

/* BEGIN DOCUMENT EVENTS FUNCTIONS */

onunload = doLogout;

/* END DOCUMENT EVENTS FUNCTIONS */
