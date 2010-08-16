function JIDQuote(jid) {
    /*
     * Quotes JID - replases 
     * '%' by '\%', 
     * '@' by '%' 
     * adds domain for transport and saves current resource
     *
     * input:
     * jid - JSJaCJID object or jid string
     *
     * output:
     * jidQuoted - JSJaCJID object or jid string according by input type
     */
    var isJID = (jid instanceof JSJaCJID);
    if(!isJID) {
        var jid = new JSJaCJID(jid);
    }
    var jidQuoted = jid.clone();
    jidQuoted.setNode(jidQuoted.toString().replace(/%/g, '\\%').replace(/@/g, '%'));
    jidQuoted.setDomain(getSystem('habahaba-domain'));
    return isJID ? jidQuoted : jidQuoted.toString();
}


function JIDUnQuote(jid) {
    /*
     * Unquotes quoted JID - 
     * deletes current domain (if there exists '%' in current node), replaces
     * '%' by '@',
     * '\%' by '%'
     * and saves current resource
     *
     * input:
     * jid - JSJaCJID object or jid string
     *
     * output:
     * jidUnQuoted - JSJaCJID object or jid string according by input type
     */
    var isJID = (jid instanceof JSJaCJID);
    if(!isJID) {
        var jid = new JSJaCJID(jid);
    }
    if(jid.getNode().search('%')) {
        var jidUnQuoted = new JSJaCJID(jid.getNode().replace(/([^\\]|^)%/g, '$1@').replace(/\\%/g, '%'));
        jidUnQuoted.setResource(jid.getResource());
    }
    return isJID ? jidUnQuoted : jidUnQuoted.toString();
}
