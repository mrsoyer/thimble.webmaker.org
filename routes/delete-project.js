var request = require("request");

module.exports = function(config) {
  return function(req, res) {
    var publishURL = config.publishURL;
    var token = req.user.token;
    var projectId = req.params.projectId;
    if(!projectId) {
      res.status(400).send({error: "No project ID specified"});
      return;
    }

    request({
      method: "DELETE",
      uri: publishURL + "/projects/" + projectId,
      headers: {
        "Authorization": "token " + token
      }
    }, function(err, response) {
      if(err) {
        res.status(500).send({error: err});
        return;
      }

      if(response.statusCode !== 204) {
        res.status(response.statusCode).send({error: response.body});
        return;
      }

      if(req.session.project && req.session.project.meta.id == projectId) {
        delete req.session.project;
      }

      res.sendStatus(204);
    });
  };
};
