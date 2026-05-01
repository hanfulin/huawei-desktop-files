function main(config) {
  var proxies = config.proxies || [];
  var groups = config["proxy-groups"] || [];
  var usNodes = [];

  for (var i = 0; i < proxies.length; i++) {
    var name = proxies[i] && proxies[i].name;
    if (typeof name === "string" && name.indexOf("美国") !== -1) {
      usNodes.push(name);
    }
  }

  if (usNodes.length === 0) {
    return config;
  }

  function upsertGroup(name, patch) {
    for (var i = 0; i < groups.length; i++) {
      if (groups[i] && groups[i].name === name) {
        for (var key in patch) {
          groups[i][key] = patch[key];
        }
        return;
      }
    }

    patch.name = name;
    groups.push(patch);
  }

  upsertGroup("AI Suite", {
    type: "fallback",
    proxies: usNodes,
    url: "http://cp.cloudflare.com/generate_204",
    interval: 300
  });

  upsertGroup("Others", {
    type: "select",
    proxies: ["AI Suite"]
  });

  config["proxy-groups"] = groups;
  return config;
}
