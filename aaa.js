const ss = require('stringify-object');

function makeJsStrByObject(obj) {
  for (const [p, val] of Object.entries(obj)) {
      str += `${p}:${val},\n`;
  }
  console.log("Item: " + "{" + str + "}");
  }


  const b = ss({
    dfgdgF: {dsfdf: '43ewrwer'}
  })

  console.log(b);