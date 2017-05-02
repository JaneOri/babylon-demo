
export var normalizedWhichMouse = function ( $ev ) {
  var button = $ev.button;

  if ( button === 0 ) {
    return "Left";
  } else if ( button === 2 ) {
    return "Right";
  } else if ( button === 1 ) {
    return "Middle";
  }
  return null;
};

export var normalizedEventKey = function ( $ev ) {
  var key = $ev.key || "";
  var whichVal = $ev.which;
  var whichKey = String.fromCharCode( whichVal );
  var notKeyAndWhichVal = !key && whichVal;
  var shiftKey = $ev.shiftKey;

  if ( key === " " || ( key === "Spacebar" && !shiftKey ) || ( notKeyAndWhichVal === 32 && !shiftKey ) ) {
    return " ";
  }
  if ( key === "\xa0" || ( key === "Spacebar" && shiftKey ) || ( notKeyAndWhichVal === 32 && shiftKey ) ) {
    // non breaking space
    return "\xa0";
  }
  if ( /^Esc/i.test( key ) || notKeyAndWhichVal === 27 ) {
    return "Escape";
  }
  if ( /^Tab$/i.test( key ) || notKeyAndWhichVal === 9 ) {
    return "Tab";
  }
  if ( /^Enter$/i.test( key ) || notKeyAndWhichVal === 13 ) {
    return "Enter";
  }
  if ( /^Shift$/i.test( key ) || notKeyAndWhichVal === 16 ) {
    return "Shift";
  }
  if ( /^Control$/i.test( key ) || notKeyAndWhichVal === 17 ) {
    return "Control";
  }
  if ( /^Alt$/i.test( key ) || notKeyAndWhichVal === 18 ) {
    return "Alt";
  }
  if ( /^CapsLock$/i.test( key ) || notKeyAndWhichVal === 20 ) {
    return "CapsLock";
  }
  if ( /Left$/i.test( key ) || notKeyAndWhichVal === 37 ) {
    return "ArrowLeft";
  }
  if ( /Up$/i.test( key ) || notKeyAndWhichVal === 38 ) {
    return "ArrowUp";
  }
  if ( /Right$/i.test( key ) || notKeyAndWhichVal === 39 ) {
    return "ArrowRight";
  }
  if ( /Down$/i.test( key ) || notKeyAndWhichVal === 40 ) {
    return "ArrowDown";
  }
  if ( key.length === 1 && /[a-zA-Z0-9)!@#$%^&*(:+<_>|~;=,-.\/`]/.test( key ) ) {
    return key;
  }
  if ( notKeyAndWhichVal >= 48 && notKeyAndWhichVal <= 57 ) {
    if ( shiftKey ) {
      return ")!@#$%^&*(".charAt( notKeyAndWhichVal - 48 );
    } else {
      return whichKey;
    }
  }
  if ( notKeyAndWhichVal >= 65 && notKeyAndWhichVal <= 90 ) {
    if ( shiftKey ) {
      return whichKey;
    } else {
      return "abcdefghijklmnopqrstuvwxyz".charAt( notKeyAndWhichVal - 65 );
    }
  }
  if ( notKeyAndWhichVal >= 186 && notKeyAndWhichVal <= 192 ) {
    if ( shiftKey ) {
      return ":+<_>|~".charAt( notKeyAndWhichVal - 186 );
    } else {
      return ";=,-./`".charAt( notKeyAndWhichVal - 186 );
    }
  }
  // TODO: {}[]\?
  return null;
};
