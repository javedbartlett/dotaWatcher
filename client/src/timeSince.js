function timeSince(timeStamp) {
  timeStamp = new Date(timeStamp)
  var now = new Date(),
    secondsPast = (now.getTime() - timeStamp) / 1000;

  if (secondsPast <= 4) {
     return 'Just now';
  }
  if (secondsPast < 60) {
    return parseInt(secondsPast) + ' seconds ago';
  }
  if (secondsPast <= 61) {
    return parseInt(secondsPast / 60) + ' minute and ' + parseInt(secondsPast % 60) + ' second ago - game has probably ended';
  }
  if (secondsPast < 120) {
    return parseInt(secondsPast / 60) + ' minute and ' + parseInt(secondsPast % 60) + ' seconds ago - game has probably ended';
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + ' minutes ago';
  }
  if (secondsPast <= 129600) {
    return parseInt(secondsPast / 3600) + ' hours ago';
  }
  if (secondsPast > 129600) {
    return parseInt(secondsPast / 86400) + ' days ago';
  }
  if (secondsPast > 129600) {
    let day = timeStamp.getDate();
    let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
    let year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
    return day + " " + month + year;
  }
}

function timeSince2(timeStamp) {
  timeStamp = new Date(timeStamp)
  var now = new Date(),
    secondsPast = (now.getTime() - timeStamp) / 1000;

  if (secondsPast < 2100) {
    return ' (in progress)';
  }

  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + ' minutes ago';
  }
  if (secondsPast < 7200) {
    return '1 hour ago';
  }
  if (secondsPast <= 129600) {
    return parseInt(secondsPast / 3600) + ' hours ago';
  }
  if (secondsPast > 129600) {
    return parseInt(secondsPast / 86400) + ' days ago';
  }
  if (secondsPast > 129600) {
    let day = timeStamp.getDate();
    let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
    let year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
    return day + " " + month + year;
  }
}

export  { timeSince, timeSince2 };