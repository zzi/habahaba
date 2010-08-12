
function JIDQuote(jid) {
	var jidQuoted = jid.clone();
	jidQuoted.setNode(jidQuoted.toString().replace(/%/g, '\\%').replace(/@/g, '%'));
	jidQuoted.setDomain(getSystem('habahaba-domain'));
    return jidQuoted;
}


function JIDUnQuote(jid) {
	var jidUnQuoted = new JSJaCJID(jid.getNode().replace(/([^\\]|^)%/g, '$1@').replace(/\\%/g, '%'))
	jidUnQuoted.setResource(jid.getResource());
    return jidUnQuoted;
}
