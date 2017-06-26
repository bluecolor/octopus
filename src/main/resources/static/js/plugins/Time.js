/*global moment */

define([
	'underscore'
], function (_) {
	'use strict';

  const timeDiffHuman = (then, now) =>{
    const t = moment(new Date(then)),
          n  = moment(new Date(now));
    
    return moment.duration(n.diff(t)).humanize();
  };


	return {
    timeDiffHuman
  };
});